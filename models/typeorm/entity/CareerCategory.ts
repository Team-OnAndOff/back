import { Entity, Column, OneToMany } from 'typeorm'
import { BaseAutoIdEntity } from './BaseAutoIdEntity'
import { EventCareerCategory } from './EventCareerCategory'

@Entity({ name: 'CAREER_CATEGORY' })
export class CareerCategory extends BaseAutoIdEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  name!: string

  @OneToMany(
    () => EventCareerCategory,
    (careerCategory) => careerCategory.careerCategoryId,
    {
      nullable: true,
    },
  )
  careerCategories!: EventCareerCategory[]
}
