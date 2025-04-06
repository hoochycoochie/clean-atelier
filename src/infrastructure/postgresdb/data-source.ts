// Use it just for migration
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { Player } from './entities/player.entity';

config();

const options = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  port: Number(process.env.POSTGRES_PORT),
  password: process.env.POSTGRES_PASSWORD,
  username: process.env.POSTGRES_USER,
  migrations: [join(__dirname, 'migrations', '*{.ts,.js}')],
  entities: [Player],
  autoLoadEntities: true,
  synchronize: false, //
} satisfies TypeOrmModuleOptions;

export default new DataSource(options);
