'use client'

import { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface SidebarItemProps {
  icon: LucideIcon
  label: string
  href: string
  count?: number
  isActive?: boolean
}

export function SidebarItem({ 
  icon: Icon, 
  label, 
  href, 
  count,
  isActive: providedIsActive 
}: SidebarItemProps) {
  const pathname = usePathname()
  const isActive = providedIsActive ?? pathname === href

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center justify-between px-4 py-2 rounded-r-full transition-all group h-10 my-0.5',
        isActive 
          ? 'bg-[#d3e3fd] text-[#001d35] font-medium' 
          : 'text-[#202124] hover:bg-[#f1f3f4]'
      )}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <Icon className={cn(
          'w-5 h-5 flex-shrink-0',
          isActive ? 'text-[#001d35]' : 'text-[#5f6368]'
        )} />
        <span className="text-[14px] truncate">
          {label}
        </span>
      </div>
      {count !== undefined && count > 0 && (
        <span className={cn(
          'text-[12px] ml-2 tabular-nums flex-shrink-0',
          isActive ? 'text-[#001d35] font-semibold' : 'text-[#5f6368]'
        )}>
          {count > 999 ? '999+' : count}
        </span>
      )}
    </Link>
  )
}