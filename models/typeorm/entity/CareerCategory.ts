import { Entity, Column, ManyToMany, JoinTable } from 'typeorm'
import { BaseAutoIdEntity } from './BaseAutoIdEntity'
import { Event } from './Event'

@Entity({ name: 'CAREER_CATEGORY' })
export class CareerCategory extends BaseAutoIdEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  name!: string

  @ManyToMany(() => Event, (event) => event.id)
  @JoinTable({
    name: 'EVENT_CAREER_CATEGORY',
  })
  events!: Event[]
}
