import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { ParkingSlotService } from './parking-slot.service';
import { CreateParkingSlotDto } from './dto/create-parking-slot.dto';
import { UpdateParkingSlotDto } from './dto/update-parking-slot.dto';
import { RangeDto } from 'src/common/dto/range.dto';

@Controller('parking-slot')
export class ParkingSlotController {
  constructor(private readonly parkingSlotService: ParkingSlotService) {}

  
}
