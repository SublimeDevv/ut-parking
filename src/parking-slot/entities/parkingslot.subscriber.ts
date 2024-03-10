import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  UpdateEvent,
} from 'typeorm';
import { ParkingSlot } from './parking-slot.entity';

@EventSubscriber()
export class ParkingSlotSubscriber
  implements EntitySubscriberInterface<ParkingSlot>
{
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return ParkingSlot;
  }

  afterUpdate(event: UpdateEvent<ParkingSlot>) {
    console.log(`AFTER SLOT UPDATE: `, event.entity);
  }
}
