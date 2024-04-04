import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ValidRoles } from '../interfaces/valid-roles.interface';
import { Transform } from 'class-transformer';
import moment from 'moment';
import { HistorySlot } from 'src/parking-slot/entities/history-slot.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  fullName: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  tuition: string;

  @Column({ type: 'varchar', length: 100, nullable: true, select: false })
  password: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: ValidRoles,
    default: ValidRoles.student,
  })
  roles: ValidRoles;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  slug: string;

  @Column({
    type: 'varchar',
    default: 'https://acortar.link/MRAY6q',
    length: 255,
  })
  picture: string;

  @OneToMany(() => HistorySlot, (historySlot) => historySlot.user)
  historySlots: HistorySlot[];

  @BeforeInsert()
  setSlugName() {
    this.slug = this.fullName.toLowerCase().split(' ').join('-');
  }

  @BeforeUpdate()
  setSlugNameOnUpdate() {
    this.slug = this.fullName.toLowerCase().split(' ').join('-');
  }

  @BeforeInsert()
  checkFields() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsOnUpdate() {
    this.email = this.email.toLowerCase().trim();
  }
}
