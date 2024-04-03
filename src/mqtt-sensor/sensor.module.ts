import { Module } from '@nestjs/common';
import { SensorController } from './sensor.controller';
import { SensorService } from './sensor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingSlot } from 'src/parking-slot/entities/parking-slot.entity';
import { User } from 'src/auth/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ParkingSlot, User])],
  controllers: [SensorController],
  providers: [SensorService],
})
export class SensorModule {}
