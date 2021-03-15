import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import nextConnect from 'next-connect';

const create = async (request, response) => {
  try {
    const { url } = request.body;

    // Ensure it's a Discord Webhook
    if (!url?.startsWith('https://discord.com/api/webhooks/')) {
      return response
        .status(400)
        .json({ error: 'Please use a Discord webhook URL!' });
    }

    // Check for duplicates
    const prisma = new PrismaClient();
    const webhook = await prisma.webhook.findUnique({
      where: {
        url,
      },
    });

    if (webhook != null) {
      return response.status(200).json({ key: webhook.key });
    }

    // Create a new entry, but make sure the key is unique
    let key = null;
    let record = null;
    do {
      key = crypto.randomBytes(8).toString('hex');
      record = await prisma.webhook.findUnique({
        where: {
          key,
        },
      });
    } while (record != null);

    record = await prisma.webhook.create({
      data: {
        key,
        url: request.body.url,
      },
    });
    await prisma.$disconnect();

    return response.status(200).json({ key: record.key });
  } catch (error) {
    console.error(error);
    return response
      .status(500)
      .json({ error: 'Sorry, something went wrong. Please try again later.' });
  }
};

export default nextConnect().post(create);
