import request from 'supertest';
import { app } from '../../app';

it('Invalid or expired token throws 400 error', async () => {
  await request(app).post('/api/users/signup').send({
    name: 'Test Dude',
    email: 'test@test.com',
    password: 'password',
    passwordConfirm: 'password',
  });

  await request(app).post('/api/users/forgotPassword').send({
    email: 'test@test.com',
  });

  const response = await request(app)
    .patch('/api/users/resetPassword/passwordToken')
    .send({
      password: 'newPassword',
      passwordConfirm: 'newPassword',
    });

  expect(response.status).toEqual(400);
});
