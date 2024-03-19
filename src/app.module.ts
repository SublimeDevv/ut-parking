import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingSlotModule } from './parking-slot/parking-slot.module';
import { SensorModule } from './mqtt-sensor/sensor.module';
import { GatewayModule } from './websockets/websocket.module';
import { EventsService } from './events/events.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),
    GatewayModule,
    SensorModule,
    ParkingSlotModule,
    AuthModule,
  ],
  providers: [EventsService],
})
export class AppModule {}
