'use client'

import { EmailComposer } from '@/components/email/email-composer'
import { useRouter } from 'next/navigation'

export default function ComposePage() {
  const router = useRouter()

  return (
    <div className="h-full flex items-center justify-center bg-gray-50">
      <EmailComposer onClose={() => router.push('/inbox')} />
    </div>
  )
}