'use client'

import { Calendar, Search, X, User } from 'lucide-react'
import { useState } from 'react'

import { useLanguage } from '@/contexts/LanguageContext'

interface HeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  activeTab: 'events' | 'venues'
  onTabChange: (tab: 'events' | 'venues') => void
  onProfileClick?: () => void
  user?: {
    id: number
    firstName: string
    lastName: string
    name: string
    profileImage?: string
    profileImageUrl?: string
  }
}

export default function Header({ searchQuery, onSearchChange, activeTab, onTabChange, onProfileClick, user }: HeaderProps) {
  const { t } = useLanguage()
  const [isSearchActive, setIsSearchActive] = useState(false)

  const handleSearchClick = () => {
    setIsSearchActive(true)
  }

  const handleCloseSearch = () => {
    setIsSearchActive(false)
    onSearchChange('')
  }

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img 
              src="/edirne-skyline-logo.png" 
              alt="Edirne Etkinlik Rehberi" 
              className="h-12 w-auto"
            />
            <div className="flex items-center gap-6">
              <nav className="flex gap-4">
                <button 
                  onClick={() => onTabChange('events')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'events' 
                      ? 'bg-edirne-500 text-white' 
                      : 'text-gray-600 hover:text-edirne-500 hover:bg-gray-100'
                  }`}
                >
                  Etkinlikler
                </button>
                <button 
                  onClick={() => onTabChange('venues')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'venues' 
                      ? 'bg-edirne-500 text-white' 
                      : 'text-gray-600 hover:text-edirne-500 hover:bg-gray-100'
                  }`}
                >
                  Mekanlar
                </button>
              </nav>
            </div>
          </div>

          {/* Search Area and Profile */}
          <div className="flex items-center gap-3">
            {isSearchActive ? (
              <div className="flex items-center relative">
                <button
                  onClick={handleCloseSearch}
                  className="absolute left-2 z-10 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  placeholder={t('events.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 pr-3 py-2 w-64 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
            ) : (
              <button 
                onClick={handleSearchClick}
                className="text-gray-700 hover:text-edirne-500 transition-colors"
              >
                <Search className="w-6 h-6" />
              </button>
            )}



            {/* Profile Button */}
            <button 
              onClick={onProfileClick}
              className="flex items-center gap-2 p-2 text-gray-700 hover:text-edirne-500 hover:bg-gray-100 rounded-lg transition-colors"
              title={user ? `Profil - ${user.name}` : "Profil"}
            >
              {user ? (
                <>
                  {user.profileImageUrl ? (
                    <img 
                      src={user.profileImageUrl} 
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover shadow-lg border-2 border-white"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-edirne-500 to-edirne-600 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700 hidden sm:block max-w-[80px] truncate">
                    {user.name}
                  </span>
                </>
              ) : (
                <User className="w-6 h-6" />
              )}
            </button>

          </div>
        </div>
      </div>
    </header>
  )
}