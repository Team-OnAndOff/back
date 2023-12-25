import { Request } from 'express'

export default class RequestHandler {
  protected static extractParams<T>(
    req: Request,
    c: { new (params: any): T },
  ): T {
    return new c(req.params)
  }

  protected static extractBody<T>(req: Request, c: { new (body: any): T }): T {
    return new c(req.body)
  }

  protected static extractQuery<T>(
    req: Request,
    c: { new (query: any): T },
  ): T {
    return new c(req.query)
  }

  protected static extractFile<T>(req: Request, c: { new (file: any): T }): T {
    return new c(req.file!)
  }
}
