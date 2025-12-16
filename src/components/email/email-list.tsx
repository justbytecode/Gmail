'use client'

import { useState } from 'react'
import { Email } from '@/types/email'
import { EmailListItem } from './email-list-item'
import { EmptyState } from '@/components/common/empty-state'
import { Inbox } from 'lucide-react'

interface EmailListProps {
  emails: Email[]
  emptyMessage?: string
}

export function EmailList({ emails, emptyMessage = 'No emails found' }: EmailListProps) {
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set())

  const handleSelectEmail = (emailId: string, selected: boolean) => {
    setSelectedEmails(prev => {
      const newSet = new Set(prev)
      if (selected) {
        newSet.add(emailId)
      } else {
        newSet.delete(emailId)
      }
      return newSet
    })
  }

  if (emails.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="No emails"
        description={emptyMessage}
      />
    )
  }

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      {emails.map((email) => (
        <EmailListItem 
          key={email.id} 
          email={email}
          isSelected={selectedEmails.has(email.id)}
          onSelect={(selected) => handleSelectEmail(email.id, selected)}
        />
      ))}
    </div>
  )
}
