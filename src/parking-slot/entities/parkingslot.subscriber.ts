import {
  DataSource,
  EntityManager,
  EntitySubscriberInterface,
  Equal,
  EventSubscriber,
  Not,
  Repository,
  UpdateEvent,
} from 'typeorm';
import { ParkingSlotService } from '../parking-slot.service';
import { ParkingSlot } from './parking-slot.entity';
import { WebsocketGateway } from 'src/websockets/websocket.gateway';
import { InjectRepository } from '@nestjs/typeorm';

@EventSubscriber()
export class ParkingSlotSubscriber
  implements EntitySubscriberInterface<ParkingSlot>
{
  constructor(
    private entityManager: EntityManager,
    private readonly websocketGateway: WebsocketGateway,
    dataSource: DataSource,
    @InjectRepository(ParkingSlot)
    private parkingSlotRepository: Repository<ParkingSlot>,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return ParkingSlot;
  }

  async afterUpdate(event: UpdateEvent<ParkingSlot>) {
    console.log('ParkingSlotSubscriber: afterUpdate');
  
    if (event.entity) {
      const allSensorsExceptUpdated = await this.entityManager.find(ParkingSlot, {
        where: { id: Not(Equal(event.entity.id)) }
      });
  
      const allSensors = [...allSensorsExceptUpdated, event.entity as ParkingSlot];
      console.log(allSensors)
  
      this.websocketGateway.server.emit('updateData', allSensors);
    }
  }
  

  // async afterUpdate(event: UpdateEvent<ParkingSlot>) {
  //   console.log(event.entity);
  //   const dbData = await this.parkingSlotRepository.find();
  //   this.websocketGateway.server.emit('updateData', {});
  // }
}
