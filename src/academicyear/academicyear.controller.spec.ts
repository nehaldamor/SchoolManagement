import { Test, TestingModule } from '@nestjs/testing';
import { AcademicyearController } from './academicyear.controller';

describe('AcademicyearController', () => {
  let controller: AcademicyearController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AcademicyearController],
    }).compile();

    controller = module.get<AcademicyearController>(AcademicyearController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
