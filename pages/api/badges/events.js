import { PrismaClient } from '@prisma/client';

export default async function handler(request, response) {
  const prisma = new PrismaClient();
  const eventCount = await prisma.event.count({
    select: {
      _all: true,
    },
  });
  await prisma.$disconnect();

  return response.status(200).json({
    schemaVersion: 1,
    label: 'Events',
    message: eventCount?._all?.toLocaleString() ?? 0,
    color: 'green',
    style: 'for-the-badge',
  });
}
