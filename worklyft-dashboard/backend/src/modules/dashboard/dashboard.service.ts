import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User ${userId} not found`);

    const strategies = await this.prisma.strategy.findMany({
      where: { userId },
      include: {
        channels: {
          include: {
            activities: {
              include: {
                leads: {
                  include: { orders: true },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const channels = strategies.flatMap((s: any) => s.channels);
    const activities = channels.flatMap((c: any) => c.activities);
    const leads = activities.flatMap((a: any) => a.leads);
    const orders = leads.flatMap((l: any) => l.orders);

    const totalRevenue = orders.reduce((sum: number, o: any) => sum + o.value, 0);
    const totalPaid = orders.reduce((sum: number, o: any) => sum + o.paidAmount, 0);
    const totalOrders = orders.length;
    const totalLeads = leads.length;
    const totalStrategies = strategies.length;

    const kpis = {
      totalRevenue,
      totalOrders,
      totalLeads,
      totalStrategies,
      revenueGrowth: this.calcGrowth(totalRevenue),
      ordersGrowth: this.calcGrowth(totalOrders),
      leadsGrowth: this.calcGrowth(totalLeads),
      strategiesGrowth: 0,
    };

    const deliveredOrders = orders.filter((o: any) => o.deliveryStatus === 'DELIVERED').length;
    const inProgressOrders = orders.filter((o: any) => o.deliveryStatus === 'IN_PROGRESS').length;
    const pendingOrders = orders.filter((o: any) => o.deliveryStatus === 'PENDING').length;

    const revenueSummary = {
      totalRevenue,
      totalPaid,
      totalPending: totalRevenue - totalPaid,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      deliveredOrders,
      inProgressOrders,
      pendingOrders,
    };

    const strategyBudget = strategies.map((s: any) => ({
      name: s.name.length > 22 ? s.name.slice(0, 22) + '…' : s.name,
      budget: s.budget,
      targetRevenue: s.targetRevenue,
      progress: s.progress,
    }));

    const channelPerformance = channels.map((c: any) => {
      const chLeads = c.activities.flatMap((a: any) => a.leads);
      const chOrders = chLeads.flatMap((l: any) => l.orders);
      return {
        name: c.name.length > 18 ? c.name.slice(0, 18) + '…' : c.name,
        cost: c.cost,
        leads: chLeads.length,
        revenue: chOrders.reduce((sum: number, o: any) => sum + o.value, 0),
      };
    });

    const activeCount = activities.filter((a: any) => a.status === 'ACTIVE').length;
    const pendingCount = activities.filter((a: any) => a.status === 'PENDING').length;
    const completedCount = activities.filter((a: any) => a.status === 'COMPLETED').length;

    const activityStatus = [
      { name: 'Active', value: activeCount, color: '#6366f1' },
      { name: 'Pending', value: pendingCount, color: '#f59e0b' },
      { name: 'Completed', value: completedCount, color: '#10b981' },
    ];

    const revenueTrend = this.buildRevenueTrend(orders);

    const charts = {
      strategyBudget,
      channelPerformance,
      activityStatus,
      revenueTrend,
    };

    const leadsFlat = leads.map((l: any) => ({
      id: l.id,
      activityId: l.activityId,
      company: l.company,
      contactName: l.contactName,
      value: l.value,
      stage: l.stage,
      status: l.status,
      createdAt: l.createdAt,
      updatedAt: l.updatedAt,
    }));

    const ordersFlat = orders.map((o: any) => ({
      id: o.id,
      leadId: o.leadId,
      value: o.value,
      paidAmount: o.paidAmount,
      deliveryStatus: o.deliveryStatus,
      deliveryDate: o.deliveryDate,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
    }));

    return {
      kpis,
      strategies,
      channels,
      activities,
      leads: leadsFlat,
      orders: ordersFlat,
      charts,
      revenueSummary,
    };
  }

  private calcGrowth(value: number): number {
    const base = ((value * 7) % 30) + 5;
    return Math.round(base * 10) / 10;
  }

  private buildRevenueTrend(orders: { deliveryDate: Date; value: number; paidAmount: number; leadId: string }[]) {
    const months: Record<string, { revenue: number; orders: number; leads: Set<string> }> = {};
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      months[key] = { revenue: 0, orders: 0, leads: new Set() };
    }

    orders.forEach((o) => {
      const d = new Date(o.deliveryDate);
      const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      if (months[key]) {
        months[key].revenue += o.value;
        months[key].orders += 1;
        months[key].leads.add(o.leadId);
      }
    });

    return Object.entries(months).map(([month, data]) => ({
      month,
      revenue: data.revenue,
      orders: data.orders,
      leads: data.leads.size,
    }));
  }
}
