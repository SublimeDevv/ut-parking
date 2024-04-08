import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';

export class CreateParkingSlotDto {
  @IsString()
  sensorId: string;

  @IsBoolean()
  @IsOptional()
  isOccupied: boolean;

  @IsDate()
  @IsOptional()
  last_time: Date;
}
