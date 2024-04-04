import { Controller } from '@nestjs/common';
import { SensorService } from './sensor.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

import * as mqtt from 'mqtt';

@Controller()
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  @MessagePattern('topic/message')
  getNotifications(@Payload() data: any, @Ctx() context: RmqContext) {
    // console.log(data)
    this.sensorService.createOrUpdateSensor(data);
  }

  @MessagePattern('topic/rfid')
  async getIdRFID(@Payload() data: any, @Ctx() context: RmqContext) {
    const getValue = await this.sensorService.findTuitonById(data);

    if (getValue) {
      this.sendMessageOne('plumaUno');
    } else {
      this.sendMessageOne('no existe');
    }
  }

  @MessagePattern('topic/rfidTwo')
  async getIdRFIDTwo(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log(data);
    const getValue = await this.sensorService.findTuitonByIdTwo(data);

    if (getValue) {
      this.sendMessageTwo('plumaDos');
    } else {
      this.sendMessageTwo('no existe');
    }
  }

  sendMessageOne(message: string) {
    const client = mqtt.connect('mqtt://test.mosquitto.org');

    client.on('connect', () => {
      client.publish('topic/validate', message, (err) => {
        client.end();
      });
    });
  }

  sendMessageTwo(message: string) {
    const client = mqtt.connect('mqtt://test.mosquitto.org');

    client.on('connect', () => {
      client.publish('topic/validateTwo', message, (err) => {
        client.end();
      });
    });
  }
}
