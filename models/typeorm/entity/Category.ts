import { Entity, Column, OneToMany } from 'typeorm'
import { BaseAutoIdEntity } from './BaseAutoIdEntity'
import { SubCategory } from './SubCategory'

@Entity({ name: 'CATEGORY' })
export class Category extends BaseAutoIdEntity {
  @Column({ type: 'varchar', length: 255 })
  name!: string

  @Column({ type: 'tinyint' })
  flag!: number

  @Column({ type: 'varchar', length: 255 })
  description!: string

  @OneToMany(() => SubCategory, (category) => category.parentId, {
    nullable: true,
  })
  subCategories!: SubCategory[]
}
