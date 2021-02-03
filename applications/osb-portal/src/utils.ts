import cookie from 'cookie'
import type { IncomingMessage } from 'http'

export function formatDate(date: Date | string) {
    return new Date(date).toLocaleDateString("en-US", { hour: '2-digit', minute: '2-digit' });
}

export function parseCookies(req?: IncomingMessage) {
  if (!req || !req.headers) {
    return {}
  }
  return cookie.parse(req.headers.cookie || '')
}