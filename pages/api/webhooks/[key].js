import { PrismaClient } from '@prisma/client';
import nextConnect from 'next-connect';
import { getPlatform } from '../../../lib/parser';
import createMessage from '../../../lib/message';
import logdna from '@logdna/logger';

const log = logdna.createLogger(process.env.LOGDNA, {
  app: 'Sentry→Discord',
  level: 'info',
});

const handler = async (request, response) => {
  let prisma;
  let message;

  try {
    const { key } = request.query;

    if (process.env.NODE_ENV === 'development' || request.query.debug) {
      log.info(`Received event for ${key}`, { meta: { body: request.body } });
    } else {
      log.info(`Received event for ${key}`);
    }

    if (request.body == null) {
      log.info(`Empty body received for ${key}`);
      log.flush();
      return response.status(400).send({ success: false });
    }

    prisma = new PrismaClient();

    const webhook = await prisma.webhook.findUnique({
      where: {
        key,
      },
    });

    if (!webhook) {
      log.warn('No associated webhook found', { meta: { key } });
      return response.status(404);
    }

    message = createMessage(request.body);
    log.info('Constructed embed', { meta: { key } });

    const result = await fetch(webhook.url, {
      method: 'POST',
      body: JSON.stringify(message),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!result.ok) {
      switch (result.status) {
        case 429: {
          log.warn('Currently being rate limited', {
            meta: { key },
          });
          log.flush();
          await prisma?.$disconnect();
          response.status(429).json({ success: false });
          return;
        }
        case 500: {
          log.warn('Discord API returned a 500 error', {
            meta: { key },
          });
          log.flush();
          await prisma?.$disconnect();
          response.status(503).json({ success: false });
          return;
        }
      }

      const json = await result.json();

      switch (json.code) {
        case 10015: {
          log.warn(`Found a deleted webhook! Removing ${key}`, {
            meta: { key },
          });
          await prisma.webhook.delete({
            where: {
              key,
            },
          });

          log.flush();
          await prisma?.$disconnect();
          response.status(404).json({ success: false });
          return;
        }
        case 50027: {
          log.error(`Invalid Webhook Token`, {
            meta: { key, url: webhook.url },
          });
          log.flush();
          await prisma?.$disconnect();
          response.status(500).json({ success: false });
          return;
        }
      }

      throw new Error(`Invalid Discord Request: ${JSON.stringify(json)}`);
    }

    log.info('Embed sent', { meta: { key } });

    await prisma.event.create({
      data: {
        platform: getPlatform(request.body),
        webhook: {
          connect: {
            key,
          },
        },
      },
    });
    await prisma.$disconnect();

    log.info('Event created, all done!', { meta: { key } });
    log.flush();
    response.status(200).json({ success: true });
  } catch (error) {
    let meta = { error };

    if (error?.message === 'Invalid Discord Request') {
      meta = {
        ...meta,
        message,
        key: request.query.key,
      };
    } else {
      meta = {
        ...meta,
        payload: request.body,
        key: request.query.key,
      };
    }

    log.error(error.message, { meta });
    log.flush();

    await prisma?.$disconnect();

    response.status(500).json({ success: false });
  }
};

export default nextConnect().post(handler);
