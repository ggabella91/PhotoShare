import { Test, TestingModule } from '@nestjs/testing';
import { MessagesAppGateway } from './messages-app.gateway';

describe('MessagesAppGateway', () => {
  let gateway: MessagesAppGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessagesAppGateway],
    }).compile();

    gateway = module.get<MessagesAppGateway>(MessagesAppGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
