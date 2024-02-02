import { Module } from '@nestjs/common';
import { ParkingSlotService } from './parking-slot.service';
import { ParkingSlotController } from './parking-slot.controller';
import { ParkingSlot } from './entities/parking-slot.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [ParkingSlotController],
  imports: [TypeOrmModule.forFeature([ParkingSlot])],
  providers: [ParkingSlotService],
})
export class ParkingSlotModule {}
