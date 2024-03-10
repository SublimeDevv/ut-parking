import { Controller } from '@nestjs/common';
import { SensorService } from './sensor.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller()
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  @MessagePattern('topic/message')
  getNotifications(@Payload() data: any, @Ctx() context: RmqContext) {
    this.sensorService.createOrUpdateSensor(data);
  }
}
