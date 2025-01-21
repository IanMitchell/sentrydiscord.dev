#!/bin/bash

echo "Waiting for the database to be ready..."
until psql $DATABASE_URL -c '\q' 2>/dev/null; do
  sleep 1
done
echo "Database is ready!"

echo "Start Prisma Migration..."
npx prisma migrate dev --name "initial_migration" --preview-feature
echo "Prisma migration completed!"

echo "Generate Prisma Client..."
npx prisma generate
echo "Prisma Client generated!"

echo "Start the application..."
npm run dev
