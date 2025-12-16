import { getEmailById } from '@/actions/email-actions'
import { EmailDetail } from '@/components/email/email-detail'
import { notFound } from 'next/navigation'

interface EmailPageProps {
  params: {
    emailId: string
  }
}

export default async function EmailPage({ params }: EmailPageProps) {
  const { email } = await getEmailById(params.emailId)

  if (!email) {
    notFound()
  }

  return <EmailDetail email={email} />
}