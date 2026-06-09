// ─────────────────────────────────────────────────────────────────────────────
// dashboard.controller.ts
// ─────────────────────────────────────────────────────────────────────────────

import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get full dashboard aggregation for a user' })
  @ApiParam({ name: 'userId', description: 'The user ID (cuid)' })
  getDashboard(@Param('userId') userId: string) {
    return this.dashboardService.getDashboard(userId);
  }
}
