import { getStarredEmails } from '@/actions/email-actions'
import { EmailList } from '@/components/email/email-list'
import { EmailToolbar } from '@/components/email/email-toolbar'

export default async function StarredPage() {
  const { emails } = await getStarredEmails()

  return (
    <div className="flex flex-col h-full">
      <EmailToolbar totalCount={emails.length} />
      <EmailList 
        emails={emails} 
        emptyMessage="No starred emails. Star important emails to find them here."
      />
    </div>
  )
}