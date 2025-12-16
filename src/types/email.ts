export interface Email {
  id: string
  subject: string
  body: string
  bodyHtml?: string | null
  senderId: string
  threadId?: string | null
  isDraft: boolean
  isStarred: boolean
  isTrashed: boolean
  isSpam: boolean
  isArchived: boolean
  scheduledAt?: Date | null
  sentAt?: Date | null
  createdAt: Date
  updatedAt: Date
  sender: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
  recipients: EmailRecipient[]
  attachments: Attachment[]
  labels: EmailLabel[]
  readReceipts: ReadReceipt[]
  _count?: {
    recipients: number
  }
}

export interface EmailRecipient {
  id: string
  emailId: string
  userId: string
  type: 'TO' | 'CC' | 'BCC'
  isRead: boolean
  readAt?: Date | null
  createdAt: Date
  user: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
}

export interface Attachment {
  id: string
  emailId: string
  filename: string
  mimeType: string
  size: number
  url: string
  createdAt: Date
}

export interface EmailLabel {
  id: string
  emailId: string
  labelId: string
  label: {
    id: string
    name: string
    color: string | null
  }
}

export interface ReadReceipt {
  id: string
  emailId: string
  userId: string
  readAt: Date
  ipAddress?: string | null
  userAgent?: string | null
}

export interface EmailThread {
  id: string
  subject: string
  lastMessageAt: Date
  createdAt: Date
  updatedAt: Date
  emails: Email[]
  _count?: {
    emails: number
  }
}