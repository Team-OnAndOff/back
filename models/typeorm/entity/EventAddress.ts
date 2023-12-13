import { Entity, Column } from 'typeorm'
import { BaseAutoIdEntity } from './BaseAutoIdEntity'

@Entity({ name: 'EVENT_ADDRESS' })
export class EventAddress extends BaseAutoIdEntity {
  @Column({ type: 'int' })
  zipCode!: number

  @Column({ type: 'varchar', length: 255 })
  detail1!: string

  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  detail2!: string

  @Column({ type: 'double' })
  latitude!: number

  @Column({ type: 'double' })
  longitude!: number
}
