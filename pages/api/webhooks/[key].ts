import prisma from "../../../lib/database";
import nextConnect from "next-connect";
import { getPlatform } from "../../../lib/parser";
import createMessage from "../../../lib/message";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  let message;

  try {
    let { key } = request.query;

    if (Array.isArray(key)) {
      key = key[0];
    }

    if (process.env.NODE_ENV === "development" || request.query.debug) {
      console.log(`Received event for ${key}`);
      console.log({ body: request.body });
    } else {
      console.log(`Received event for ${key}`);
    }

    if (request.body == null) {
      console.log(`Empty body received for ${key}`);
      return response.status(400).send({ success: false });
    }

    const webhook = await prisma.webhook.findUnique({
      where: {
        key,
      },
    });

    if (!webhook) {
      console.warn("No associated webhook found");
      console.warn({ key });
      return response.status(404);
    }

    message = createMessage(request.body);
    console.log("Constructed embed");
    console.log({ key });

    const result = await fetch(webhook.url, {
      method: "POST",
      body: JSON.stringify(message),
      headers: { "Content-Type": "application/json" },
    });

    if (!result.ok) {
      switch (result.status) {
        case 429: {
          console.warn("Currently being rate limited");
          console.warn({ key });
          response.status(429).json({ success: false });
          return;
        }
        case 500: {
          console.warn("Discord API returned a 500 error");
          console.warn({ key });
          response.status(503).json({ success: false });
          return;
        }
      }

      const json = await result.json();

      switch (json.code) {
        case 10015: {
          console.warn(`Found a deleted webhook! Removing ${key}`);
          console.warn({
            key,
          });
          await prisma.webhook.delete({
            where: {
              key,
            },
          });

          response.status(404).json({ success: false });
          return;
        }
        case 50027: {
          console.error(`Invalid Webhook Token`);
          console.error({
            key,
            url: webhook.url,
          });
          response.status(500).json({ success: false });
          return;
        }
      }

      throw new Error(`Invalid Discord Request: ${JSON.stringify(json)}`);
    }

    console.info(`Embed sent to ${key}`);

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

    console.info(`Event created for ${key}, all done!`);
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

    response.status(500).json({ success: false });
  }
};

export default nextConnect().post(handler);
