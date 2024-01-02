import 'express'
declare module 'express' {
  interface User {
    socialId?: string
  }
  interface Response {
    originUrl?: string
    profileUrl?: string
  }
}
