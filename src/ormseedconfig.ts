import { ConnectionOptions } from 'typeorm';
import config from './ormconfig';

const ormseedconfig: ConnectionOptions = {
  ...config,
  migrations: [__dirname + '/seeds/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/seeds'
  }
};

export default ormseedconfig;
