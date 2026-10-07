import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { AdminRepository } from './admin.repository';

describe('AdminService', () => {
  let service: AdminService;
  const adminRepository = {
    findUserByEmail: jest.fn(),
    findInvitationByEmail: jest.fn(),
    saveInvitation: jest.fn(),
    findInvitationByTokenHash: jest.fn(),
    acceptInvitation: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: AdminRepository, useValue: adminRepository },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a student invitation and returns the testing URL', async () => {
    adminRepository.findUserByEmail.mockResolvedValue(null);
    adminRepository.findInvitationByEmail.mockResolvedValue(null);

    const invitation = await service.createInvitation({
      email: 'student@example.com',
      name: 'Test Student',
      role: 'STUDENT',
    });

    expect(adminRepository.saveInvitation).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'student@example.com',
        role: 'STUDENT',
        token_hash: expect.any(String),
      }),
      undefined,
    );
    expect(invitation.invitationUrl).toMatch(
      /^http:\/\/localhost:5173\/accept-invitation\?token=[a-f0-9]{64}$/,
    );
  });

  it('requires profile details when inviting a teacher', async () => {
    adminRepository.findUserByEmail.mockResolvedValue(null);
    adminRepository.findInvitationByEmail.mockResolvedValue(null);

    await expect(
      service.createInvitation({
        email: 'teacher@example.com',
        name: 'Test Teacher',
        role: 'TEACHER',
      }),
    ).rejects.toThrow('Teacher invitations require employee_num, phone, and joinind_date');
    expect(adminRepository.saveInvitation).not.toHaveBeenCalled();
  });

  it('rotates the token and expiry when resending an unexpired invitation', async () => {
    const previousInvitation = {
      id: 'existing-invitation-id',
      accepted_at: null,
      expires_at: new Date(Date.now() + 60_000),
    };
    adminRepository.findUserByEmail.mockResolvedValue(null);
    adminRepository.findInvitationByEmail.mockResolvedValue(previousInvitation);

    const invitation = await service.createInvitation({
      email: 'student@example.com',
      name: 'Updated Student',
      role: 'STUDENT',
    });

    expect(adminRepository.saveInvitation).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'student@example.com',
        name: 'Updated Student',
        role: 'STUDENT',
        token_hash: expect.any(String),
        expires_at: expect.any(Date),
      }),
      previousInvitation.id,
    );
    expect(invitation.message).toBe('Invitation resent');
    expect(invitation.expiresAt.getTime()).toBeGreaterThan(
      previousInvitation.expires_at.getTime(),
    );
  });
});
