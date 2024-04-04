import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { HistorySlot } from 'src/parking-slot/entities/history-slot.entity';
import { ParkingSlot } from 'src/parking-slot/entities/parking-slot.entity';
import { Repository } from 'typeorm';
import { initialData } from './util/data-seed';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(ParkingSlot)
    private readonly parkingSlotRepository: Repository<ParkingSlot>,
    @InjectRepository(HistorySlot)
    private readonly historySlotRepository: Repository<HistorySlot>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async runSeed() {
    await this.deleteAllTables();

    await this.insertUsers();
    await this.insertSlots();
    await this.insertHistory();

    return 'Seed executed!';
  }

  async deleteAllTables() {
    await this.retryWithBackoff(3, async () => {
      await Promise.all([
        this.historySlotRepository.createQueryBuilder().delete().execute(),
        this.parkingSlotRepository.createQueryBuilder().delete().execute(),
        this.userRepository.createQueryBuilder().delete().execute(),
      ]);
    });
  }

  async insertHistory() {
    // @ts-ignore
    const seedHistory = initialData.history.map(history => this.historySlotRepository.create(history));
    await this.retryWithBackoff(3, async () => {
      await this.historySlotRepository.save(seedHistory);
    });
  }

  async insertUsers() {
    // @ts-ignore
    const seedUsers = initialData.users.map(user => this.userRepository.create(user));
    await this.retryWithBackoff(3, async () => {
      await this.userRepository.save(seedUsers);
    });
  }

  async insertSlots() {
    const seedSlots = initialData.slots.map(slot => this.parkingSlotRepository.create(slot));
    await this.retryWithBackoff(3, async () => {
      await this.parkingSlotRepository.save(seedSlots);
    });
  }

  async retryWithBackoff(retries: number, operation: () => Promise<any>) {
    let attempts = 0;
    while (attempts < retries) {
      try {
        attempts++;
        await operation();
        break; 
      } catch (error) {
        if (attempts === retries) {
          throw error; 
        } else {
          console.warn(`Error during database operation, retrying... (Attempt ${attempts}/${retries})`);
          await new Promise(resolve => setTimeout(resolve, 1000 * attempts)); 
        }
      }
    }
  }
}
