import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { ParkingSlot } from 'src/parking-slot/entities/parking-slot.entity';
import { HistorySlot } from 'src/parking-slot/entities/history-slot.entity';

@Module({
  controllers: [SeedController],
  imports: [TypeOrmModule.forFeature([User, ParkingSlot, HistorySlot])],
  providers: [SeedService],
})
export class SeedModule {}
