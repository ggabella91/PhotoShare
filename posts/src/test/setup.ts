import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

jest.mock('../nats-wrapper.ts');
jest.mock('../index.ts');
jest.mock('multer');
jest.mock('@ggabella-photo-share/common');

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdf';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});
