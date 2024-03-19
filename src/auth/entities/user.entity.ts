import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ValidRoles } from '../interfaces/valid-roles.interface';
import { Transform } from 'class-transformer';
import moment from 'moment';

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
    default: 'https://acortar.link/MRAY6q',
    length: 255,
  })
  picture: string;

  @Transform(({ value }) => moment(value).format('DD/MM/YYYY HH:mm:ss'))
  @Column()
  entry_time: Date;

  @Transform(({ value }) => moment(value).format('DD/MM/YYYY HH:mm:ss'))
  @Column()
  departure_time: Date;

  @BeforeInsert()
  checkFields() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsOnUpdate() {
    this.email = this.email.toLowerCase().trim();
  }
}
