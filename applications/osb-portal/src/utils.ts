import cookie from 'cookie'
import type { IncomingMessage, OutgoingMessage } from 'http'

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", { hour: '2-digit', minute: '2-digit' });
}

export function parseCookies(req?: IncomingMessage) {
  if (!req || !req.headers) {
    return {}
  }
  return cookie.parse(req.headers.cookie || '')
}

export function deleteCookies(res: OutgoingMessage) {
  res.setHeader('Set-Cookie', [
    cookie.serialize('kcToken', '', {
      maxAge: -1,
      path: '/',
    }),
    cookie.serialize('kcIdToken', '', {
      maxAge: -1,
      path: '/',
    }),
  ])
}
