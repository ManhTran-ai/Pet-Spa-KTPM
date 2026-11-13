import request from 'supertest';
import { createApp } from '../../src/app';

describe('health endpoint', () => {
  it('trả về trạng thái ok', async () => {
    const res = await request(createApp()).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok', service: 'petspa-server' });
  });
});
