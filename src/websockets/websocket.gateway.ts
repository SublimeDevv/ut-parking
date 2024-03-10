import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ParkingSlotService } from '../parking-slot/parking-slot.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly parkingSlotService: ParkingSlotService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('New client connected', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected', client.id);
  }

  @SubscribeMessage('requestDbData')
  async handleDbRequest(@ConnectedSocket() client: Socket) {
    const dbData = await this.getDataFromDb();
    this.server.emit('updateData', dbData);
  }

  private async getDataFromDb(): Promise<any> {
    const getAllSlots = this.parkingSlotService.findAll()
    return getAllSlots;
    
  }
}
