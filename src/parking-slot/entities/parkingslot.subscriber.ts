import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  Repository,
  UpdateEvent,
} from 'typeorm';
import { ParkingSlot } from './parking-slot.entity';
import { ParkingSlotService } from '../parking-slot.service';

@EventSubscriber()
export class ParkingSlotSubscriber
  implements EntitySubscriberInterface<ParkingSlot>
{
  constructor(
    dataSource: DataSource,
    private readonly parkingSlotService: ParkingSlotService
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return ParkingSlot;
  }

  async afterUpdate(event: UpdateEvent<ParkingSlot>) {
    const getAllSlots = await this.parkingSlotService.findAll();
    console.log(`AFTER SLOT UPDATE: `, getAllSlots);
  }
}
