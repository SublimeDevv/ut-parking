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

  @Column('bool', {
    default: true,
  })
  isOccupied: boolean;

  @Column('int')
  distance: number;
}
