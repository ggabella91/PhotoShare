import request from 'supertest';
import { app } from '../../app';

const setupFormData = () => {
  const buffer = Buffer.from('1234'.repeat(1000));

  return buffer;
};

it('returns 201 status after successful post upload', async () => {
  const post = setupFormData();

  return request(app).post('/api/posts/new').send(post).expect(201);
});
