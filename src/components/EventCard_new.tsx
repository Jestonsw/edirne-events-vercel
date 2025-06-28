'use client'

import { Calendar, MapPin, Heart, ExternalLink, Star } from 'lucide-react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { useLanguage } from '@/contexts/LanguageContext'
import { memo, useState, useCallback } from 'react'
import Image from 'next/image'

interface Event {
  id: number
  title: string
  description: string
  startDate: string
  endDate?: string
  startTime: string
  endTime?: string
  location: string
  address?: string
  organizerName?: string
  organizerContact?: string
  categoryId: number
  capacity?: number
  imageUrl?: string
  websiteUrl?: string
  ticketUrl?: string
  tags?: string | string[]
  participantType: string
  rating?: number
  reviewCount?: number
  isActive: boolean
  isFeatured: boolean
  createdAt: string
  updatedAt: string
  categories?: Array<{
    categoryId: number
    categoryName: string
    categoryDisplayName: string
    categoryColor: string
    categoryIcon: string
  }>
}

interface Category {
  id: number
  name: string
  displayName: string
  color: string
  icon: string
}

interface EventCardProps {
  event: Event
  onEventClick: () => void
  onFavoriteToggle: (eventId: number) => void
  isFavorite?: boolean
  categories: Category[]
}

const EventCard = memo(({ event, onEventClick, onFavoriteToggle, isFavorite, categories }: EventCardProps) => {
  const { language } = useLanguage()
  const [imageError, setImageError] = useState(false)
  
  // Simple cross-domain image source resolver
  const getImageSrc = useCallback((imageUrl: string) => {
    if (imageUrl.startsWith('/uploads/')) {
      return `https://edirne-events.replit.app${imageUrl}`
    }
    return imageUrl
  }, [])

  const handleImageError = useCallback(() => {
    setImageError(true)
  }, [])

  const handleImageLoad = useCallback(() => {
    setImageError(false)
  }, [])

  // Safe date parsing with fallbacks
  let startDate: Date
  let endDate: Date | null = null
  let formattedDate = ''
  
  try {
    startDate = new Date(event.startDate)
    if (isNaN(startDate.getTime())) {
      startDate = new Date()
    }
    
    if (event.endDate) {
      endDate = new Date(event.endDate)
      if (isNaN(endDate.getTime())) {
        endDate = null
      }
    }
    
    // Format date range safely
    if (endDate && startDate.getTime() !== endDate.getTime()) {
      if (startDate.getMonth() === endDate.getMonth()) {
        formattedDate = `${format(startDate, 'd', { locale: tr })} - ${format(endDate, 'd MMM', { locale: tr })}`
      } else {
        formattedDate = `${format(startDate, 'd MMM', { locale: tr })} - ${format(endDate, 'd MMM', { locale: tr })}`
      }
    } else {
      formattedDate = format(startDate, 'd MMM', { locale: tr })
    }
  } catch (error) {
    formattedDate = 'Tarih yok'
  }

  const handleClick = useCallback(() => {
    onEventClick()
  }, [onEventClick])

  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onFavoriteToggle(event.id)
  }, [onFavoriteToggle, event.id])

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] relative p-3 min-h-[112px] border border-gray-100"
      onClick={handleClick}
    >
      <div className="flex space-x-3">
        {/* Image Section */}
        <div className="w-28 h-28 sm:w-32 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 relative">
          {event.imageUrl && !imageError ? (
            <Image
              src={getImageSrc(event.imageUrl)}
              alt={event.title}
              width={128}
              height={96}
              className="w-full h-full object-cover"
              onError={handleImageError}
              onLoad={handleImageLoad}
              loading="lazy"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-blue-100 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          )}
          
          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors duration-200 shadow-sm"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'
              } transition-colors duration-200`}
            />
          </button>
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col justify-between min-h-[112px]">
          {/* Title */}
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight mb-1">
            {event.title}
          </h3>

          {/* Date and Rating */}
          <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{formattedDate}</span>
            </div>
            
            {event.rating && event.reviewCount && (
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span>{event.rating.toFixed(1)}</span>
                <span className="text-gray-400">({event.reviewCount})</span>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center space-x-1 text-xs text-gray-600">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="line-clamp-1">{event.location}</span>
          </div>

          {/* External Link */}
          {(event.websiteUrl || event.ticketUrl) && (
            <div className="flex items-center space-x-1 text-xs text-blue-600 mt-1">
              <ExternalLink className="w-3 h-3" />
              <span>Detaylar</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

EventCard.displayName = 'EventCard'

export default EventCard