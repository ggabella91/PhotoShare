import { Test, TestingModule } from '@nestjs/testing';
import { MessagesAppController } from './messages-app.controller';
import { MessagesAppService } from './messages-app.service';

describe('MessagesAppController', () => {
  let appController: MessagesAppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MessagesAppController],
      providers: [MessagesAppService],
    }).compile();

    appController = app.get<MessagesAppController>(MessagesAppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
