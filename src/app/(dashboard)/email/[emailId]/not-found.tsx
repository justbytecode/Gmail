import { EmptyState } from '@/components/common/empty-state'
import { MailX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function EmailNotFound() {
  return (
    <EmptyState
      icon={MailX}
      title="Email not found"
      description="The email you're looking for doesn't exist or you don't have permission to view it."
      action={
        <Link href="/inbox">
          <Button>Go to Inbox</Button>
        </Link>
      }
    />
  )
}