import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ParkingSlot } from './../parking-slot/entities/parking-slot.entity';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { HistorySlot } from 'src/parking-slot/entities/history-slot.entity';

@Injectable()
export class SensorService {
  private readonly logger: any;

  constructor(
    @InjectRepository(ParkingSlot)
    private readonly parkingSlotRepository: Repository<ParkingSlot>,
    @InjectRepository(User)
    private readonly UserRepository: Repository<User>,
    @InjectRepository(HistorySlot)
    private readonly historySlotRepository: Repository<HistorySlot>,
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

  // Para registrar su hora de entrada
  async findTuitonById(id: string) {
    const findTuition = await this.UserRepository.findOne({
      where: { tuition: id.trim() },
    });

    if (findTuition) {
      await this.historySlotRepository.save({
        entry_time: new Date(),
        user: findTuition,
      });
    }
    return findTuition;
  }

  async findTuitonByIdTwo(id: string) {
    const findTuition = await this.UserRepository.findOne({
      where: { tuition: id.trim() },
    });

    if (findTuition) {
      await this.historySlotRepository.save({
        departure_time: new Date(),
        user: findTuition,
      });
    }
    return findTuition;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error! Check server logs.',
    );
  }
}
