import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { StrategiesService } from './strategies.service';

@ApiTags('strategies')
@Controller('strategies')
export class StrategiesController {
  constructor(private readonly strategiesService: StrategiesService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get all strategies for a user' })
  @ApiParam({ name: 'userId' })
  findByUser(@Param('userId') userId: string) {
    return this.strategiesService.findByUser(userId);
  }
}
