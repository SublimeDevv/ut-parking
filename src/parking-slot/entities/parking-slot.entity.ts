import { Transform } from 'class-transformer';
import moment from 'moment';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'parkingSlots' })
export class ParkingSlot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    unique: true,
    nullable: true,
  })
  sensorId: string;

  @Column({ type: 'boolean', default: true })
  isOccupied: boolean;

  @Transform(({ value }) => moment(value).format('DD/MM/YYYY HH:mm:ss'))
  @Column({
    nullable: true,
  })
  last_time: Date;

  

}
