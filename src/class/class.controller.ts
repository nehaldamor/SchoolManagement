import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class-dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { updateClassDto } from './dto/update-class-dto';

@Controller('class')
export class ClassController {
    constructor(private readonly classService: ClassService) { }
    @UseGuards(AuthGuard, RolesGuard)
    @Roles("ADMIN")
    @Post("create-class")

    async createClass(@Body() createClassdto: CreateClassDto) {
        return await this.classService.createClass(createClassdto.name);
    }


    @UseGuards(AuthGuard, RolesGuard)
    @Roles("ADMIN")
    @Patch("update-class/:id")
    async updateClass(
        @Param("id", ParseUUIDPipe) id: string,
        @Body() updateData: updateClassDto
    ) {
        return await this.classService.updateClass(id, updateData.name);
    }
    // @UseGuards(AuthGuard,RolesGuard)
    // @Roles("ADMIN")
    @UseGuards(AuthGuard, RolesGuard)
    @Roles("ADMIN")
    @Get("all-classes")
    async getClasse(){
        return await this.classService.getClasse();
    }
}
