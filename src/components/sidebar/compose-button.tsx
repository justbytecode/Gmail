'use client'

import { Plus, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { EmailComposer } from '@/components/email/email-composer'

export function ComposeButton() {
  const [isComposing, setIsComposing] = useState(false)

  return (
    <>
      {/* Desktop Compose Button */}
      <Button
        onClick={() => setIsComposing(true)}
        className="w-full mb-2 h-14 rounded-2xl shadow-md hover:shadow-lg transition-all bg-[#c2e7ff] hover:bg-[#a8d9ff] text-[#001d35] font-medium text-[14px] justify-start px-6 gap-4 hidden md:flex"
      >
        <svg className="w-8 h-8" viewBox="0 0 24 24">
          <path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
        </svg>
        <span>Compose</span>
      </Button>

      {/* Mobile FAB (Floating Action Button) */}
      <Button
        onClick={() => setIsComposing(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all bg-[#c2e7ff] hover:bg-[#a8d9ff] text-[#001d35] md:hidden z-30 p-0 flex items-center justify-center"
      >
        <Pencil className="w-6 h-6" />
      </Button>

      {isComposing && (
        <EmailComposer onClose={() => setIsComposing(false)} />
      )}
    </>
  )
}
