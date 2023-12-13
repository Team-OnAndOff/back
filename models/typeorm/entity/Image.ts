import { Entity, Column } from 'typeorm'
import { BaseAutoIdEntity } from './BaseAutoIdEntity'

@Entity({ name: 'IMAGE' })
export class Image extends BaseAutoIdEntity {
  @Column({ type: 'varchar', length: 255 })
  filename!: string

  @Column({ type: 'varchar', length: 255 })
  uploadPath!: string

  @Column({ type: 'int', default: 0 })
  size!: number
}
