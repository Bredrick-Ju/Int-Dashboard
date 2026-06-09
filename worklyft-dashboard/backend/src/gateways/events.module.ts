// ─────────────────────────────────────────────────────────────────────────────
// events.module.ts — WebSocket Events Module
// ─────────────────────────────────────────────────────────────────────────────

import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';

@Module({
  providers: [EventsGateway],
  exports: [EventsGateway],
})
export class EventsModule {}
