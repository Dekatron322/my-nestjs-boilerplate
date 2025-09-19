import { DataSourceOptions } from 'typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PostgresConnectionCredentialsOptions } from 'typeorm/driver/postgres/PostgresConnectionCredentialsOptions.js';
import { User } from 'src/entities/user.entity';
import { Property } from 'src/entities/property.entity';
import { PropertyFeature } from 'src/entities/propertyFeature.entity';
import { PropertyType } from 'src/entities/propertyType.entity';

export const pgCredentials = (): PostgresConnectionCredentialsOptions => ({
  url: process.env.DATABASE_URL || process.env.url,
  port: process.env.DATABASE_PORT
    ? +process.env.DATABASE_PORT
    : process.env.port
      ? +process.env.port
      : 5432,
  //   host: process.env.DATABASE_HOST || process.env.host,
  //   username: process.env.DATABASE_USERNAME || process.env.username,
  //   password: process.env.DATABASE_PASSWORD || process.env.password,
  //   database: process.env.DATABASE_NAME || process.env.database,
});

export const typeOrmConfig = (): TypeOrmModuleOptions => ({
  ...pgCredentials(),
  type: 'postgres',
  entities: [User, Property, PropertyFeature, PropertyType],
  synchronize: (process.env.NODE_ENV || 'development') !== 'production',
});

export const dataSourceConfig = (): DataSourceOptions => ({
  ...pgCredentials(),
  type: 'postgres',
  entities: [User, Property, PropertyFeature, PropertyType],
  synchronize: (process.env.NODE_ENV || 'development') !== 'production',
});
