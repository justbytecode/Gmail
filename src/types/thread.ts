import { Email } from './email'

export interface Thread {
  id: string
  subject: string
  lastMessageAt: Date
  createdAt: Date
  updatedAt: Date
  emails: Email[]
}