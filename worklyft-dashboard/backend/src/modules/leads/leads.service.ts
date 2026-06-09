import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventsGateway } from '../../gateways/events.gateway';
import { UpdateLeadStageDto } from './dto/update-lead-stage.dto';

@Injectable()
export class LeadsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventsGateway,
  ) {}

  async findByUser(userId: string) {
    return this.prisma.lead.findMany({
      where: {
        activity: {
          channel: {
            strategy: { userId },
          },
        },
      },
      include: {
        activity: { select: { id: true, name: true, channelId: true } },
        orders: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStage(id: string, dto: UpdateLeadStageDto) {
    const existing = await this.prisma.lead.findUnique({
      where: { id },
      include: {
        activity: {
          include: {
            channel: {
              include: { strategy: { select: { userId: true } } },
            },
          },
        },
      },
    });

    if (!existing) throw new NotFoundException(`Lead ${id} not found`);

    const previousStage = existing.stage;
    const updated = await this.prisma.lead.update({
      where: { id },
      data: { stage: dto.stage },
      include: {
        activity: { select: { id: true, name: true, channelId: true } },
        orders: true,
      },
    });

    const userId = existing.activity.channel.strategy.userId;

    this.events.emitLeadUpdated(userId, {
      leadId: id,
      userId,
      previousStage,
      newStage: dto.stage,
      lead: updated,
    });
    this.events.emitDashboardUpdated(userId);

    return updated;
  }
}
