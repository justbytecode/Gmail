'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { searchEmails } from '@/actions/search-actions'
import { EmailList } from '@/components/email/email-list'
import { EmailToolbar } from '@/components/email/email-toolbar'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { Email } from '@/types/email'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [emails, setEmails] = useState<Email[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const performSearch = async () => {
      if (!query) {
        setEmails([])
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      const result = await searchEmails(query)
      if (result.success) {
        setEmails(result.emails)
      }
      setIsLoading(false)
    }

    performSearch()
  }, [query])

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-medium text-gray-900">
          Search results for "{query}"
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {emails.length} {emails.length === 1 ? 'result' : 'results'} found
        </p>
      </div>
      <EmailToolbar totalCount={emails.length} />
      <EmailList 
        emails={emails} 
        emptyMessage={`No emails found matching "${query}"`}
      />
    </div>
  )
}