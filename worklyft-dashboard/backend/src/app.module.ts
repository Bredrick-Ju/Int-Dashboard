// ─────────────────────────────────────────────────────────────────────────────
// app.module.ts — Root NestJS Application Module
// ─────────────────────────────────────────────────────────────────────────────

import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { LeadsModule } from './modules/leads/leads.module';
import { OrdersModule } from './modules/orders/orders.module';
import { StrategiesModule } from './modules/strategies/strategies.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { EventsModule } from './gateways/events.module';

@Module({
  imports: [
    PrismaModule,
    EventsModule,
    UsersModule,
    DashboardModule,
    LeadsModule,
    OrdersModule,
    StrategiesModule,
    ActivitiesModule,
  ],
})
export class AppModule {}
