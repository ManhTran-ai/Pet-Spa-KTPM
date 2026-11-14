import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';

export function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN }));
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'petspa-server' });
  });

  return app;
}
