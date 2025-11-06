import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Platoon } from '../entities/platoon.entity';
import { RefreshToken } from '../entities/refresh-token.entity';

export const ormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '575772239',
  database: process.env.DB_NAME || 'umk',
  schema: process.env.DB_SCHEMA || 'dev_data',
  entities: [
    User,
    Platoon,
    RefreshToken,
  ],
  synchronize: false,
  logging: true,
  extra: {
    max: 20,
    connectionTimeoutMillis: 10000,
  },
};