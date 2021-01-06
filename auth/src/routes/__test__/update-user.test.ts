import request from 'supertest';
import { app } from '../../app';

it('Throws 400 error if password is sent in the request', async () => {
  await request(app).post('/api/users/signup').send({
    name: 'Test Dude',
    email: 'test@test.com',
    password: 'password',
    passwordConfirm: 'password',
  });

  const response = await request(app).patch('/api/users/updateMe').send({
    name: 'Test Dude 2',
    email: 'test2@test.com',
    password: 'sneaky-sneaky',
  });

  expect(response.status).toEqual(400);
});

it('Throws 400 error if email is already in use by another user', async () => {
  await request(app).post('/api/users/signup').send({
    name: 'Test Dude',
    email: 'test@test.com',
    password: 'password',
    passwordConfirm: 'password',
  });

  await request(app).post('/api/users/signup').send({
    name: 'Test Dude 1',
    email: 'test1@test.com',
    password: 'password',
    passwordConfirm: 'password',
  });

  const response = await request(app).patch('/api/users/updateMe').send({
    name: 'Test Dude 2',
    email: 'test@test.com',
  });

  expect(response.status).toEqual(400);
});

it('Name, email, and username are changed successfully', async () => {
  const cookie = await global.signin();

  const name = 'Test Dude 2';
  const email = 'test2@test.com';
  const username = 'testdude720';

  const response = await request(app)
    .patch('/api/users/updateMe')
    .set('Cookie', cookie)
    .send({
      name,
      email,
      username,
    });

  console.log(response);

  expect(response.status).toEqual(200);
  expect(response.body.name).toEqual(name);
  expect(response.body.email).toEqual(email);
  expect(response.body.username).toEqual(username);
});
