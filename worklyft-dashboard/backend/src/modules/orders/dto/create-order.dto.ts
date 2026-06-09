// ─────────────────────────────────────────────────────────────────────────────
// create-order.dto.ts
// ─────────────────────────────────────────────────────────────────────────────

import { IsString, IsNumber, IsEnum, IsDateString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DeliveryStatus } from '@prisma/client';

export class CreateOrderDto {
  @ApiProperty({ description: 'The lead ID this order belongs to' })
  @IsString()
  leadId: string;

  @ApiProperty({ description: 'Total order value', minimum: 0 })
  @IsNumber()
  @Min(0)
  value: number;

  @ApiProperty({ description: 'Amount already paid', minimum: 0 })
  @IsNumber()
  @Min(0)
  paidAmount: number;

  @ApiProperty({ enum: DeliveryStatus })
  @IsEnum(DeliveryStatus)
  deliveryStatus: DeliveryStatus;

  @ApiProperty({ description: 'Expected delivery date (ISO string)' })
  @IsDateString()
  deliveryDate: string;
}
