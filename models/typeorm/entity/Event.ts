import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm'
import { User } from './User'
import { SubCategory } from './SubCategory'
import { Image } from './Image'
import { CareerCategory } from './CareerCategory'
import { EventAddress } from './EventAddress'
import { BaseAutoIdEntity } from './BaseAutoIdEntity'
import { UserAssess } from './UserAssess'
import { EventApply } from './EventApply'
import { EventHashTag } from './EventHashTag'
import { EventComplaint } from './EventComplaint'
import { EventCareerCategory } from './EventCareerCategory'
import { EventLike } from './EventLike'

@Entity({ name: 'EVENT' })
export class Event extends BaseAutoIdEntity {
  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  userId!: User

  @OneToOne(() => SubCategory, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  categoryId!: SubCategory

  @OneToOne(() => Image, {
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  image!: Image

  @ManyToOne(() => CareerCategory, (category) => category.id, {
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'careerCategoryId' })
  careerCategoryId!: CareerCategory

  @OneToOne(() => EventAddress, {
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'addressId' })
  address?: EventAddress

  @Column({ type: 'varchar', length: 255 })
  title!: string

  @Column({ type: 'text' })
  content!: string

  @Column({ type: 'int' })
  recruitment!: number

  @Column({ type: 'text' })
  question!: string

  @Column({ type: 'tinyint' })
  online!: number

  @Column({ type: 'date', nullable: true })
  challengeStartDate?: Date

  @Column({ type: 'date', nullable: true })
  challengeEndDate?: Date

  @OneToMany(() => UserAssess, (assess) => assess.eventId, {
    nullable: true,
  })
  userAssess?: UserAssess[]

  @OneToMany(() => EventApply, (apply) => apply.eventId, {
    nullable: true,
  })
  eventApplies?: EventApply[]

  @OneToMany(() => EventHashTag, (hashTag) => hashTag.eventId, {
    nullable: true,
  })
  hashTags?: EventHashTag[]

  @OneToMany(() => EventComplaint, (eventComplaint) => eventComplaint.eventId, {
    nullable: true,
  })
  eventComplaints?: EventComplaint[]

  @OneToMany(() => User, (user) => user.id, {
    nullable: true,
  })
  reporters?: User[]

  @OneToMany(
    () => EventCareerCategory,
    (careerCategory) => careerCategory.eventId,
    {
      nullable: true,
    },
  )
  careerCategories?: EventCareerCategory[]

  @OneToMany(() => EventLike, (like) => like.eventId, {
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  likes?: EventLike[]
}
