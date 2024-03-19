import { Module, forwardRef } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { ParkingSlotModule } from 'src/parking-slot/parking-slot.module';
import { EventsService } from 'src/events/events.service';

@Module({
  providers: [WebsocketGateway, EventsService],
  imports: [forwardRef(() => ParkingSlotModule)],
  exports: [WebsocketGateway],
})
export class GatewayModule {}
