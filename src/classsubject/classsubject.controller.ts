import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ClasssubjectService } from './classsubject.service';
import { CreateClasssubjectDto } from './dto/create-classsubject-dto';
import { GetClasssubjectsDto } from './dto/get-classsubjects-dto';
import { UpdateClasssubjectDto } from './dto/update-classsubject-dto';

@UseGuards(AuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('classsubject')
export class ClasssubjectController {
  constructor(private readonly classsubjectService: ClasssubjectService) {}

  @Post('assign')
  assignSubject(@Body() assignment: CreateClasssubjectDto) {
    return this.classsubjectService.assignSubject(assignment);
  }

  @Get()
  getAssignments(@Query() filters: GetClasssubjectsDto) {
    return this.classsubjectService.getAssignments(filters);
  }

  @Get(':id')
  getAssignment(@Param('id', ParseUUIDPipe) id: string) {
    return this.classsubjectService.getAssignment(id);
  }

  @Patch(':id')
  updateAssignment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateData: UpdateClasssubjectDto,
  ) {
    return this.classsubjectService.updateAssignment(id, updateData);
  }

  @Delete(':id')
  removeAssignment(@Param('id', ParseUUIDPipe) id: string) {
    return this.classsubjectService.removeAssignment(id);
  }
}
