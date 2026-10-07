import { ConflictException, Injectable } from '@nestjs/common';
import { Roles } from 'src/generated/prisma/enums';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminRepository {
  constructor(private readonly prisma: PrismaService) {}

  findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
  }

  findInvitationByEmail(email: string) {
    return this.prisma.userInvitation.findUnique({
      where: { email },
    });
  }

  saveInvitation(
    data: {
      email: string;
      name: string;
      role: Roles;
      employee_num?: number;
      phone?: number;
      joinind_date?: Date;
      token_hash: string;
      expires_at: Date;
    },
    existingInvitationId?: string,
  ) {
    const invitationData = {
      ...data,
      employee_num: data.employee_num ?? null,
      phone: data.phone ?? null,
      joinind_date: data.joinind_date ?? null,
    };

    if (existingInvitationId) {
      return this.prisma.userInvitation.update({
        where: { id: existingInvitationId },
        data: { ...invitationData, accepted_at: null },
      });
    }

    return this.prisma.userInvitation.create({
      data: invitationData,
    });
  }

  findInvitationByTokenHash(token_hash: string) {
    return this.prisma.userInvitation.findUnique({
      where: { token_hash },
    });
  }

  acceptInvitation(
    invitationId: string,
    email: string,
    name: string,
    role: Roles,
    passwordHash: string,
    teacherData?: {
      employee_num: number;
      phone: number;
      joinind_date: Date;
    },
  ) {
    return this.prisma.$transaction(async (transaction) => {
      const now = new Date();
      const claim = await transaction.userInvitation.updateMany({
        where: {
          id: invitationId,
          accepted_at: null,
          expires_at: { gt: now },
        },
        data: { accepted_at: now },
      });
      if (claim.count !== 1) {
        throw new ConflictException(
          'Invitation is expired or has already been used',
        );
      }

      const roleRecord = await transaction.role.findFirst({
        where: { name: role },
        select: { id: true },
      });
      if (!roleRecord) {
        throw new ConflictException(`The ${role} role has not been configured`);
      }

      const user = await transaction.user.create({
        data: {
          email,
          name,
          passwordHash,
          role: { connect: { id: roleRecord.id } },
        },
        select: { id: true, email: true },
      });

      if (role === Roles.TEACHER && teacherData) {
        await transaction.teacher.create({
          data: {
            ...teacherData,
            name,
            Status:"ACTIVE",
            email,
            user_id: user.id,
            updated_at: now,
          },
        });
      }

      return { id: user.id, email: user.email, role };
    });
  }
}
