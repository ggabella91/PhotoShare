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

it('Name and email are changed successfully', async () => {
  const cookie = await global.signin();

  // await request(app)
  //   .get('/api/users/currentuser')
  //   .set('Cookie', cookie)
  //   .send()
  //   .expect(200);

  const name = 'Test Dude 2';
  const email = 'test2@test.com';

  const response = await request(app)
    .patch('/api/users/updateMe')
    .set('Cookie', cookie)
    .send({
      name,
      email,
    });

  expect(response.status).toEqual(200);
  //@ts-ignore
  expect(response.body.name).toEqual(name);
  //@ts-ignore
  expect(response.body.email).toEqual(email);
});
