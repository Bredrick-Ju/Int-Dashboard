// ─────────────────────────────────────────────────────────────────────────────
// update-activity-status.dto.ts
// ─────────────────────────────────────────────────────────────────────────────

import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ActivityStatus } from '@prisma/client';

export class UpdateActivityStatusDto {
  @ApiProperty({ enum: ActivityStatus })
  @IsEnum(ActivityStatus)
  status: ActivityStatus;
}
