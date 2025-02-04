#!/bin/bash

echo "Start Prisma Migration..."
npx prisma migrate dev --name "initial_migration" --preview-feature
echo "Prisma migration completed!"

echo "Generate Prisma Client..."
npx prisma generate
echo "Prisma Client generated!"

echo "Start the application..."
npm run dev
