import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AdminService } from './admin.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('invitations')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  createInvitation(@Body() invitation: CreateInvitationDto) {
    return this.adminService.createInvitation(invitation);
  }

  @Post('invitations/accept')
  acceptInvitation(@Body() invitation: AcceptInvitationDto) {
    return this.adminService.acceptInvitation(invitation);
  }
}
