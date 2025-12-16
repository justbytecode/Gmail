'use client'

import { Star, Paperclip } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn, formatDate, getInitials, truncateText } from '@/lib/utils'
import { Email } from '@/types/email'
import { toggleStarEmail } from '@/actions/email-actions'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'

interface EmailListItemProps {
  email: Email
  isSelected?: boolean
  onSelect?: (selected: boolean) => void
}

export function EmailListItem({ email, isSelected, onSelect }: EmailListItemProps) {
  const router = useRouter()
  const [isStarred, setIsStarred] = useState(email.isStarred)
  const [isStarring, setIsStarring] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const recipient = email.recipients[0]
  const isRead = recipient?.isRead || false
  const hasAttachments = email.attachments.length > 0

  const handleStarClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isStarring) return

    setIsStarring(true)
    const result = await toggleStarEmail(email.id)
    if (result.success) {
      setIsStarred(result.isStarred!)
    }
    setIsStarring(false)
  }

  const handleClick = () => {
    router.push(`/email/${email.id}`)
  }

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'flex items-center gap-1 md:gap-2 px-1 md:px-2 py-0 border-b border-[#f0f0f0] cursor-pointer hover:shadow-sm transition-all group min-h-[46px]',
        isSelected && 'bg-[#c2e7ff]',
        !isRead && !isSelected && 'bg-white',
        isRead && !isSelected && 'bg-[#f5f5f5]'
      )}
    >
      {/* Checkbox */}
      <div className="flex items-center justify-center w-8 md:w-10 flex-shrink-0">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect?.(checked as boolean)}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            'h-5 w-5 rounded border-[#5f6368]',
            !isHovered && !isSelected && 'opacity-0 md:opacity-100'
          )}
        />
      </div>

      {/* Star */}
      <button
        onClick={handleStarClick}
        className="flex-shrink-0 hover:scale-110 transition-transform w-8 md:w-10 flex items-center justify-center"
        disabled={isStarring}
      >
        <Star
          className={cn(
            'w-4 md:w-5 h-4 md:h-5',
            isStarred
              ? 'fill-[#f9ab00] text-[#f9ab00]'
              : 'text-[#5f6368] hover:text-[#202124]'
          )}
        />
      </button>

      {/* Important marker (Hidden on mobile) */}
      <div className="w-10 items-center justify-center hidden md:flex flex-shrink-0">
        <svg className="w-5 h-5 text-transparent hover:text-[#5f6368] cursor-pointer" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,2l2.4,7.4h7.6l-6,4.6l2.3,7.4l-6.3-4.6l-6.3,4.6l2.3-7.4l-6-4.6h7.6z"/>
        </svg>
      </div>

      {/* Sender Name - Hidden on mobile */}
      <div className="w-[150px] lg:w-[200px] flex-shrink-0 min-w-0 hidden sm:block">
        <span
          className={cn(
            'text-[13px] md:text-[14px] truncate block',
            !isRead ? 'font-bold text-[#202124]' : 'font-normal text-[#5f6368]'
          )}
        >
          {email.sender.name || email.sender.email}
        </span>
      </div>

      {/* Subject & Preview */}
      <div className="flex-1 min-w-0 flex items-center gap-1 md:gap-2">
        <div className="flex-1 min-w-0">
          {/* Mobile: Show sender name + subject */}
          <div className="block sm:hidden">
            <div className={cn(
              'text-[13px] truncate',
              !isRead ? 'font-bold text-[#202124]' : 'font-normal text-[#5f6368]'
            )}>
              {email.sender.name || email.sender.email}
            </div>
            <div className="text-[13px] text-[#202124] truncate">
              {email.subject}
            </div>
          </div>
          
          {/* Desktop: Show subject + preview */}
          <div className="hidden sm:flex items-baseline gap-2">
            <span
              className={cn(
                'text-[13px] md:text-[14px] truncate',
                !isRead ? 'font-bold text-[#202124]' : 'font-normal text-[#202124]'
              )}
            >
              {email.subject}
            </span>
            <span className="text-[12px] md:text-[13px] text-[#5f6368] truncate hidden lg:inline">
              - {truncateText(email.body.replace(/<[^>]*>/g, ''), 80)}
            </span>
          </div>
        </div>
        
        {hasAttachments && (
          <Paperclip className="w-3 md:w-4 h-3 md:h-4 text-[#5f6368] flex-shrink-0" />
        )}
      </div>

      {/* Date */}
      <div className="flex-shrink-0 text-[11px] md:text-[12px] text-[#5f6368] w-12 md:w-20 text-right pr-1 md:pr-2">
        {formatDate(email.sentAt || email.createdAt)}
      </div>
    </div>
  )
}