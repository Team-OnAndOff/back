import { PrimaryGeneratedColumn } from 'typeorm'
import { BaseTimeEntity } from './BaseTimeEntity'

export abstract class BaseAutoIdEntity extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id!: number
}
