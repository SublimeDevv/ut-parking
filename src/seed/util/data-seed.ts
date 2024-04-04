import * as bcrypt from 'bcrypt';

interface SeedUser {
  id: string;
  email: string;
  fullName: string;
  password: string;
  roles: string;
  tuition: string;
}

interface SeedSlot {
  sensorId: string;
  isOccupied: boolean;
}

interface SeedHistory {
  user: string;
  entry_time?: Date;
  departure_time?: Date;
}

interface SeedData {
  users: SeedUser[];
  history: SeedHistory[];
  slots: SeedSlot[];
}

export const initialData: SeedData = {
  users: [
    {
      id: 'd730b542-48e0-41d8-a6a6-e956897901e8',
      email: 'juan@gmail.com',
      fullName: 'Juan Diego Mendoza Gutiérrez',
      password: bcrypt.hashSync('Juan77?', 10),
      roles: 'teacher',
      tuition: '23 02 66 EE',
    },
    {
      id: '8f8ed49b-a938-4e57-9ac1-761c76533147',
      email: 'alonso@gmail.com',
      fullName: 'Carlos Alonso Sánchez Roano',
      password: bcrypt.hashSync('Alonso77?', 10),
      roles: 'student',
      tuition: '83 58 26 DD',
    },
  ],

  slots: [
    {
      sensorId: 'sensor1',
      isOccupied: false,
    },
    {
      sensorId: 'sensor2',
      isOccupied: false,
    },
    {
      sensorId: 'sensor3',
      isOccupied: false,
    },
    {
      sensorId: 'sensor4',
      isOccupied: false,
    },
    {
      sensorId: 'sensor5',
      isOccupied: false,
    },
    {
      sensorId: 'sensor6',
      isOccupied: false,
    },
    {
      sensorId: 'sensor7',
      isOccupied: false,
    },
    {
      sensorId: 'sensor8',
      isOccupied: false,
    },
    {
      sensorId: 'sensor9',
      isOccupied: false,
    },
    {
      sensorId: 'sensor10',
      isOccupied: false,
    },
  ],

  history: [
    {
      user: '8f8ed49b-a938-4e57-9ac1-761c76533147',
      entry_time: new Date('2024-04-03 19:06:32'),
    },
    {
      user: '8f8ed49b-a938-4e57-9ac1-761c76533147',
      departure_time: new Date('2024-04-03 19:07:42'),
    },

    {
      user: 'd730b542-48e0-41d8-a6a6-e956897901e8',
      entry_time: new Date('2024-04-03 19:08:24'),
    },
    {
      user: 'd730b542-48e0-41d8-a6a6-e956897901e8',
      departure_time: new Date('2024-04-03 19:09:11'),
    },
  ],
};
