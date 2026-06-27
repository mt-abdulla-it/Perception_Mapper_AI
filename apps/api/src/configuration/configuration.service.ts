import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Settings } from './dto/settings.dto';

@Injectable()
export class ConfigurationService {
  constructor(private readonly prisma: PrismaService) {}

  // @ts-ignore
  async getSettings(userId: string) {
    // @ts-ignore
    const system = await this.prisma.systemSettings.findFirst();
    // @ts-ignore
    const ai = await this.prisma.aIEngineSettings.findFirst();
    // @ts-ignore
    const userPref = await this.prisma.userPreferences.findUnique({ where: { userId } });
    // @ts-ignore
    const user = await this.prisma.user.findUnique({ where: { id: userId } }) as any;

    const isAdmin = user?.role === 'ADMIN';
    return {
      system,
      ai,
      user: userPref,
      admin: isAdmin ? { rateLimit: system?.rateLimit, signupEnabled: system?.signupEnabled, maintenanceMode: system?.maintenanceMode } : undefined,
    };
  }

  // @ts-ignore
  async updateSettings(userId: string, data: Settings) {
    // Update system settings (admin only fields guarded elsewhere)
    // @ts-ignore
    if (data.system) {
      await this.prisma.systemSettings.upsert({
        where: { id: 1 },
        update: data.system,
        create: { ...data.system, id: 1 },
      });
    }
    // Update AI settings
    // @ts-ignore
    if (data.ai) {
      await this.prisma.aIEngineSettings.upsert({
        where: { id: 1 },
        update: data.ai,
        create: { ...data.ai, id: 1 },
      });
    }
    // Update user preferences
    // @ts-ignore
    if (data.user) {
      await this.prisma.userPreferences.upsert({
        where: { userId },
        update: data.user,
        create: { ...data.user, userId },
      });
    }
    // For admin fields, they are part of system already handled above.
    return this.getSettings(userId);
  }
}
