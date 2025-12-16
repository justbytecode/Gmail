export interface Notification {
  id: string
  userId: string
  type: 'NEW_EMAIL' | 'READ_RECEIPT' | 'MENTION' | 'REPLY'
  title: string
  message: string
  emailId: string | null
  isRead: boolean
  createdAt: Date
}