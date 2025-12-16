import { getInboxEmails } from '@/actions/email-actions'
import { EmailList } from '@/components/email/email-list'
import { EmailToolbar } from '@/components/email/email-toolbar'

export default async function InboxPage() {
  const { emails } = await getInboxEmails()

  return (
    <div className="flex flex-col h-full">
      <EmailToolbar totalCount={emails.length} />
      <EmailList 
        emails={emails} 
        emptyMessage="Your inbox is empty. When you receive new emails, they will appear here."
      />
    </div>
  )
}