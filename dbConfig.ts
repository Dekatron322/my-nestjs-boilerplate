import { PostgresConnectionCredentialsOptions } from 'typeorm/driver/postgres/PostgresConnectionCredentialsOptions';
import { DataSourceOptions } from 'typeorm';

// For just the credentials
export const pgCredentials: PostgresConnectionCredentialsOptions = {
  url: 'postgresql://neondb_owner:npg_K4Fh8PMVTonk@ep-steep-lake-ad7g5qvy-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  port: 5432,
};

// For full configuration
export const pgConfig: DataSourceOptions = {
  ...pgCredentials,
  type: 'postgres',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
};

console.log(process.env.url);
