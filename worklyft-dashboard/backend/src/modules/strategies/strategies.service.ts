// ─────────────────────────────────────────────────────────────────────────────
// strategies.service.ts
// ─────────────────────────────────────────────────────────────────────────────

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StrategiesService {
  constructor(private readonly prisma: PrismaService) {}

  async findByUser(userId: string) {
    return this.prisma.strategy.findMany({
      where: { userId },
      include: { channels: true },
      orderBy: { createdAt: 'asc' },
    });
  }
}
