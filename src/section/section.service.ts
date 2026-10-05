import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { SectionRepository } from './section.repository';
import { CreateSectionDto } from './dto/create-section-dto';
import { UpdateSectionDto } from './dto/update-section-dto';

@Injectable()
export class SectionService {
  constructor(private readonly sectionRepository: SectionRepository) {}

  async createSection(createSectionData: CreateSectionDto) {
    const existingSection = await this.sectionRepository.findSection(
      createSectionData.name,
      createSectionData.class_id,
      createSectionData.academic_year_id,
    );

    if (existingSection) {
      throw new ConflictException(
        'A section with this name already exists for this class and academic year',
      );
    }

    const section = await this.withDuplicateHandling(() =>
      this.sectionRepository.createSection(createSectionData),
    );
    return { message: 'Section created successfully', section };
  }

  async getSections() {
    return this.sectionRepository.getAllSections();
  }

  async getSection(id: string) {
    const section = await this.sectionRepository.findSectionById(id);
    if (!section) {
      throw new NotFoundException('Section not found');
    }
    return section;
  }

  async updateSection(id: string, updateData: UpdateSectionDto) {
    const currentSection = await this.getSection(id);
    if (Object.values(updateData).every((value) => value === undefined)) {
      throw new BadRequestException('At least one field must be provided');
    }

    const name = updateData.name ?? currentSection.name;
    const classId = updateData.class_id ?? currentSection.class_id;
    const academicYearId =
      updateData.academic_year_id ?? currentSection.academic_year_id;
    const duplicate = await this.sectionRepository.findSection(
      name,
      classId,
      academicYearId,
    );

    if (duplicate && duplicate.id !== id) {
      throw new ConflictException(
        'A section with this name already exists for this class and academic year',
      );
    }

    const section = await this.withDuplicateHandling(() =>
      this.sectionRepository.updateSection(id, updateData),
    );
    return { message: 'Section updated successfully', section };
  }

  async deleteSection(id: string) {
    await this.getSection(id);
    await this.sectionRepository.deleteSection(id);
    return { message: 'Section deleted successfully' };
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
          'A section with this name already exists for this class and academic year',
        );
      }
      throw error;
    }
  }
}
