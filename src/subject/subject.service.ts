import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { CreateSubjectDto } from './dto/create-subject-dto';
import { UpdateSubjectDto } from './dto/update-subject-dto';
import { SubjectRepository } from './subject.repository';

@Injectable()
export class SubjectService {
  constructor(private readonly subjectRepository: SubjectRepository) {}

  async createSubject(createSubjectDto: CreateSubjectDto) {
    const subject = await this.withUniqueCodeHandling(() =>
      this.subjectRepository.createSubject(createSubjectDto),
    );
    return { message: 'Subject created successfully', subject };
  }

  getSubjects() {
    return this.subjectRepository.getSubjects();
  }

  async getSubject(id: string) {
    const subject = await this.subjectRepository.findSubjectById(id);
    if (!subject) {
      throw new NotFoundException('Subject not found');
    }
    return subject;
  }

  async updateSubject(id: string, updateData: UpdateSubjectDto) {
    await this.getSubject(id);
    if (Object.values(updateData).every((value) => value === undefined)) {
      throw new BadRequestException('At least one field must be provided');
    }

    const subject = await this.withUniqueCodeHandling(() =>
      this.subjectRepository.updateSubject(id, updateData),
    );
    return { message: 'Subject updated successfully', subject };
  }

  async deleteSubject(id: string) {
    await this.getSubject(id);
    await this.subjectRepository.deleteSubject(id);
    return { message: 'Subject deleted successfully' };
  }

  private async withUniqueCodeHandling<T>(operation: () => Promise<T>) {
    try {
      return await operation();
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('A subject with this code already exists');
      }
      throw error;
    }
  }
}
