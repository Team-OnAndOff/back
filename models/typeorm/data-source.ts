import 'reflect-metadata'
import { DataSource } from 'typeorm'

import dotenv from 'dotenv'

dotenv.config()

const selected_db = process.env.SELECTED_DB

const LOCATION =
  selected_db === 'LOCAL'
    ? process.env.LOCAL_LOCATION
    : process.env.RDS_LOCATION
const PORT =
  selected_db === 'LOCAL' ? process.env.LOCAL_PORT : process.env.RDS_PORT
const USERNAME =
  selected_db === 'LOCAL'
    ? process.env.LOCAL_USERNAME
    : process.env.RDS_USERNAME
const PASSWORD =
  selected_db === 'LOCAL'
    ? process.env.LOCAL_PASSWORD
    : process.env.RDS_PASSWORD
const DB_NAME =
  selected_db === 'LOCAL' ? process.env.LOCAL_DB_NAME : process.env.RDS_DB_NAME

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: LOCATION,
  port: Number(PORT),
  username: USERNAME,
  password: PASSWORD,
  database: DB_NAME,
  synchronize: true,
  logging: false,
  entities: ['models/typeorm/entity/*.ts'],
  migrations: [],
  subscribers: [],
})
