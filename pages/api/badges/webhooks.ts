import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/database";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const webhookCount = await prisma.webhook.count({
    select: {
      _all: true,
    },
  });

  return response.status(200).json({
    schemaVersion: 1,
    label: "Webhooks",
    message: webhookCount?._all?.toLocaleString() ?? 0,
    color: "blue",
    style: "for-the-badge",
  });
}
