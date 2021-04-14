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
    log.info(`Recieved event for ${key}`);

    prisma = new PrismaClient();

    const webhook = await prisma.webhook.findUnique({
      where: {
        key,
      },
    });

    if (!webhook) {
      log.warn('No associated webhook found');
      return response.status(404);
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(request.body);
    }

    message = createMessage(request.body);
    log.info('Constructed embed');

    const result = await fetch(webhook.url, {
      method: 'POST',
      body: JSON.stringify(message),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!result.ok) {
      throw new Error('Invalid Discord Request');
    }

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

    return response.status(200);
  } catch (error) {
    log.error(error.message, { meta: { error, message } });
    await prisma?.$disconnect();
    return response.status(500);
  }
};

export default nextConnect().post(handler);
