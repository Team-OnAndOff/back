import { Entity, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm'
import { Image } from './Image'
import { Event } from './Event'
import { CareerCategory } from './CareerCategory'
import { BaseAutoIdEntity } from './BaseAutoIdEntity'
import { UserAssess } from './UserAssess'
import { EventApply } from './EventApply'
import { UserComplaint } from './UserComplaint'
import { EventLike } from './EventLike'
import { EventComplaint } from './EventComplaint'

@Entity({ name: 'USER' })
export class User extends BaseAutoIdEntity {
  @Column({ type: 'varchar', length: 255 })
  socialId!: string

  @Column({ type: 'varchar', length: 255 })
  provider!: string

  @Column({ type: 'varchar', length: 255 })
  username!: string

  @Column({ type: 'varchar', length: 255 })
  email!: string

  @Column({ type: 'text' })
  introduction?: string

  @OneToOne(() => Image, {
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  image!: Image

  @OneToOne(() => CareerCategory, {
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  careerCategory?: CareerCategory

  @OneToMany(() => Event, (event) => event.user)
  events!: Event[]

  @OneToMany(() => EventLike, (event) => event.user, {
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  likes!: EventLike[]

  @OneToMany(() => UserAssess, (assess) => assess.reporterId, {
    nullable: true,
  })
  reporterAssess?: UserAssess[]

  @OneToMany(() => UserAssess, (assess) => assess.attendeeId, {
    nullable: true,
  })
  attendeeAssess?: UserAssess[]

  @OneToMany(() => EventApply, (apply) => apply.user, {
    nullable: true,
  })
  eventApplies?: EventApply[]

  @OneToMany(() => UserComplaint, (complaint) => complaint.reporterId, {
    nullable: true,
  })
  reporterComplaints?: UserComplaint[]

  @OneToMany(() => UserComplaint, (complaint) => complaint.reportedId, {
    nullable: true,
  })
  reportedComplaints?: UserComplaint[]

  @OneToMany(() => EventComplaint, (complaint) => complaint.user, {
    nullable: true,
  })
  eventComplaints?: EventComplaint[]
}
