import { useState, useRef, TouchEvent, MouseEvent } from 'react'
import { ChevronLeft, ChevronRight, Check, X, Layers } from 'lucide-react'
import type { VintedItem } from '../types/vinted'

interface PhotoCarouselProps {
  items: VintedItem[]
  selectedItems: Set<string>
  onToggle: (itemId: string) => void
  maxSelection: number
  onViewChange?: (view: 'carousel' | 'grid') => void
}

export function PhotoCarousel({
  items,
  selectedItems,
  onToggle,
  maxSelection,
}: PhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)

  const minSwipeDistance = 50

  const currentItem = items[currentIndex]
  const isCurrentSelected = currentItem ? selectedItems.has(currentItem.id) : false
  const canSelect = selectedItems.size < maxSelection || isCurrentSelected

  const handleTouchStart = (e: TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
    setIsDragging(true)
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!touchStart) return
    const currentTouch = e.targetTouches[0].clientX
    setTouchEnd(currentTouch)
    const diff = currentTouch - touchStart
    setDragOffset(diff)

    if (diff > 30) {
      setSwipeDirection('right')
    } else if (diff < -30) {
      setSwipeDirection('left')
    } else {
      setSwipeDirection(null)
    }
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsDragging(false)
      setDragOffset(0)
      setSwipeDirection(null)
      return
    }

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isRightSwipe) {
      // Swipe right = select
      if (canSelect && currentItem) {
        onToggle(currentItem.id)
      }
      goToNext()
    } else if (isLeftSwipe) {
      // Swipe left = skip
      goToNext()
    }

    setIsDragging(false)
    setDragOffset(0)
    setSwipeDirection(null)
    setTouchStart(null)
    setTouchEnd(null)
  }

  // Mouse support for desktop
  const handleMouseDown = (e: MouseEvent) => {
    setTouchEnd(null)
    setTouchStart(e.clientX)
    setIsDragging(true)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || touchStart === null) return
    const currentX = e.clientX
    setTouchEnd(currentX)
    const diff = currentX - touchStart
    setDragOffset(diff)

    if (diff > 30) {
      setSwipeDirection('right')
    } else if (diff < -30) {
      setSwipeDirection('left')
    } else {
      setSwipeDirection(null)
    }
  }

  const handleMouseUp = () => {
    handleTouchEnd()
  }

  const handleMouseLeave = () => {
    if (isDragging) {
      handleTouchEnd()
    }
  }

  const goToNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleSelect = () => {
    if (currentItem && canSelect) {
      onToggle(currentItem.id)
    }
  }

  const handleSkip = () => {
    goToNext()
  }

  if (!currentItem) {
    return (
      <div className="text-center py-10">
        <p className="font-display font-bold text-black">Tous les articles ont ete vus !</p>
        <button
          onClick={() => setCurrentIndex(0)}
          className="mt-4 px-4 py-2 border-2 border-black font-display font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          style={{ backgroundColor: '#9ED8DB' }}
        >
          RECOMMENCER
        </button>
      </div>
    )
  }

  return (
    <div className="relative select-none">
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-display font-bold text-xs text-black/60">
            {currentIndex + 1} / {items.length}
          </span>
          <span className="font-display font-bold text-xs" style={{ color: '#1D3354' }}>
            {selectedItems.size} / {maxSelection} selectionnes
          </span>
        </div>
        <div className="h-2 border-2 border-black" style={{ backgroundColor: '#FFFFFF' }}>
          <div
            className="h-full transition-all duration-300"
            style={{
              backgroundColor: '#9ED8DB',
              width: `${((currentIndex + 1) / items.length) * 100}%`
            }}
          />
        </div>
      </div>

      {/* Swipe Instructions */}
      <div className="flex items-center justify-center gap-6 mb-4">
        <div className="flex items-center gap-1.5 text-black/50">
          <ChevronLeft className="w-4 h-4" />
          <span className="text-xs font-body">Passer</span>
        </div>
        <div className="flex items-center gap-1.5" style={{ color: '#1D3354' }}>
          <span className="text-xs font-body">Selectionner</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      {/* Card Container */}
      <div className="relative max-w-sm mx-auto">
        {/* Next Card Preview */}
        {currentIndex < items.length - 1 && (
          <div
            className="absolute inset-x-2 top-2 bottom-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] overflow-hidden opacity-40 -z-10"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            <div className="aspect-[3/4]">
              <img
                src={items[currentIndex + 1].imageUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Current Card */}
        <div
          ref={cardRef}
          className={`border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden cursor-grab active:cursor-grabbing transition-shadow ${
            isCurrentSelected ? 'ring-4 ring-offset-2 ring-[#1D3354]' : ''
          }`}
          style={{
            backgroundColor: '#FFFFFF',
            transform: isDragging ? `translateX(${dragOffset}px) rotate(${dragOffset * 0.05}deg)` : 'none',
            transition: isDragging ? 'none' : 'transform 0.3s ease-out',
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {/* Image */}
          <div className="aspect-[3/4] relative overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
            <img
              src={currentItem.imageUrl}
              alt={currentItem.title}
              className="w-full h-full object-cover"
              draggable={false}
            />

            {/* Swipe Overlay */}
            {swipeDirection && (
              <div
                className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                  swipeDirection === 'right' ? 'bg-green-500/30' : 'bg-red-500/30'
                }`}
              >
                <div
                  className="w-20 h-20 border-4 border-black flex items-center justify-center"
                  style={{
                    backgroundColor: swipeDirection === 'right' ? '#9ED8DB' : '#D64045',
                    transform: `rotate(${swipeDirection === 'right' ? -15 : 15}deg)`
                  }}
                >
                  {swipeDirection === 'right' ? (
                    <Check className="w-10 h-10 text-black" />
                  ) : (
                    <X className="w-10 h-10 text-white" />
                  )}
                </div>
              </div>
            )}

            {/* Selection Badge */}
            {isCurrentSelected && (
              <div
                className="absolute top-3 right-3 w-10 h-10 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                style={{ backgroundColor: '#9ED8DB' }}
              >
                <Check className="w-6 h-6 text-black" />
              </div>
            )}

            {/* Price Badge */}
            <div
              className="absolute bottom-3 left-3 border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              style={{ backgroundColor: '#1D3354' }}
            >
              <span className="font-display font-bold text-white text-lg">{currentItem.price}€</span>
            </div>
          </div>

          {/* Info */}
          <div className="p-4 border-t-3 border-black">
            <h3 className="font-display font-bold text-black text-base mb-1 truncate">
              {currentItem.title}
            </h3>
            {currentItem.brand && (
              <p className="font-body text-sm truncate" style={{ color: '#1D3354' }}>
                {currentItem.brand}
              </p>
            )}
            {currentItem.size && (
              <span
                className="inline-block mt-2 px-2 py-0.5 border-2 border-black text-xs font-bold"
                style={{ backgroundColor: '#FFFFFF' }}
              >
                Taille: {currentItem.size}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4 mt-6">
        {/* Previous */}
        <button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className="w-12 h-12 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-30 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Skip */}
        <button
          onClick={handleSkip}
          className="w-14 h-14 border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all"
          style={{ backgroundColor: '#D64045' }}
        >
          <X className="w-8 h-8 text-white" />
        </button>

        {/* Select */}
        <button
          onClick={handleSelect}
          disabled={!canSelect}
          className="w-14 h-14 border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-30"
          style={{ backgroundColor: '#9ED8DB' }}
        >
          <Check className="w-8 h-8 text-black" />
        </button>

        {/* Next */}
        <button
          onClick={goToNext}
          disabled={currentIndex === items.length - 1}
          className="w-12 h-12 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-30 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Selection Count Chip */}
      {selectedItems.size > 0 && (
        <div className="mt-4 flex justify-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            style={{ backgroundColor: '#9ED8DB' }}
          >
            <Layers className="w-4 h-4" />
            <span className="font-display font-bold text-sm">
              {selectedItems.size} article{selectedItems.size > 1 ? 's' : ''} selectionne{selectedItems.size > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
