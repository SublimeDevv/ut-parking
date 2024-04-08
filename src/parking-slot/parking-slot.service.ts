import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateParkingSlotDto } from './dto/create-parking-slot.dto';
import { UpdateParkingSlotDto } from './dto/update-parking-slot.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ParkingSlot } from './entities/parking-slot.entity';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { HistorySlot } from './entities/history-slot.entity';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ParkingSlotService {
  private readonly logger: any;
  constructor(
    @InjectRepository(ParkingSlot)
    private readonly parkingSlotRepository: Repository<ParkingSlot>,
    @InjectRepository(HistorySlot)
    private readonly historySlotRepository: Repository<HistorySlot>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createParkingSlotDto: CreateParkingSlotDto) {
    try {
      await this.parkingSlotRepository.save(createParkingSlotDto);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async update(sensorId: string, updateParkingSlotDto: UpdateParkingSlotDto) {
    try {
        const existingSlot = await this.parkingSlotRepository.findOneBy({ id: sensorId });

        if (!existingSlot) {
            return null;
        }

        const updatedSlot = await this.parkingSlotRepository.preload({
            id: existingSlot.id,
            last_time: updateParkingSlotDto.isOccupied ? new Date() : existingSlot.last_time,
            ...updateParkingSlotDto,
        });

        return await this.parkingSlotRepository.save(updatedSlot);
    } catch (error) {
        this.handleDBExceptions(error);
    }
}


  async findAll() {
    return this.parkingSlotRepository.find();
  }

  async findOne(id: string) {
    try {
      const getParkingSlot = await this.parkingSlotRepository.findOneBy(
        isUUID(id) ? { id: id } : { sensorId: id.toLowerCase() },
      );

      if (!getParkingSlot)
        throw new NotFoundException(
          `ParkingSlot with id or sensorId ${id} not found!`,
        );

      return getParkingSlot;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async getAllHistorySlots() {
    let findAll: any = await this.historySlotRepository.find();

    findAll = findAll.map(
      (historySlot: { entry_time: any; departure_time: any; user: any }) => {
        const { entry_time, departure_time, user } = historySlot;

        return {
          ...(entry_time && { entry_time }),
          ...(departure_time && { departure_time }),
          fullName: user.fullName,
          email: user.email,
        };
      },
    );

    return findAll;
  }

  async getHistorySlotsByUser(userId: string) {
    const user = await this.userRepository.findOne({
      where: isUUID(userId) ? { id: userId } : { slug: userId },
    });

    if (!user) throw new NotFoundException(`User with id ${userId} not found!`);

    let userHistorySlots: any = await this.historySlotRepository.find({
      where: { user },
    });

    if (!userHistorySlots.length) {
      throw new NotFoundException('No history slots found for this user!');
    }

    try {
      userHistorySlots = userHistorySlots.map(
        (historySlot: { entry_time: any; departure_time: any }) => {
          const { entry_time, departure_time } = historySlot;

          return {
            ...(entry_time && { entry_time }),
            ...(departure_time && { departure_time }),
          };
        },
      );

      return userHistorySlots;
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
