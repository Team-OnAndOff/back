import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm'
import { User } from './User'
import { Event } from './Event'
import { BaseAutoIdEntity } from './BaseAutoIdEntity'

@Entity({ name: 'EVENT_LIKE' })
export class EventLike extends BaseAutoIdEntity {
  @ManyToOne(() => Event, (event) => event.id, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'eventId' })
  event!: Event

  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user!: User

  @Column({ type: 'datetime', nullable: true })
  liked?: Date
}
