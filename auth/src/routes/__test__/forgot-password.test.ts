import request from 'supertest';
import { app } from '../../app';

it('Incorrect email results in a 404 error', async () => {
  const response = await request(app).post('/api/users/forgotPassword').send({
    email: 'test@test.com',
  });

  expect(response.status).toEqual(404);
});

it('Creates a password reset token', async () => {
  await request(app).post('/api/users/signup').send({
    name: 'Test Dude',
    email: 'test@test.com',
    password: 'password',
    passwordConfirm: 'password',
  });

  const response = await request(app).post('/api/users/forgotPassword').send({
    email: 'test@test.com',
  });

  expect(response.body.passwordResetExpires).toBeDefined();
  expect(response.status).toEqual(200);
});
