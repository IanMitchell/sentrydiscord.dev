import crypto from "crypto";
import nextConnect from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/database";

const create = async (request: NextApiRequest, response: NextApiResponse) => {
  try {
    const { url } = request.body;

    // Ensure it's a Discord Webhook
    if (
      !url?.startsWith("https://discord.com/api/webhooks/") &&
      !url?.startsWith("https://ptb.discord.com/api/webhooks/") &&
      !url?.startsWith("https://canary.discord.com/api/webhooks/")
    ) {
      return response
        .status(400)
        .json({ error: "Please use a Discord webhook URL!" });
    }

    // Check for duplicates
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
      key = crypto.randomBytes(8).toString("hex");
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

    return response.status(200).json({ key: record.key });
  } catch (error) {
    console.error(error);
    return response
      .status(500)
      .json({ error: "Sorry, something went wrong. Please try again later." });
  }
};

export default nextConnect().post(create);
