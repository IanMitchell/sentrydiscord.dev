import { PrismaClient } from '@prisma/client';
import nextConnect from 'next-connect';
import { getPlatform } from '../../../lib/parser';
import createMessage from '../../../lib/message';

const handler = async (request, response) => {
  try {
    const { key } = request.query;
    const prisma = new PrismaClient();

    const webhook = await prisma.webhook.findUnique({
      where: {
        key,
      },
    });

    if (!webhook) {
      return response.status(404);
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(request.body);
    }

    const message = createMessage(request.body);

    fetch(webhook.url, {
      method: 'POST',
      body: JSON.stringify(message),
      headers: { 'Content-Type': 'application/json' },
    });

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
    console.error(error);
    return response.status(500);
  }
};

export default nextConnect().post(handler);
