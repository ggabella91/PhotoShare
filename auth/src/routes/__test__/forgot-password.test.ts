import request from 'supertest';
import { app } from '../../app';

it('Creates a password reset token', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      name: 'Test Dude',
      email: 'test@test.com',
      password: 'password',
      passwordConfirm: 'password',
    })
    .expect(201);

  const { body: user } = await request(app)
    .post('/api/users/forgotPassword')
    .send({
      email: 'test@test.com',
    });

  expect(user.passwordResetExpires).toBeDefined();
});
