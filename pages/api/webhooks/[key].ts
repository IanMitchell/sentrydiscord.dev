import { PrismaClient } from "@prisma/client";
import nextConnect from "next-connect";
import { getPlatform } from "../../../lib/parser";
import createMessage from "../../../lib/message";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  let prisma;
  let message;

  try {
    const { key } = request.query;

    if (process.env.NODE_ENV === "development" || request.query.debug) {
      console.log(`Received event for ${key}`, {
        meta: { body: request.body },
      });
    } else {
      console.log(`Received event for ${key}`);
    }

    if (request.body == null) {
      console.log(`Empty body received for ${key}`);
      return response.status(400).send({ success: false });
    }

    prisma = new PrismaClient();

    const webhook = await prisma.webhook.findUnique({
      where: {
        key,
      },
    });

    if (!webhook) {
      console.warn("No associated webhook found", { meta: { key } });
      return response.status(404);
    }

    message = createMessage(request.body);
    console.log("Constructed embed", { meta: { key } });

    const result = await fetch(webhook.url, {
      method: "POST",
      body: JSON.stringify(message),
      headers: { "Content-Type": "application/json" },
    });

    if (!result.ok) {
      switch (result.status) {
        case 429: {
          console.warn("Currently being rate limited", {
            meta: { key },
          });
          await prisma?.$disconnect();
          response.status(429).json({ success: false });
          return;
        }
        case 500: {
          console.warn("Discord API returned a 500 error", {
            meta: { key },
          });
          await prisma?.$disconnect();
          response.status(503).json({ success: false });
          return;
        }
      }

      const json = await result.json();

      switch (json.code) {
        case 10015: {
          console.warn(`Found a deleted webhook! Removing ${key}`, {
            meta: { key },
          });
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
          console.error(`Invalid Webhook Token`, {
            meta: { key, url: webhook.url },
          });
          await prisma?.$disconnect();
          response.status(500).json({ success: false });
          return;
        }
      }

      throw new Error(`Invalid Discord Request: ${JSON.stringify(json)}`);
    }

    console.info("Embed sent", { meta: { key } });

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

    console.info("Event created, all done!", { meta: { key } });
    response.status(200).json({ success: true });
  } catch (error) {
    let meta: Record<string, any> = { error };

    if (error?.message?.startsWith("Invalid Discord Request")) {
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

    console.error(error.message);
    console.error(meta);

    await prisma?.$disconnect();

    response.status(500).json({ success: false });
  }
};

export default nextConnect().post(handler);
