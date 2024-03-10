import {
  BadRequestException,
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

@Injectable()
export class ParkingSlotService {
  private readonly logger: any;
  constructor(
    @InjectRepository(ParkingSlot)
    private readonly parkingSlotRepository: Repository<ParkingSlot>,
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

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error! Check server logs.',
    );
  }
}
