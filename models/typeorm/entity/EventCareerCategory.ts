import { Entity, JoinColumn, ManyToOne } from 'typeorm'
import { Event } from './Event'
import { CareerCategory } from './CareerCategory'
import { BaseAutoIdEntity } from './BaseAutoIdEntity'

@Entity({ name: 'EVENT_CAREER_CATEGORY' })
export class EventCareerCategory extends BaseAutoIdEntity {
  @ManyToOne(() => Event, (event) => event.id, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'eventId' })
  eventId!: Event

  @ManyToOne(() => CareerCategory, (category) => category.id, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'careerCategoryId' })
  careerCategoryId!: CareerCategory
}
