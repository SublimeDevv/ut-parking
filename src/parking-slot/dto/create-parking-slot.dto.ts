import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateParkingSlotDto {
  @IsString()
  sensorId: string;

  @IsBoolean()
  @IsOptional()
  isOccupied: boolean;
}
