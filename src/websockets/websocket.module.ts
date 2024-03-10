import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { ParkingSlotModule } from 'src/parking-slot/parking-slot.module';

@Module({
  providers: [WebsocketGateway],
  imports: [ParkingSlotModule]
})
export class GatewayModule {}