import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const prisma = new PrismaClient();
  const webhookCount = await prisma.webhook.count({
    select: {
      _all: true,
    },
  });
  await prisma.$disconnect();

  return response.status(200).json({
    schemaVersion: 1,
    label: "Webhooks",
    message: webhookCount?._all?.toLocaleString() ?? 0,
    color: "blue",
    style: "for-the-badge",
  });
}
