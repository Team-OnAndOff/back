import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm'
import { User } from './User'
import { Event } from './Event'
import { BaseAutoIdEntity } from './BaseAutoIdEntity'

@Entity({ name: 'EVENT_APPLY' })
export class EventApply extends BaseAutoIdEntity {
  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user!: User

  @ManyToOne(() => Event, (event) => event.id, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'eventId' })
  event!: Event

  @Column({ type: 'text' })
  answer!: string

  @Column({ type: 'tinyint' })
  flag!: number

  @Column({ type: 'datetime' })
  appliedAt!: Date

  @Column({ type: 'datetime', nullable: true, default: null })
  approvedAt!: Date

  @Column({ type: 'tinyint' })
  status!: number
}
