import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm'
import { User } from './User'
import { Event } from './Event'
import { BaseAutoIdEntity } from './BaseAutoIdEntity'

@Entity({ name: 'USER_ASSESS' })
export class UserAssess extends BaseAutoIdEntity {
  @ManyToOne(() => Event, (event) => event.id, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'eventId' })
  eventId!: Event

  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'reporterId' })
  reporterId!: User

  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'attendeeId' })
  attendeeId!: User

  @Column({ type: 'int', nullable: false })
  score!: number

  @Column({ type: 'text', nullable: true, default: null })
  description!: string
}
