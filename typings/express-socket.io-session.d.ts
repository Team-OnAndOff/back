import socketio = require('socket.io')
import express = require('express')
import session = require('express-session')

declare module 'socket.io' {
  //   interface Handshake {
  //     session?: (session.Session & Partial<session.SessionData>) | undefined
  //     sessionID?: string | undefined
  //   }
  interface Socket {
    session?: (session.Session & Partial<session.SessionData>) | undefined
    sessionID?: string | undefined
  }
}
