'use client'

import { useState } from 'react'
import { X, Minimize2, Maximize2, Paperclip, Send, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RichTextEditor } from '@/components/editor/rich-text-editor'
import { sendEmail } from '@/actions/email-actions'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface EmailComposerProps {
  onClose: () => void
  replyTo?: {
    emailId: string
    to: string
    subject: string
  }
  forwardFrom?: {
    emailId: string
    subject: string
    body: string
  }
}

export function EmailComposer({ onClose, replyTo, forwardFrom }: EmailComposerProps) {
  const router = useRouter()
  const [isMinimized, setIsMinimized] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [showCc, setShowCc] = useState(false)
  const [showBcc, setShowBcc] = useState(false)

  const [formData, setFormData] = useState({
    to: replyTo?.to || '',
    cc: '',
    bcc: '',
    subject: replyTo?.subject?.startsWith('Re:') 
      ? replyTo.subject 
      : replyTo?.subject 
        ? `Re: ${replyTo.subject}` 
        : forwardFrom?.subject?.startsWith('Fwd:')
          ? forwardFrom.subject
          : forwardFrom?.subject
            ? `Fwd: ${forwardFrom.subject}`
            : '',
    body: forwardFrom?.body || '',
    bodyHtml: forwardFrom?.body || '',
  })

  const handleSubmit = async (isDraft = false) => {
    if (!formData.to || !formData.subject) {
      alert('Please fill in recipient and subject')
      return
    }

    setIsSending(true)

    const result = await sendEmail({
      to: formData.to.split(',').map((e) => e.trim()),
      cc: formData.cc ? formData.cc.split(',').map((e) => e.trim()) : [],
      bcc: formData.bcc ? formData.bcc.split(',').map((e) => e.trim()) : [],
      subject: formData.subject,
      body: formData.body,
      bodyHtml: formData.bodyHtml,
      isDraft,
    })

    setIsSending(false)

    if (result.success) {
      onClose()
      router.refresh()
    } else {
      alert(result.message)
    }
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-0 right-4 w-80 bg-white border border-gray-300 rounded-t-lg shadow-lg z-50">
        <div className="flex items-center justify-between p-3 bg-gray-100 rounded-t-lg cursor-pointer">
          <span className="font-medium text-sm truncate">
            {formData.subject || 'New Message'}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsMinimized(false)}
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-0 right-4 w-[600px] bg-white border border-gray-300 rounded-t-lg shadow-2xl z-50 flex flex-col max-h-[80vh]">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gray-100 rounded-t-lg border-b border-gray-300">
        <span className="font-medium text-sm">
          {replyTo ? 'Reply' : forwardFrom ? 'Forward' : 'New Message'}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setIsMinimized(true)}
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* To Field */}
        <div className="flex items-center gap-2">
          <Label className="w-12 text-gray-600">To</Label>
          <Input
            type="text"
            placeholder="Recipients"
            value={formData.to}
            onChange={(e) => setFormData({ ...formData, to: e.target.value })}
            className="flex-1 border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 px-0"
          />
          <div className="flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 text-xs"
              onClick={() => setShowCc(!showCc)}
            >
              Cc
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 text-xs"
              onClick={() => setShowBcc(!showBcc)}
            >
              Bcc
            </Button>
          </div>
        </div>

        {/* Cc Field */}
        {showCc && (
          <div className="flex items-center gap-2">
            <Label className="w-12 text-gray-600">Cc</Label>
            <Input
              type="text"
              placeholder="Carbon copy"
              value={formData.cc}
              onChange={(e) => setFormData({ ...formData, cc: e.target.value })}
              className="flex-1 border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 px-0"
            />
          </div>
        )}

        {/* Bcc Field */}
        {showBcc && (
          <div className="flex items-center gap-2">
            <Label className="w-12 text-gray-600">Bcc</Label>
            <Input
              type="text"
              placeholder="Blind carbon copy"
              value={formData.bcc}
              onChange={(e) => setFormData({ ...formData, bcc: e.target.value })}
              className="flex-1 border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 px-0"
            />
          </div>
        )}

        {/* Subject Field */}
        <div className="flex items-center gap-2">
          <Label className="w-12 text-gray-600">Subject</Label>
          <Input
            type="text"
            placeholder="Subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="flex-1 border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 px-0"
          />
        </div>

        {/* Body */}
        <RichTextEditor
          value={formData.bodyHtml}
          onChange={(value) => {
            setFormData({ 
              ...formData, 
              bodyHtml: value,
              body: value.replace(/<[^>]*>/g, '') // Strip HTML for plain text
            })
          }}
          placeholder="Compose your message..."
          className="mt-4"
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-3 border-t border-gray-300">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => handleSubmit(false)}
            disabled={isSending}
            className="gap-2"
          >
            <Send className="w-4 h-4" />
            {isSending ? 'Sending...' : 'Send'}
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSubmit(true)}
            disabled={isSending}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </Button>
        </div>

        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Paperclip className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}