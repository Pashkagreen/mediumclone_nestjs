import { ConnectionOptions } from 'typeorm';
import {config as dotenv} from 'dotenv'

dotenv();

const config: ConnectionOptions = {
  type: 'postgres',
  host: process.env.PGHOST || 'localhost',
  port: Number(process.env.PGPORT) || 5432,
  username: process.env.PGUSER ||'postgres',
  password:  process.env.PGPASSWORD || 'Adidas228',
  database: process.env.PGDATABASE || 'mediumclone',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

export default config;
