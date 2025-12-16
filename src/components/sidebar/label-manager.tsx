'use client'

import { useState, useEffect } from 'react'
import { Tag, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SidebarItem } from './sidebar-item'
import { getUserLabels, deleteLabel } from '@/actions/label-actions'
import { Label } from '@/types/label'
import { LabelDialog } from '../labels/label-dialog'

export function LabelManager() {
  const [labels, setLabels] = useState<(Label & { count: number })[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  useEffect(() => {
    loadLabels()
  }, [])

  const loadLabels = async () => {
    const result = await getUserLabels()
    if (result.success) {
      setLabels(result.labels)
    }
  }

  return (
    <>
      <div className="px-4 py-2 flex items-center justify-between">
        <span className="text-[13px] text-[#5f6368] font-medium">Labels</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-[#f1f3f4] rounded-full"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus className="w-4 h-4 text-[#5f6368]" />
        </Button>
      </div>

      <div className="space-y-0.5">
        {labels.map((label) => (
          <SidebarItem
            key={label.id}
            icon={Tag}
            label={label.name}
            href={`/label/${label.id}`}
            count={label.count}
          />
        ))}
      </div>

      <LabelDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={loadLabels}
      />
    </>
  )
}