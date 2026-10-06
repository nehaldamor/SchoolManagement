import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { ClasssubjectRepository } from './classsubject.repository';
import { CreateClasssubjectDto } from './dto/create-classsubject-dto';
import { GetClasssubjectsDto } from './dto/get-classsubjects-dto';
import { UpdateClasssubjectDto } from './dto/update-classsubject-dto';

@Injectable()
export class ClasssubjectService {
  constructor(
    private readonly classsubjectRepository: ClasssubjectRepository,
  ) {}

  async assignSubject(assignment: CreateClasssubjectDto) {
    await this.validateReferences(assignment.class_id, assignment.subject_id);

    const created = await this.withDuplicateHandling(() =>
      this.classsubjectRepository.createAssignment(assignment),
    );
    return { message: 'Subject assigned to class successfully', assignment: created };
  }

  getAssignments(filters: GetClasssubjectsDto) {
    return this.classsubjectRepository.getAssignments(filters);
  }

  async getAssignment(id: string) {
    const assignment = await this.classsubjectRepository.findAssignmentById(id);
    if (!assignment) {
      throw new NotFoundException('Class-subject assignment not found');
    }
    return assignment;
  }

  async updateAssignment(id: string, updateData: UpdateClasssubjectDto) {
    const current = await this.getAssignment(id);
    if (Object.values(updateData).every((value) => value === undefined)) {
      throw new BadRequestException('At least one field must be provided');
    }

    const class_id = updateData.class_id ?? current.class_id;
    const subject_id = updateData.subject_id ?? current.subject_id;
    await this.validateReferences(class_id, subject_id);
    const duplicate = await this.classsubjectRepository.findAssignmentByPair(
      class_id,
      subject_id,
    );
    if (duplicate && duplicate.id !== id) {
      throw new ConflictException(
        'This subject is already assigned to this class',
      );
    }

    const assignment = await this.withDuplicateHandling(() =>
      this.classsubjectRepository.updateAssignment(id, updateData),
    );
    return { message: 'Class-subject assignment updated successfully', assignment };
  }

  async removeAssignment(id: string) {
    await this.getAssignment(id);
    await this.classsubjectRepository.deleteAssignment(id);
    return { message: 'Subject unassigned from class successfully' };
  }

  private async validateReferences(class_id: string, subject_id: string) {
    const [classRecord, subject] = await Promise.all([
      this.classsubjectRepository.findClassById(class_id),
      this.classsubjectRepository.findSubjectById(subject_id),
    ]);
    if (!classRecord) {
      throw new NotFoundException('Class not found');
    }
    if (!subject) {
      throw new NotFoundException('Subject not found');
    }
  }

  private async withDuplicateHandling<T>(operation: () => Promise<T>) {
    try {
      return await operation();
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'This subject is already assigned to this class',
        );
      }
      throw error;
    }
  }
}
