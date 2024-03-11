import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ParkingSlot } from './../parking-slot/entities/parking-slot.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';

@Injectable()
export class SensorService {
  private readonly logger: any;

  constructor(
    @InjectRepository(ParkingSlot)
    private readonly parkingSlotRepository: Repository<ParkingSlot>,
  ) {}

  async createOrUpdateSensor(activeSensors: string[]) {
    try {
      if (activeSensors.length > 0) {
        const getAllSlots = await this.parkingSlotRepository.find();
        const existingSensorIds = new Set(
          getAllSlots.map((slot) => slot.sensorId),
        );

        for (const sensorId of activeSensors) {
          const slot = getAllSlots.find((slot) => slot.sensorId === sensorId);

          if (slot) {
            if (!slot.isOccupied) {
              await axios.patch(
                `${process.env.HOST_API}/parking-slot/${slot.id}`,
                { isOccupied: true },
              );
            }
          } else {
            const newSlot = this.parkingSlotRepository.create({
              sensorId: sensorId,
              isOccupied: true,
            });
            await this.parkingSlotRepository.save(newSlot);
          }

          existingSensorIds.delete(sensorId);
        }

        for (const sensorId of existingSensorIds) {
          const slot = getAllSlots.find((slot) => slot.sensorId === sensorId);
          if (slot && slot.isOccupied) {
            await axios.patch(
              `${process.env.HOST_API}/parking-slot/${slot.id}`,
              { isOccupied: false },
            );
          }
        }
      } else {
        const allOccupiedSlots = await this.parkingSlotRepository.find({
          where: { isOccupied: true },
        });
        for (const slot of allOccupiedSlots) {
          await axios.patch(`${process.env.HOST_API}/parking-slot/${slot.id}`, {
            isOccupied: false,
          });
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
