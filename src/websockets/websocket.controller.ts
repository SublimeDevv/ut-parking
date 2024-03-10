import { Controller, Get } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';

@Controller('websocket')
export class WebsocketController {
  constructor(private readonly websocketGateway: WebsocketGateway) {}
  @Get('saludo')
  async saludar() {
    console.log('hola');
  }
}
