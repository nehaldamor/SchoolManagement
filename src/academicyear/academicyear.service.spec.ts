import { Test, TestingModule } from '@nestjs/testing';
import { AcademicyearService } from './academicyear.service';

describe('AcademicyearService', () => {
  let service: AcademicyearService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AcademicyearService],
    }).compile();

    service = module.get<AcademicyearService>(AcademicyearService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
