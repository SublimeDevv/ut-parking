import { Module, forwardRef } from '@nestjs/common';
import { ParkingSlotService } from './parking-slot.service';
import { ParkingSlotController } from './parking-slot.controller';
import { ParkingSlot } from './entities/parking-slot.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingSlotSubscriber } from './entities/parkingslot.subscriber';
import { EventsService } from 'src/events/events.service';
import { GatewayModule } from 'src/websockets/websocket.module';
import { HistorySlot } from './entities/history-slot.entity';
import { User } from 'src/auth/entities/user.entity';

@Module({
  controllers: [ParkingSlotController],
  imports: [
    TypeOrmModule.forFeature([ParkingSlot, HistorySlot, User]),
    forwardRef(() => GatewayModule),
  ],
  providers: [ParkingSlotService, ParkingSlotSubscriber, EventsService],
  exports: [ParkingSlotService],
})
export class ParkingSlotModule {}
