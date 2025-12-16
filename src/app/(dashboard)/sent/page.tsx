import { getSentEmails } from '@/actions/email-actions'
import { EmailList } from '@/components/email/email-list'
import { EmailToolbar } from '@/components/email/email-toolbar'

export default async function SentPage() {
  const { emails } = await getSentEmails()

  return (
    <div className="flex flex-col h-full">
      <EmailToolbar totalCount={emails.length} />
      <EmailList 
        emails={emails} 
        emptyMessage="No sent emails. Emails you send will appear here."
      />
    </div>
  )
}