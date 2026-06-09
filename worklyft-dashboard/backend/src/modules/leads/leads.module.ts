// ─────────────────────────────────────────────────────────────────────────────
// leads.module.ts
// ─────────────────────────────────────────────────────────────────────────────

import { Module } from '@nestjs/common';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { EventsModule } from '../../gateways/events.module';

@Module({
  imports: [EventsModule],
  controllers: [LeadsController],
  providers: [LeadsService],
})
export class LeadsModule {}
