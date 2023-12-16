import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm'
import { User } from './User'
import { BaseAutoIdEntity } from './BaseAutoIdEntity'

@Entity({ name: 'USER_COMPLAINT' })
export class UserComplaint extends BaseAutoIdEntity {
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
  @JoinColumn({ name: 'reportedId' })
  reportedId!: User

  @Column({ type: 'text' })
  description!: string
}
