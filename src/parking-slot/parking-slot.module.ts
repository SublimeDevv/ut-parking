import { Module, forwardRef } from '@nestjs/common';
import { ParkingSlotService } from './parking-slot.service';
import { ParkingSlotController } from './parking-slot.controller';
import { ParkingSlot } from './entities/parking-slot.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingSlotSubscriber } from './entities/parkingslot.subscriber';
import { EventsService } from 'src/events/events.service';
import { GatewayModule } from 'src/websockets/websocket.module';

@Module({
  controllers: [ParkingSlotController],
  imports: [
    TypeOrmModule.forFeature([ParkingSlot]),
    forwardRef(() => GatewayModule),
  ],
  providers: [ParkingSlotService, ParkingSlotSubscriber, EventsService],
  exports: [ParkingSlotService],
})
export class ParkingSlotModule {}
