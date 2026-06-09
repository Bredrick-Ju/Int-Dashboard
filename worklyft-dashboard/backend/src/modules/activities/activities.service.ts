// ─────────────────────────────────────────────────────────────────────────────
// activities.service.ts
// ─────────────────────────────────────────────────────────────────────────────

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventsGateway } from '../../gateways/events.gateway';
import { UpdateActivityStatusDto } from './dto/update-activity-status.dto';

@Injectable()
export class ActivitiesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventsGateway,
  ) {}

  async findByUser(userId: string) {
    return this.prisma.activity.findMany({
      where: {
        channel: { strategy: { userId } },
      },
      include: {
        leads: { select: { id: true, company: true, stage: true, value: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, dto: UpdateActivityStatusDto) {
    const existing = await this.prisma.activity.findUnique({
      where: { id },
      include: {
        channel: {
          include: { strategy: { select: { userId: true } } },
        },
      },
    });

    if (!existing) throw new NotFoundException(`Activity ${id} not found`);

    const previousStatus = existing.status;
    const updated = await this.prisma.activity.update({
      where: { id },
      data: { status: dto.status },
      include: {
        leads: { select: { id: true, company: true, stage: true, value: true } },
      },
    });

    const userId = existing.channel.strategy.userId;
    this.events.emitActivityUpdated(userId, {
      activityId: id,
      userId,
      previousStatus,
      newStatus: dto.status,
      activity: updated,
    });
    this.events.emitDashboardUpdated(userId);

    return updated;
  }
}
