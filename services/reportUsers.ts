import httpStatus from 'http-status'
import { AppDataSource } from '../models/typeorm/data-source'
import { User } from '../models/typeorm/entity/User'
import {
  CareerCategoryBodyDTO,
  CareerCategoryParamsDTO,
} from '../models/typeorm/dto/CareerCategoryDTO'
import { ResponseDTO } from '../models/typeorm/dto/ResponseDTO'
import { ApiError } from '../utils/error'
import { CreateUserReportDTO } from '../models/typeorm/dto/ReportUserDTO'
import { UserAssess } from '../models/typeorm/entity/UserAssess'
import { Event } from '../models/typeorm/entity/Event'

import { UserComplaint } from '../models/typeorm/entity/UserComplaint'

class UserReportService {
  private repo
  private assessRepo
  private eventRepo
  private userReportRepo
  constructor() {
    this.repo = AppDataSource.getRepository(User)
    this.assessRepo = AppDataSource.getRepository(UserAssess)
    this.eventRepo = AppDataSource.getRepository(Event)
    this.userReportRepo = AppDataSource.getRepository(UserComplaint)
  }
  async findUserReports(reporterId: number) {
    const reporter = await this.repo.findOne({ where: { id: reporterId } })
    if (!reporter) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        '리포터의 아이디가 잘못되었습니다.',
      )
    }
    const result = await this.userReportRepo
      .createQueryBuilder('ur')
      .andWhere('ur.reporterId = :reporterId', { reporterId: reporter.id })
      .leftJoinAndSelect('ur.reporterId', 'rr')
      .leftJoinAndSelect('rr.image', 'rrimage')
      .leftJoinAndSelect('ur.reportedId', 'rd')
      .leftJoinAndSelect('rd.image', 'rdimage')
      .select([
        'ur.id',
        'ur.description',
        'ur.createdAt',
        'ur.updatedAt',
        'rr.id',
        'rr.username',
        'rrimage.id',
        'rrimage.uploadPath',
        'rd.id',
        'rd.username',
        'rdimage.id',
        'rdimage.uploadPath',
      ])
      .getMany()

    return result
  }
  async createUserReport(dto: CreateUserReportDTO) {
    const report = new UserComplaint()
    const reporter = await this.repo.findOne({ where: { id: dto.reporterId } })
    const reported = await this.repo.findOne({ where: { id: dto.attendeeId } })
    if (!reporter || !reported) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        '신고자 혹은 대상자의 아이디가 존재하지 않습니다.',
      )
    }
    report.reporterId = reporter
    report.reportedId = reported
    report.description = dto.description
    const reportResult = await this.userReportRepo.save(report)
    const result = await this.userReportRepo
      .createQueryBuilder('ur')
      .andWhere('ur.id = :reportId', { reportId: reportResult.id })
      .leftJoinAndSelect('ur.reporterId', 'rr')
      .leftJoinAndSelect('rr.image', 'rrimage')
      .leftJoinAndSelect('ur.reportedId', 'rd')
      .leftJoinAndSelect('rd.image', 'rdimage')
      .select([
        'ur.id',
        'ur.description',
        'ur.createdAt',
        'ur.updatedAt',
        'rr.id',
        'rr.username',
        'rrimage.id',
        'rrimage.uploadPath',
        'rd.id',
        'rd.username',
        'rdimage.id',
        'rdimage.uploadPath',
      ])
      .getOne()

    return result
  }
  async findUserReportDetail(reportId: number) {
    // const target = await this.assessRepo.findOne({
    //   where: { id: aid },
    // })
    const result = await this.userReportRepo
      .createQueryBuilder('ur')
      .andWhere('ur.id = :rid', { rid: reportId })
      .leftJoinAndSelect('ur.reporterId', 'rr')
      .leftJoinAndSelect('rr.image', 'rrimage')
      .leftJoinAndSelect('ur.reportedId', 'rd')
      .leftJoinAndSelect('rd.image', 'rdimage')
      .select([
        'ur.id',
        'ur.description',
        'ur.createdAt',
        'ur.updatedAt',
        'rr.id',
        'rr.username',
        'rrimage.id',
        'rrimage.uploadPath',
        'rd.id',
        'rd.username',
        'rdimage.id',
        'rdimage.uploadPath',
      ])
      .getOne()
    console.log(result)

    return result
  }
}

export default new UserReportService()
