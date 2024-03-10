import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ParkingSlot } from './../parking-slot/entities/parking-slot.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SensorService {
  private readonly logger: any;

  constructor(
    @InjectRepository(ParkingSlot)
    private readonly parkingSlotRepository: Repository<ParkingSlot>,
  ) {}

  async createOrUpdateSensor(activeSensors: string[]) {
    try {
      const getAllSlots = await this.parkingSlotRepository.find();

      const existingSensorIds = new Set(
        getAllSlots.map((slot) => slot.sensorId),
      );

      for (const sensorId of activeSensors) {
        const slot = getAllSlots.find((slot) => slot.sensorId === sensorId);

        if (slot) {
          if (!slot.isOccupied) {
            slot.isOccupied = true;
            await this.parkingSlotRepository.save(slot);
          }
        } else {
          await this.parkingSlotRepository.save({
            sensorId: sensorId,
            isOccupied: true,
          });
        }

        existingSensorIds.delete(sensorId);
      }

      for (const sensorId of existingSensorIds) {
        const slot = getAllSlots.find((slot) => slot.sensorId === sensorId);
        if (slot && slot.isOccupied) {
          slot.isOccupied = false;
          await this.parkingSlotRepository.save(slot);
        }
      }
    } catch (error) {
      this.handleDBExceptions(error); 
    }
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error! Check server logs.',
    );
  }
}
