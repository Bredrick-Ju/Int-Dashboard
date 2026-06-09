// ─────────────────────────────────────────────────────────────────────────────
// activities.module.ts
// ─────────────────────────────────────────────────────────────────────────────

import { Module } from '@nestjs/common';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { EventsModule } from '../../gateways/events.module';

@Module({
  imports: [EventsModule],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
})
export class ActivitiesModule {}
