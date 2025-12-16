'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label as UILabel } from '@/components/ui/label'
import { createLabel, updateLabel } from '@/actions/label-actions'
import { Label } from '@/types/label'

interface LabelDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  label?: Label
  onSuccess: () => void
}

const LABEL_COLORS = [
  '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16',
  '#22C55E', '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9',
  '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF',
  '#EC4899', '#F43F5E', '#6B7280'
]

export function LabelDialog({ open, onOpenChange, label, onSuccess }: LabelDialogProps) {
  const [name, setName] = useState(label?.name || '')
  const [color, setColor] = useState(label?.color || LABEL_COLORS[0])
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const result = label
      ? await updateLabel(label.id, { name, color })
      : await createLabel({ name, color })

    setIsLoading(false)

    if (result.success) {
      onSuccess()
      onOpenChange(false)
      setName('')
      setColor(LABEL_COLORS[0])
    } else {
      alert(result.message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-[20px] text-[#202124]">
            {label ? 'Edit label' : 'New label'}
          </DialogTitle>
          <DialogDescription className="text-[13px] text-[#5f6368]">
            {label
              ? 'Update the label name and color.'
              : 'Create a new label to organize your emails.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <UILabel htmlFor="name" className="text-[13px] text-[#202124]">
                Please enter a new label name:
              </UILabel>
              <Input
                id="name"
                placeholder="Enter label name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-[#dadce0] focus-visible:ring-[#1967d2]"
              />
            </div>

            <div className="space-y-2">
              <UILabel className="text-[13px] text-[#202124]">Label color</UILabel>
              <div className="grid grid-cols-9 gap-2">
                {LABEL_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className="w-8 h-8 rounded-full transition-transform hover:scale-110 border-2"
                    style={{
                      backgroundColor: c,
                      borderColor: color === c ? '#1967d2' : 'transparent',
                    }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-[#1967d2] hover:bg-[#e8f0fe]"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-[#1967d2] hover:bg-[#1557b0] text-white"
            >
              {isLoading ? 'Saving...' : label ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}