'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Settings, 
  HelpCircle, 
  Menu,
  SlidersHorizontal,
  X
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { signOut, useSession } from 'next-auth/react'
import { getInitials } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '')
  }, [searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleClear = () => {
    setSearchQuery('')
    router.push('/inbox')
  }

  return (
    <header className="h-14 md:h-16 bg-white border-b border-[#e8eaed] flex items-center px-2 md:px-4 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-2 md:gap-4 flex-1 max-w-[1920px] mx-auto w-full">
        {/* Hamburger Menu (Mobile) */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden h-10 w-10 rounded-full hover:bg-gray-100 flex-shrink-0"
          onClick={onMenuClick}
        >
          <Menu className="w-5 h-5 text-[#5f6368]" />
        </Button>

        {/* Search Bar */}
        <div className="flex-1 max-w-[720px]">
          <form onSubmit={handleSearch} className="relative">
            <div className={`flex items-center bg-[#f1f3f4] rounded-lg transition-all ${
              isSearchFocused ? 'shadow-md bg-white' : ''
            }`}>
              <button 
                type="submit"
                className="pl-3 md:pl-4 pr-2 h-10 md:h-12 flex items-center flex-shrink-0"
              >
                <Search className="w-5 h-5 text-[#5f6368]" />
              </button>
              <Input
                type="text"
                placeholder="Search mail"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-[13px] md:text-[14px] h-10 md:h-12 px-2"
              />
              <div className="flex items-center pr-2 gap-1 flex-shrink-0">
                {searchQuery && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-gray-200"
                    onClick={handleClear}
                  >
                    <X className="w-4 h-4 text-[#5f6368]" />
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-gray-200 hidden sm:flex"
                >
                  <SlidersHorizontal className="w-4 h-4 text-[#5f6368]" />
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 rounded-full hover:bg-gray-100 hidden md:flex"
          >
            <HelpCircle className="w-5 h-5 text-[#5f6368]" />
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 rounded-full hover:bg-gray-100"
          >
            <Settings className="w-5 h-5 text-[#5f6368]" />
          </Button>

          {/* Google Apps Menu */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 rounded-full hover:bg-gray-100 hidden sm:flex"
          >
            <svg className="w-5 h-5 text-[#5f6368]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-6 4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 w-10 rounded-full p-0 hover:bg-transparent">
                <Avatar className="h-8 w-8 cursor-pointer ring-0 hover:ring-2 hover:ring-gray-300 transition-all">
                  <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || ''} />
                  <AvatarFallback className="bg-[#1967d2] text-white text-xs">
                    {getInitials(session?.user?.name || session?.user?.email || 'User')}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[300px] md:w-[360px] p-0 mr-4" align="end">
              <div className="p-4 text-center border-b border-gray-200">
                <Avatar className="h-16 md:h-20 w-16 md:w-20 mx-auto mb-3">
                  <AvatarImage src={session?.user?.image || ''} />
                  <AvatarFallback className="bg-[#1967d2] text-white text-xl md:text-2xl">
                    {getInitials(session?.user?.name || session?.user?.email || 'User')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm md:text-base font-medium text-[#202124] truncate px-2">
                  {session?.user?.name}
                </div>
                <div className="text-xs md:text-sm text-[#5f6368] mt-1 truncate px-2">
                  {session?.user?.email}
                </div>
                <Button 
                  variant="outline" 
                  className="mt-4 rounded-full border-[#dadce0] hover:bg-gray-50 text-xs md:text-sm"
                >
                  Manage your Google Account
                </Button>
              </div>
              <div className="py-2">
                <DropdownMenuItem className="px-4 py-3 cursor-pointer text-sm">
                  Add another account
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="px-4 py-3 cursor-pointer text-sm"
                >
                  Sign out
                </DropdownMenuItem>
              </div>
              <div className="border-t border-gray-200 p-3 text-center">
                <div className="flex justify-center gap-4 text-xs text-[#5f6368]">
                  <a href="#" className="hover:underline">Privacy Policy</a>
                  <span>•</span>
                  <a href="#" className="hover:underline">Terms of Service</a>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}