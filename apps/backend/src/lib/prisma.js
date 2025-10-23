import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../../generated/prisma/index.js';

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3307,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'lawtrel',
  database: process.env.DB_NAME || 'frame24',
});

const prisma = new PrismaClient({ adapter });

export default prisma;
