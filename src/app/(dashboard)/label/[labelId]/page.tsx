import { getEmailsByLabel } from '@/actions/label-actions'
import { EmailList } from '@/components/email/email-list'
import { EmailToolbar } from '@/components/email/email-toolbar'

interface LabelPageProps {
  params: {
    labelId: string
  }
}

export default async function LabelPage({ params }: LabelPageProps) {
  const { emails } = await getEmailsByLabel(params.labelId)

  return (
    <div className="flex flex-col h-full">
      <EmailToolbar totalCount={emails.length} />
      <EmailList 
        emails={emails} 
        emptyMessage="No emails with this label."
      />
    </div>
  )
}
