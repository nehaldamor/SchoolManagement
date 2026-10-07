import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { createHash, randomBytes } from 'node:crypto';
import bcrypt from 'bcrypt';
import { Roles } from 'src/generated/prisma/enums';
import { AdminRepository } from './admin.repository';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';
import { CreateInvitationDto } from './dto/create-invitation.dto';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);
  private readonly invitationLifetimeMs = 72 * 60 * 60 * 1000;

  constructor(private readonly adminRepository: AdminRepository) {}

  async createInvitation(invitation: CreateInvitationDto) {
    const email = invitation.email.trim().toLowerCase();
    const name = invitation.name.trim();
    if (!name) {
      throw new BadRequestException('Name must not be empty');
    }
    if (await this.adminRepository.findUserByEmail(email)) {
      throw new ConflictException('A user with this email already exists');
    }
    const previousInvitation =
      await this.adminRepository.findInvitationByEmail(email);
    if (
      invitation.role === Roles.TEACHER &&
      (invitation.employee_num === undefined ||
        invitation.phone === undefined ||
        !invitation.joinind_date)
    ) {
      throw new ConflictException(
        'Teacher invitations require employee_num, phone, and joinind_date',
      );
    }

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + this.invitationLifetimeMs);
    await this.adminRepository.saveInvitation(
      {
        email,
        name,
        role: invitation.role,
        ...(invitation.employee_num !== undefined && {
          employee_num: invitation.employee_num,
        }),
        ...(invitation.phone !== undefined && { phone: invitation.phone }),
        ...(invitation.joinind_date && {
          joinind_date: new Date(invitation.joinind_date),
        }),
        token_hash: this.hashToken(token),
        expires_at: expiresAt,
      },
      previousInvitation?.id,
    );

    const frontendUrl = (process.env.FRONTEND_URL ?? 'http://localhost:5173')
      .replace(/\/+$/, '');
    const invitationUrl = `${frontendUrl}/accept-invitation?token=${token}`;
    this.logger.log(`Invitation for ${email}: ${invitationUrl}`);

    return {
      message: previousInvitation ? 'Invitation resent' : 'Invitation created',
      email,
      role: invitation.role,
      expiresAt,
      invitationUrl,
    };
  }

  async acceptInvitation(invitation: AcceptInvitationDto) {
    const storedInvitation =
      await this.adminRepository.findInvitationByTokenHash(
        this.hashToken(invitation.token),
      );
    if (!storedInvitation) {
      throw new NotFoundException('Invitation not found');
    }
    if (storedInvitation.accepted_at) {
      throw new ConflictException('Invitation has already been used');
    }
    if (storedInvitation.expires_at <= new Date()) {
      throw new ConflictException('Invitation has expired');
    }
    let teacherData:
      | { employee_num: number; phone: number; joinind_date: Date }
      | undefined;
    if (storedInvitation.role === Roles.TEACHER) {
      const { employee_num, phone, joinind_date } = storedInvitation;
      if (
        employee_num === null ||
        phone === null ||
        joinind_date === null
      ) {
        throw new ConflictException(
          'Teacher invitation is missing required profile details',
        );
      }
      teacherData = { employee_num, phone, joinind_date };
    }
    if (await this.adminRepository.findUserByEmail(storedInvitation.email)) {
      throw new ConflictException('A user with this email already exists');
    }

    const passwordHash = await bcrypt.hash(invitation.password, 10);
    return {
      message: 'Invitation accepted',
      user: await this.adminRepository.acceptInvitation(
        storedInvitation.id,
        storedInvitation.email,
        storedInvitation.name,
        storedInvitation.role,
        passwordHash,
        teacherData,
      ),
    };
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }
}
