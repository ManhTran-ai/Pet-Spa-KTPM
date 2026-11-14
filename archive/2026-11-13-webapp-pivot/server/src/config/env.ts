import { config } from 'dotenv';

config();

const toBool = (value: string | undefined): boolean => value === 'true';

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.PORT ?? 4000),
  DATABASE_URL: process.env.DATABASE_URL ?? '',
  DATABASE_URL_TEST: process.env.DATABASE_URL_TEST ?? '',
  JWT_SECRET: process.env.JWT_SECRET ?? '',
  TEST_MODE: toBool(process.env.TEST_MODE),
  TZ_NAME: process.env.TZ_NAME ?? 'Asia/Ho_Chi_Minh',
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
};
