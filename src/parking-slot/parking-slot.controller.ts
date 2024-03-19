import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ParkingSlotService } from './parking-slot.service';
import { CreateParkingSlotDto } from './dto/create-parking-slot.dto';
import { UpdateParkingSlotDto } from './dto/update-parking-slot.dto';
import { RangeDto } from 'src/common/dto/range.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Estacionamiento')
@Controller('parking-slot')
export class ParkingSlotController {
  constructor(private readonly parkingSlotService: ParkingSlotService) {}

  @Get('get-all-slots')
  findAll() {
    return this.parkingSlotService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateParkingSlotDto: UpdateParkingSlotDto,
  ) {
    return this.parkingSlotService.update(id, updateParkingSlotDto);
  }
}
