import { Test, TestingModule } from '@nestjs/testing';
import { ClasssubjectController } from './classsubject.controller';
import { ClasssubjectService } from './classsubject.service';

describe('ClasssubjectController', () => {
  let controller: ClasssubjectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClasssubjectController],
      providers: [{ provide: ClasssubjectService, useValue: {} }],
    }).compile();

    controller = module.get<ClasssubjectController>(ClasssubjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
