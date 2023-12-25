import 'express'
declare module 'express' {
  interface User {
    socialId?: string
  }
}
