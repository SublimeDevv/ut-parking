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

  @Post()
  create(@Body() createParkingSlotDto: CreateParkingSlotDto) {
    return this.parkingSlotService.create(createParkingSlotDto);
  }

  @Get('get-all')
  getDistance(@Query() rangeDto: RangeDto) {
    return this.parkingSlotService.getAllDistancePerRange(rangeDto);
  }

  @Get()
  findAll() {
    return this.parkingSlotService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parkingSlotService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateParkingSlotDto: UpdateParkingSlotDto,
  ) {
    return this.parkingSlotService.update(id, updateParkingSlotDto);
  }
}
