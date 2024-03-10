import { Module } from '@nestjs/common';
import { ParkingSlotService } from './parking-slot.service';
import { ParkingSlotController } from './parking-slot.controller';
import { ParkingSlot } from './entities/parking-slot.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingSlotSubscriber } from './entities/parkingslot.subscriber';

@Module({
  controllers: [ParkingSlotController],
  imports: [TypeOrmModule.forFeature([ParkingSlot])],
  providers: [ParkingSlotService, ParkingSlotSubscriber],
  exports: [ParkingSlotService],
})
export class ParkingSlotModule {}
