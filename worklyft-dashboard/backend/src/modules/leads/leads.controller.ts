import { Controller, Get, Param, Patch, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { LeadsService } from './leads.service';
import { UpdateLeadStageDto } from './dto/update-lead-stage.dto';

@ApiTags('leads')
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get all leads for a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  findByUser(@Param('userId') userId: string) {
    return this.leadsService.findByUser(userId);
  }

  @Patch(':id/stage')
  @ApiOperation({ summary: 'Advance lead stage (triggers WebSocket event)' })
  @ApiParam({ name: 'id', description: 'Lead ID' })
  updateStage(@Param('id') id: string, @Body() dto: UpdateLeadStageDto) {
    return this.leadsService.updateStage(id, dto);
  }
}
