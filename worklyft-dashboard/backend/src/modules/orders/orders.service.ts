import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventsGateway } from '../../gateways/events.gateway';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventsGateway,
  ) {}

  async findByUser(userId: string) {
    return this.prisma.order.findMany({
      where: {
        lead: {
          activity: {
            channel: {
              strategy: { userId },
            },
          },
        },
      },
      include: {
        lead: { select: { id: true, company: true, contactName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreateOrderDto) {
    const lead = await this.prisma.lead.findUnique({
      where: { id: dto.leadId },
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

    if (!lead) throw new NotFoundException(`Lead ${dto.leadId} not found`);

    const order = await this.prisma.order.create({
      data: {
        leadId: dto.leadId,
        value: dto.value,
        paidAmount: dto.paidAmount,
        deliveryStatus: dto.deliveryStatus,
        deliveryDate: new Date(dto.deliveryDate),
      },
      include: {
        lead: { select: { id: true, company: true, contactName: true } },
      },
    });

    const userId = lead.activity.channel.strategy.userId;

    this.events.emitOrderCreated(userId, { orderId: order.id, userId, order });
    this.events.emitDashboardUpdated(userId);

    return order;
  }
}
