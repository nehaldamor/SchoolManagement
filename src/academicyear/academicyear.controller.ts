import { Body, Controller, Post, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles as UserRole } from 'src/generated/prisma/enums';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateAcademicYearDto } from './dto/create-ay-dto';
import { AcademicyearService } from './academicyear.service';


@Controller('academicyear')
export class AcademicyearController {
    constructor(private readonly academicyearService: AcademicyearService) {}

    @Post("create-ay")
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    createAcademicYear(@Body() academicYear:CreateAcademicYearDto){
        return this.academicyearService.createAcademicYear(academicYear);
    }
}
