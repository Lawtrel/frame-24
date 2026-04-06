#!/bin/sh
set -e

echo "[api] Applying Prisma migrations..."
cd /app/packages/db
./node_modules/.bin/prisma migrate deploy --config ./prisma.config.ts
cd /app

echo "[api] Starting NestJS API in production mode..."
exec node apps/api/dist/main.js
