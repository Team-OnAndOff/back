export class ResponseDTO<T> {
  readonly code: number
  readonly message: string
  readonly data?: T | T[]

  constructor(code: number, message: string, data?: T | T[]) {
    this.code = code
    this.message = message
    this.data = data
  }
}
