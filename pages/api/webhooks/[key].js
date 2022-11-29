import { PrismaClient } from '@prisma/client';
import nextConnect from 'next-connect';
import { getPlatform } from '../../../lib/parser';
import createMessage from '../../../lib/message';


const handler = async (request, response) => {
  let prisma;
  let message;

  try {
    const { key } = request.query;

    if (process.env.NODE_ENV === 'development' || request.query.debug) {
    } else {
    }

    if (request.body == null) {
      return response.status(400).send({ success: false });
    }

    prisma = new PrismaClient();

    const webhook = await prisma.webhook.findUnique({
      where: {
        key,
      },
    });

    if (!webhook) {
      return response.status(404);
    }

    message = createMessage(request.body);

    const result = await fetch(webhook.url, {
      method: 'POST',
      body: JSON.stringify(message),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!result.ok) {
      switch (result.status) {
        case 429: {
          await prisma?.$disconnect();
          response.status(429).json({ success: false });
          return;
        }
        case 500: {
          await prisma?.$disconnect();
          response.status(503).json({ success: false });
          return;
        }
      }

      const json = await result.json();

      switch (json.code) {
        case 10015: {
          await prisma.webhook.delete({
            where: {
              key,
            },
          });

          await prisma?.$disconnect();
          response.status(404).json({ success: false });
          return;
        }
        case 50027: {
          await prisma?.$disconnect();
          response.status(500).json({ success: false });
          return;
        }
      }

      throw new Error(`Invalid Discord Request: ${JSON.stringify(json)}`);
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

    response.status(200).json({ success: true });
  } catch (error) {
    let meta = { error };

    if (error?.message?.startsWith('Invalid Discord Request')) {
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


    await prisma?.$disconnect();

    response.status(500).json({ success: false });
  }
};

export default nextConnect().post(handler);
