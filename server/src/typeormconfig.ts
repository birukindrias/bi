import * as dotenv from 'dotenv';
import { DataSourceOptions } from 'typeorm';
dotenv.config();
const typeormConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST ?? 'localhost',
  port: 5432,
  username: process.env.POSTGRES_USER ?? 'my',
  password: process.env.POSTGRES_PASSWORD ?? 'root',
  database: process.env.POSTGRES_DB ?? 'mydb',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/**/*.js'],
  migrationsRun: false,
  synchronize: true,
};
export = typeormConfig;
