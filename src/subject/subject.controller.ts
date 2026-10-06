import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateSubjectDto } from './dto/create-subject-dto';
import { UpdateSubjectDto } from './dto/update-subject-dto';
import { SubjectService } from './subject.service';

@UseGuards(AuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('subject')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Post('create-subject')
  createSubject(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectService.createSubject(createSubjectDto);
  }

  @Get('get-subjects')
  getSubjects() {
    return this.subjectService.getSubjects();
  }

  @Get(':id')
  getSubject(@Param('id', ParseUUIDPipe) id: string) {
    return this.subjectService.getSubject(id);
  }

  @Patch(':id')
  updateSubject(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ) {
    return this.subjectService.updateSubject(id, updateSubjectDto);
  }

  @Delete(':id')
  deleteSubject(@Param('id', ParseUUIDPipe) id: string) {
    return this.subjectService.deleteSubject(id);
  }
}
