import { getDraftEmails } from '@/actions/email-actions'
import { EmailList } from '@/components/email/email-list'
import { EmailToolbar } from '@/components/email/email-toolbar'

export default async function DraftsPage() {
  const { emails } = await getDraftEmails()

  return (
    <div className="flex flex-col h-full">
      <EmailToolbar totalCount={emails.length} />
      <EmailList 
        emails={emails} 
        emptyMessage="No drafts. Your draft emails will be saved here."
      />
    </div>
  )
}