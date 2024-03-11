import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ParkingSlotService } from '../parking-slot/parking-slot.service';
import { EventsService } from 'src/events/events.service';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly parkingSlotService: ParkingSlotService,
    private readonly eventsService: EventsService,
  ) {
    this.eventsService.on(
      'reupdateData',
      this.handleReupdateData.bind(this),
    );
  }

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('New client connected', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected', client.id);
  }

  async handleReupdateData() {
    const dbData = await this.parkingSlotService.findAll();
    this.server.emit('reupdateData', dbData);
  }

  @SubscribeMessage('getData')
  async handleParkingSlotUpdate() {
    const dbData = await this.parkingSlotService.findAll();
    this.server.emit('updateData', dbData); 
  }
}
