import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm'
import { User } from './User'
import { SubCategory } from './SubCategory'
import { Image } from './Image'
import { EventAddress } from './EventAddress'
import { BaseAutoIdEntity } from './BaseAutoIdEntity'
import { UserAssess } from './UserAssess'
import { EventApply } from './EventApply'
import { EventHashTag } from './EventHashTag'
import { EventComplaint } from './EventComplaint'
import { EventLike } from './EventLike'
import { CareerCategory } from './CareerCategory'

@Entity({ name: 'EVENT' })
export class Event extends BaseAutoIdEntity {
  @ManyToOne(() => User, (user) => user.id, { nullable: false, cascade: true })
  @JoinColumn()
  user!: User

  @ManyToOne(() => SubCategory, (category) => category.id, { nullable: false })
  @JoinColumn()
  category!: SubCategory

  @OneToOne(() => Image, (image) => image.id, { nullable: true, cascade: true })
  @JoinColumn()
  image!: Image

  @OneToOne(() => EventAddress, (address) => address.id, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn()
  address!: EventAddress

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

  @Column({ type: 'date' })
  challengeStartDate!: Date

  @Column({ type: 'date', nullable: true })
  challengeEndDate?: Date

  @OneToMany(() => UserAssess, (assess) => assess.eventId, { nullable: true })
  userAssess?: UserAssess[]

  @OneToMany(() => EventApply, (apply) => apply.eventId, { nullable: true })
  eventApplies?: EventApply[]

  @OneToMany(() => EventHashTag, (hashTag) => hashTag.eventId, {
    nullable: true,
    cascade: true,
  })
  hashTags!: EventHashTag[]

  @OneToMany(() => EventComplaint, (eventComplaint) => eventComplaint.eventId, {
    nullable: true,
  })
  eventComplaints?: EventComplaint[]

  @OneToMany(() => User, (user) => user.id, {
    nullable: true,
  })
  reporters?: User[]

  @ManyToMany(() => CareerCategory, (category) => category.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'EVENT_CAREER_CATEGORY',
  })
  careerCategories!: CareerCategory[]

  @OneToMany(() => EventLike, (like) => like.eventId, { nullable: true })
  likes?: EventLike[]
}
