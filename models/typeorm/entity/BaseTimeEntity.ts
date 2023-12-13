import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm'

export abstract class BaseTimeEntity {
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    precision: 0,
  })
  createdAt!: Date

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    precision: 0,
  })
  updatedAt!: Date

  @DeleteDateColumn({ type: 'timestamp', nullable: true, default: null, precision: 0 })
  deletedAt?: Date
}
