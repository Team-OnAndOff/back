import winston from 'winston'
import dotenv from 'dotenv'

dotenv.config()

const { combine, timestamp, label, printf } = winston.format

const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`
})

export const logger = winston.createLogger({
  //* 로그 출력 형식 정의
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    label({ label: 'on&off:backend' }),
    logFormat,
  ),
  transports: [new winston.transports.Console()],
})
