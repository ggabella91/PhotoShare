import { Test, TestingModule } from '@nestjs/testing';
import { MessagesAppChatGateway } from './messages-app-chat.gateway';

describe('MessagesAppGateway', () => {
  let gateway: MessagesAppChatGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessagesAppChatGateway],
    }).compile();

    gateway = module.get<MessagesAppChatGateway>(MessagesAppChatGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
