import 'reflect-metadata'
import { DataSource } from 'typeorm'

import dotenv from 'dotenv'

dotenv.config()

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.RDS_LOCATION,
  port: Number(process.env.RDS_PORT),
  username: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DB_NAME,
  synchronize: true,
  logging: false,
  entities: ['models/typeorm/entity/*.ts'],
  migrations: [],
  subscribers: [],
})
