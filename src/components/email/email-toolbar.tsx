'use client'

import {
  RefreshCw,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Archive,
  Trash2,
  Mail,
  MailOpen,
  Tag,
  Clock,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Checkbox } from '@/components/ui/checkbox'

interface EmailToolbarProps {
  onRefresh?: () => void
  selectedCount?: number
  totalCount?: number
}

export function EmailToolbar({ 
  onRefresh, 
  selectedCount = 0,
  totalCount = 0 
}: EmailToolbarProps) {
  return (
    <div className="h-12 bg-white flex items-center justify-between px-2 border-b border-[#f0f0f0]">
      {/* Left Section */}
      <div className="flex items-center gap-1">
        {/* Select All Checkbox */}
        <div className="flex items-center px-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 px-2 hover:bg-[#f1f3f4] rounded">
                <Checkbox className="h-5 w-5 rounded border-[#5f6368]" />
                <ChevronDown className="w-4 h-4 ml-1 text-[#5f6368]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>All</DropdownMenuItem>
              <DropdownMenuItem>None</DropdownMenuItem>
              <DropdownMenuItem>Read</DropdownMenuItem>
              <DropdownMenuItem>Unread</DropdownMenuItem>
              <DropdownMenuItem>Starred</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onRefresh}
          className="h-9 w-9 hover:bg-[#f1f3f4] rounded-full"
        >
          <RefreshCw className="w-4 h-4 text-[#5f6368]" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 hover:bg-[#f1f3f4] rounded-full"
        >
          <MoreVertical className="w-4 h-4 text-[#5f6368]" />
        </Button>

        {selectedCount > 0 && (
          <>
            <div className="w-px h-6 bg-[#e8eaed] mx-2" />
            
            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-[#f1f3f4] rounded-full">
              <Archive className="w-4 h-4 text-[#5f6368]" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-[#f1f3f4] rounded-full">
              <Trash2 className="w-4 h-4 text-[#5f6368]" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-[#f1f3f4] rounded-full">
              <MailOpen className="w-4 h-4 text-[#5f6368]" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-[#f1f3f4] rounded-full">
              <Clock className="w-4 h-4 text-[#5f6368]" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-[#f1f3f4] rounded-full">
              <Tag className="w-4 h-4 text-[#5f6368]" />
            </Button>

            <span className="text-[13px] text-[#5f6368] ml-2">
              {selectedCount} selected
            </span>
          </>
        )}
      </div>

      {/* Right Section - Pagination */}
      <div className="flex items-center gap-1">
        <span className="text-[12px] text-[#5f6368] mr-2">
          1-{Math.min(50, totalCount)} of {totalCount.toLocaleString()}
        </span>
        <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-[#f1f3f4] rounded-full" disabled>
          <ChevronLeft className="w-4 h-4 text-[#5f6368]" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-[#f1f3f4] rounded-full">
          <ChevronRight className="w-4 h-4 text-[#5f6368]" />
        </Button>
      </div>
    </div>
  )
}
