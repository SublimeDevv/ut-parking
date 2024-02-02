import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class RangeDto {
  @IsOptional()
  @IsPositive()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  min?: number;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  max?: number;
}
