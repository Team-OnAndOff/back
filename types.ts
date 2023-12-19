import { Request, Response, NextFunction } from 'express'
export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void

export type RequestPart = 'body' | 'params' | 'query' | 'file'

export enum EVENT_APPLY_STATUS {
  APPLY = 0, // 신청
  REFUSE = 1, // 거절
  CANCEL = 2, // 취소
  APPROVED = 3, // 승인
  LEAVE = 4, // 탈퇴
  DEPORTATION = 5, // 추방
}

export enum EVENT_APPLY_FLAG {
  MEMBER = 0, // 팀원
  LEADER = 1, // 방장
}
