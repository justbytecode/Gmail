'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Star,
  Reply,
  ReplyAll,
  Forward,
  Archive,
  Trash2,
  MoreVertical,
  Paperclip,
  Download,
  ArrowLeft,
} from 'lucide-react'
import { Email } from '@/types/email'
import { formatDate, getInitials } from '@/lib/utils'
import { toggleStarEmail, moveToTrash, archiveEmail } from '@/actions/email-actions'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EmailComposer } from './email-composer'

interface EmailDetailProps {
  email: Email
}

export function EmailDetail({ email }: EmailDetailProps) {
  const router = useRouter()
  const [isStarred, setIsStarred] = useState(email.isStarred)
  const [isStarring, setIsStarring] = useState(false)
  const [isReplying, setIsReplying] = useState(false)
  const [isForwarding, setIsForwarding] = useState(false)

  const handleStarClick = async () => {
    if (isStarring) return
    setIsStarring(true)
    const result = await toggleStarEmail(email.id)
    if (result.success) {
      setIsStarred(result.isStarred!)
    }
    setIsStarring(false)
  }

  const handleTrash = async () => {
    const result = await moveToTrash(email.id)
    if (result.success) {
      router.push('/inbox')
    }
  }

  const handleArchive = async () => {
    const result = await archiveEmail(email.id)
    if (result.success) {
      router.push('/inbox')
    }
  }

  const toRecipients = email.recipients.filter((r) => r.type === 'TO')
  const ccRecipients = email.recipients.filter((r) => r.type === 'CC')

  return (
    <>
      <div className="flex flex-col h-full bg-white">
        {/* Header Actions */}
        <div className="h-12 border-b border-gray-200 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="h-8 w-8"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleArchive}
              className="h-8 w-8"
            >
              <Archive className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleTrash}
              className="h-8 w-8"
            >
              <Trash2 className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleStarClick}
              disabled={isStarring}
              className="h-8 w-8"
            >
              <Star
                className={cn(
                  'w-4 h-4',
                  isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
                )}
              />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Mark as unread</DropdownMenuItem>
                <DropdownMenuItem>Add to label</DropdownMenuItem>
                <DropdownMenuItem>Snooze</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Email Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Subject */}
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            {email.subject}
          </h1>

          {/* Sender Info */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={email.sender.image || ''} />
                <AvatarFallback>
                  {getInitials(email.sender.name || email.sender.email)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">
                    {email.sender.name || email.sender.email}
                  </span>
                  <span className="text-sm text-gray-500">
                    &lt;{email.sender.email}&gt;
                  </span>
                </div>

                <div className="text-sm text-gray-600 mt-1">
                  <div className="flex items-center gap-2">
                    <span>to</span>
                    <span>
                      {toRecipients.map((r) => r.user.email).join(', ')}
                    </span>
                  </div>
                  {ccRecipients.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span>cc</span>
                      <span>
                        {ccRecipients.map((r) => r.user.email).join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              {formatDate(email.sentAt || email.createdAt)}
            </div>
          </div>

          {/* Attachments */}
          {email.attachments.length > 0 && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Paperclip className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {email.attachments.length} Attachment
                  {email.attachments.length > 1 ? 's' : ''}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {email.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center gap-2 p-2 bg-white rounded border border-gray-200 hover:bg-gray-50 cursor-pointer"
                  >
                    <Paperclip className="w-4 h-4 text-gray-400" />
                    <span className="text-sm truncate flex-1">
                      {attachment.filename}
                    </span>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Email Body */}
          <div
            className="prose prose-sm max-w-none text-gray-700"
            dangerouslySetInnerHTML={{
              __html: email.bodyHtml || email.body.replace(/\n/g, '<br/>'),
            }}
          />

          {/* Read Receipts */}
          {email.readReceipts.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-sm font-medium text-blue-900 mb-2">
                Read by:
              </h3>
              <div className="space-y-1">
                {email.readReceipts.map((receipt) => (
                  <div key={receipt.id} className="text-sm text-blue-700">
                    {receipt.user.email} - {formatDate(receipt.readAt)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}

          <div className="flex items-center gap-2 mt-8 pt-6 border-t border-gray-200">
        <Button 
          className="gap-2"
          onClick={() => setIsReplying(true)}
        >
          <Reply className="w-4 h-4" />
          Reply
        </Button>
        <Button variant="outline" className="gap-2">
          <ReplyAll className="w-4 h-4" />
          Reply all
        </Button>
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={() => setIsForwarding(true)}
        >
          <Forward className="w-4 h-4" />
          Forward
        </Button>
      </div>
    </div>
  </div>

  {/* Reply Composer */}
  {isReplying && (
    <EmailComposer
      onClose={() => setIsReplying(false)}
      replyTo={{
        emailId: email.id,
        to: email.sender.email,
        subject: email.subject,
      }}
    />
  )}

  {/* Forward Composer */}
  {isForwarding && (
    <EmailComposer
      onClose={() => setIsForwarding(false)}
      forwardFrom={{
        emailId: email.id,
        subject: email.subject,
        body: email.bodyHtml || email.body,
      }}
    />
  )}
</>
  )
}