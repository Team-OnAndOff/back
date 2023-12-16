import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm'
import { Event } from './Event'
import { BaseAutoIdEntity } from './BaseAutoIdEntity'

@Entity({ name: 'EVENT_HASHTAG' })
export class EventHashTag extends BaseAutoIdEntity {
  @ManyToOne(() => Event, (event) => event.id, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'eventId' })
  eventId!: Event

  @Column({ type: 'varchar', length: 255 })
  hashtag!: string
}
