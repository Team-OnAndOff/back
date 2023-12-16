import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm'
import { Category } from './Category'
import { BaseAutoIdEntity } from './BaseAutoIdEntity'

@Entity({ name: 'SUB_CATEGORY' })
export class SubCategory extends BaseAutoIdEntity {
  @Column({ type: 'varchar', length: 255 })
  name!: string

  @ManyToOne(() => Category, (category) => category.id, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'parentId' })
  parentId?: Category
}
