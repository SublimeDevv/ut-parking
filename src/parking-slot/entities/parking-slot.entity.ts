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
}
