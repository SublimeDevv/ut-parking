import {
  DataSource,
  EntityManager,
  EntitySubscriberInterface,
  Equal,
  EventSubscriber,
  Not,
  UpdateEvent,
} from 'typeorm';
import { ParkingSlot } from './parking-slot.entity';
import { WebsocketGateway } from 'src/websockets/websocket.gateway';

@EventSubscriber()
export class ParkingSlotSubscriber
  implements EntitySubscriberInterface<ParkingSlot>
{
  constructor(
    private entityManager: EntityManager,
    private readonly websocketGateway: WebsocketGateway,
    dataSource: DataSource,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return ParkingSlot;
  }

  async afterUpdate(event: UpdateEvent<ParkingSlot>) {
    if (event.entity) {
      const allSensorsExceptUpdated = await this.entityManager.find(
        ParkingSlot,
        {
          where: { id: Not(Equal(event.entity.id)) },
        },
      );

      const allSensors = [
        ...allSensorsExceptUpdated,
        event.entity as ParkingSlot,
      ];
      
      this.websocketGateway.server.emit('updateData', allSensors);
    }
  }
}
