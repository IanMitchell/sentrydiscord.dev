import prisma from "../../../lib/database";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const eventCount = await prisma.event.count({
    select: {
      _all: true,
    },
  });

  return response.status(200).json({
    schemaVersion: 1,
    label: "Events",
    message: eventCount?._all?.toLocaleString() ?? 0,
    color: "green",
    style: "for-the-badge",
  });
}
