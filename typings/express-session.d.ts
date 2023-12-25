import 'express-session'
declare module 'express-session' {
  interface SessionData {
    originUrl: string
    profileUrl: string
    isNewUser: boolean
    passport: any
  }
}
