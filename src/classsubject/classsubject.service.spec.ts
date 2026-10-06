import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ClasssubjectRepository } from './classsubject.repository';
import { ClasssubjectService } from './classsubject.service';

describe('ClasssubjectService', () => {
  let service: ClasssubjectService;
  let repository: {
    findClassById: jest.Mock;
    findSubjectById: jest.Mock;
    findAssignmentById: jest.Mock;
    findAssignmentByPair: jest.Mock;
    createAssignment: jest.Mock;
    getAssignments: jest.Mock;
    updateAssignment: jest.Mock;
    deleteAssignment: jest.Mock;
  };

  beforeEach(async () => {
    const repositoryMock = {
      findClassById: jest.fn(),
      findSubjectById: jest.fn(),
      findAssignmentById: jest.fn(),
      findAssignmentByPair: jest.fn(),
      createAssignment: jest.fn(),
      getAssignments: jest.fn(),
      updateAssignment: jest.fn(),
      deleteAssignment: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClasssubjectService,
        { provide: ClasssubjectRepository, useValue: repositoryMock },
      ],
    }).compile();

    service = module.get<ClasssubjectService>(ClasssubjectService);
    repository = repositoryMock;
  });

  it('assigns a subject to an existing class', async () => {
    const payload = { class_id: 'class-id', subject_id: 'subject-id' };
    const record = { id: 'assignment-id', ...payload };
    repository.findClassById.mockResolvedValue({ id: payload.class_id });
    repository.findSubjectById.mockResolvedValue({ id: payload.subject_id });
    repository.createAssignment.mockResolvedValue(record);

    await expect(service.assignSubject(payload)).resolves.toEqual({
      message: 'Subject assigned to class successfully',
      assignment: record,
    });
    expect(repository.createAssignment).toHaveBeenCalledWith(payload);
  });

  it('rejects an assignment when its class does not exist', async () => {
    repository.findClassById.mockResolvedValue(null);
    repository.findSubjectById.mockResolvedValue({ id: 'subject-id' });

    await expect(
      service.assignSubject({ class_id: 'missing', subject_id: 'subject-id' }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(repository.createAssignment).not.toHaveBeenCalled();
  });

  it('rejects updates without any fields', async () => {
    repository.findAssignmentById.mockResolvedValue({
      id: 'assignment-id',
      class_id: 'class-id',
      subject_id: 'subject-id',
    });

    await expect(
      service.updateAssignment('assignment-id', {}),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects a duplicate class-subject pair on update', async () => {
    repository.findAssignmentById.mockResolvedValue({
      id: 'assignment-id',
      class_id: 'class-id',
      subject_id: 'subject-id',
    });
    repository.findClassById.mockResolvedValue({ id: 'class-id' });
    repository.findSubjectById.mockResolvedValue({ id: 'subject-id' });
    repository.findAssignmentByPair.mockResolvedValue({
      id: 'other-assignment',
    });

    await expect(
      service.updateAssignment('assignment-id', { subject_id: 'subject-id' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
