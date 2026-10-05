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
import { CreateSectionDto } from './dto/create-section-dto';
import { SectionService } from './section.service';
import { UpdateSectionDto } from './dto/update-section-dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@UseGuards(AuthGuard,RolesGuard)
@Roles("ADMIN")
@Controller('section')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Post('create-section')
  createSection(@Body() createSectionDto: CreateSectionDto) {
    return this.sectionService.createSection(createSectionDto);
  }

  @Get('get-sections')
  getSections() {
    return this.sectionService.getSections();
  }

  @Get(':id')
  getSection(@Param('id', ParseUUIDPipe) id: string) {
    return this.sectionService.getSection(id);
  }

  @Patch(':id')
  updateSection(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSectionDto: UpdateSectionDto,
  ) {
    return this.sectionService.updateSection(id, updateSectionDto);
  }

  @Delete(':id')
  deleteSection(@Param('id', ParseUUIDPipe) id: string) {
    return this.sectionService.deleteSection(id);
  }

}
