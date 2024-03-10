import { Injectable } from '@nestjs/common';
import { ParkingSlot } from './../parking-slot/entities/parking-slot.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SensorService {
  constructor(
    @InjectRepository(ParkingSlot)
    private readonly parkingSlotRepository: Repository<ParkingSlot>,
  ) {}

  async createOrUpdateSensor(stateSensor: string, sensorId: string) {
    let parkingSlot = await this.parkingSlotRepository.findOne({
      where: { sensorId },
    });

    const isOccupied = stateSensor === 'ocupado';

    if (!parkingSlot) {
      if (isOccupied) {
        parkingSlot = this.parkingSlotRepository.create({ sensorId, isOccupied });
        return await this.parkingSlotRepository.save(parkingSlot);
      }
      return;
    }

    if (parkingSlot.isOccupied !== isOccupied) {
      parkingSlot.isOccupied = isOccupied;
      return await this.parkingSlotRepository.save(parkingSlot);
    }
  }
}
