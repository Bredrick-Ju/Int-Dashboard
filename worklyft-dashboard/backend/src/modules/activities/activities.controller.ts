// ─────────────────────────────────────────────────────────────────────────────
// activities.controller.ts
// ─────────────────────────────────────────────────────────────────────────────

import { Controller, Get, Param, Patch, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ActivitiesService } from './activities.service';
import { UpdateActivityStatusDto } from './dto/update-activity-status.dto';

@ApiTags('activities')
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get all activities for a user' })
  @ApiParam({ name: 'userId' })
  findByUser(@Param('userId') userId: string) {
    return this.activitiesService.findByUser(userId);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update activity status (triggers WebSocket event)' })
  @ApiParam({ name: 'id' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateActivityStatusDto) {
    return this.activitiesService.updateStatus(id, dto);
  }
}
