import { Transform } from 'class-transformer';
import { User } from 'src/auth/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import moment from 'moment';

@Entity({ name: 'historySlots' })
export class HistorySlot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Transform(({ value }) => moment(value).format('DD/MM/YYYY HH:mm:ss'))
  @Column({
    nullable: true,
  })
  entry_time: Date;

  @Transform(({ value }) => moment(value).format('DD/MM/YYYY HH:mm:ss'))
  @Column({
    nullable: true,
  })
  departure_time: Date;

  @ManyToOne(() => User, (user) => user.historySlots, {eager: true})
  user: User;
}
