declare namespace NodeJS {
  export interface ProcessEnv {
    GOOGLE_CLIENT_ID: string
    GOOGLE_CLIENT_SECRET: string
    GOOGLE_CALLBACK_PATH: string

    FACEBOOK_CLIENT_ID: string
    FACEBOOK_CLIENT_SECRET: string
    FACEBOOK_CALLBACK_PATH: string

    KAKAO_CLIENT_ID: string
    KAKAO_CLIENT_SECRET: string
    KAKAO_CALLBACK_PATH: string

    NAVER_CLIENT_ID: string
    NAVER_CLIENT_SECRET: string
    NAVER_CALLBACK_PATH: string
  }
}
