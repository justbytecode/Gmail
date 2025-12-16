export const EMAIL_CATEGORIES = {
  INBOX: 'inbox',
  SENT: 'sent',
  DRAFTS: 'drafts',
  STARRED: 'starred',
  SNOOZED: 'snoozed',
  TRASH: 'trash',
  SPAM: 'spam',
  ARCHIVE: 'archive',
} as const

export const RECIPIENT_TYPES = {
  TO: 'TO',
  CC: 'CC',
  BCC: 'BCC',
} as const

export const NOTIFICATION_TYPES = {
  NEW_EMAIL: 'NEW_EMAIL',
  READ_RECEIPT: 'READ_RECEIPT',
  MENTION: 'MENTION',
  REPLY: 'REPLY',
} as const

export const MAX_ATTACHMENT_SIZE = 25 * 1024 * 1024 // 25MB
export const EMAILS_PER_PAGE = 50