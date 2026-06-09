// ─────────────────────────────────────────────────────────────────────────────
// update-lead-stage.dto.ts
// ─────────────────────────────────────────────────────────────────────────────

import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LeadStage } from '@prisma/client';

export class UpdateLeadStageDto {
  @ApiProperty({ enum: LeadStage, description: 'New lead stage' })
  @IsEnum(LeadStage)
  stage: LeadStage;
}
