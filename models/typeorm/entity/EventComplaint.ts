import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm'
import { User } from './User'
import { Event } from './Event'
import { BaseAutoIdEntity } from './BaseAutoIdEntity'

@Entity({ name: 'EVENT_COMPLAINT' })
export class EventComplaint extends BaseAutoIdEntity {
  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user!: User

  @ManyToOne(() => Event, (event) => event.id, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  event!: Event

  @Column({ type: 'text' })
  description!: string
}
