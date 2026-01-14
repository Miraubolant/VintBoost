import { useState } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, TouchSensor } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Music, Layout, Type, GripVertical, X, Sparkles, Stamp, ChevronDown, ChevronUp, Crown } from 'lucide-react'
import type { VintedItem, VideoTemplate } from '../types/vinted'

interface VideoConfigPanelProps {
  selectedArticles: VintedItem[]
  onArticlesReorder: (articles: VintedItem[]) => void
  onRemoveArticle: (id: string) => void
  musicTrack: string
  onMusicChange: (track: string) => void
  template: VideoTemplate
  onTemplateChange: (template: VideoTemplate) => void
  customText: string
  onCustomTextChange: (text: string) => void
  hasWatermark: boolean
  onWatermarkChange: (hasWatermark: boolean) => void
  canRemoveWatermark: boolean
  onGenerate: () => void
  loading: boolean
  isMobile?: boolean
}

const musicTracks = [
  { id: '', name: 'Sans musique' },
  { id: 'upbeat', name: 'Upbeat Energy' },
  { id: 'chill', name: 'Chill Vibes' },
  { id: 'fashion', name: 'Fashion Forward' },
  { id: 'trendy', name: 'Trendy Beat' },
  { id: 'summer', name: 'Summer Days' },
  { id: 'elegant', name: 'Elegant Style' },
]

const templates: { id: VideoTemplate; name: string; color: string }[] = [
  { id: 'classic', name: 'Classique', color: '#1D3354' },
  { id: 'modern', name: 'Moderne', color: '#9ED8DB' },
  { id: 'premium', name: 'Premium', color: '#D64045' },
]

function SortableArticle({ item, index, onRemove }: { item: VintedItem; index: number; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 border-2 border-black p-2"
      {...attributes}
    >
      <button {...listeners} className="cursor-grab active:cursor-grabbing touch-none p-0.5">
        <GripVertical className="w-4 h-4 text-black/40" />
      </button>
      <div className="w-10 h-10 border-2 border-black overflow-hidden flex-shrink-0">
        <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold truncate">{item.title}</p>
        <p className="text-[10px] text-black/50">{item.price}€</p>
      </div>
      <span
        className="w-6 h-6 text-[10px] flex items-center justify-center font-bold border-2 border-black"
        style={{ backgroundColor: '#9ED8DB' }}
      >
        {index + 1}
      </span>
      <button
        onClick={onRemove}
        className="w-6 h-6 flex items-center justify-center border-2 border-black active:bg-red-100"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  )
}

export function VideoConfigPanel({
  selectedArticles,
  onArticlesReorder,
  onRemoveArticle,
  musicTrack,
  onMusicChange,
  template,
  onTemplateChange,
  customText,
  onCustomTextChange,
  hasWatermark,
  onWatermarkChange,
  canRemoveWatermark,
  onGenerate,
  loading,
}: VideoConfigPanelProps) {
  const [showArticles, setShowArticles] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = selectedArticles.findIndex((item) => item.id === active.id)
      const newIndex = selectedArticles.findIndex((item) => item.id === over.id)
      onArticlesReorder(arrayMove(selectedArticles, oldIndex, newIndex))
    }
  }

  return (
    <div className="space-y-4">
      {/* Articles Order - Collapsible */}
      <div className="border-2 border-black overflow-hidden">
        <button
          onClick={() => setShowArticles(!showArticles)}
          className="w-full flex items-center justify-between px-3 py-2 font-display font-bold text-xs"
          style={{ backgroundColor: showArticles ? '#9ED8DB' : '#FFFFFF' }}
        >
          <span className="flex items-center gap-2">
            <GripVertical className="w-4 h-4" />
            ORDRE ({selectedArticles.length} articles)
          </span>
          {showArticles ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {showArticles && (
          <div className="p-2 max-h-48 overflow-y-auto space-y-1.5" style={{ backgroundColor: '#FFFFFF' }}>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={selectedArticles.map((a) => a.id)} strategy={verticalListSortingStrategy}>
                {selectedArticles.map((item, index) => (
                  <SortableArticle
                    key={item.id}
                    item={item}
                    index={index}
                    onRemove={() => onRemoveArticle(item.id)}
                  />
                ))}
              </SortableContext>
            </DndContext>
            {selectedArticles.length === 0 && (
              <p className="text-xs text-black/50 text-center py-4">
                Aucun article
              </p>
            )}
          </div>
        )}
      </div>

      {/* Template - Horizontal compact */}
      <div>
        <label className="flex items-center gap-2 font-display font-bold text-xs text-black mb-2">
          <Layout className="w-4 h-4" />
          TEMPLATE
        </label>
        <div className="flex gap-2">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => onTemplateChange(t.id)}
              className={`
                flex-1 flex items-center justify-center gap-2 py-2 border-2 border-black
                ${template === t.id ? 'ring-2 ring-[#1D3354]' : ''}
              `}
              style={{ backgroundColor: '#FFFFFF' }}
            >
              <div
                className="w-4 h-4 border border-black"
                style={{ backgroundColor: t.color }}
              />
              <span className="font-bold text-xs">{t.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Music - Dropdown */}
      <div>
        <label className="flex items-center gap-2 font-display font-bold text-xs text-black mb-2">
          <Music className="w-4 h-4" />
          MUSIQUE
        </label>
        <div className="relative">
          <select
            value={musicTrack}
            onChange={(e) => onMusicChange(e.target.value)}
            className="w-full px-3 py-2 border-2 border-black font-body text-sm appearance-none cursor-pointer pr-10"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            {musicTracks.map((track) => (
              <option key={track.id} value={track.id}>
                {track.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
        </div>
      </div>

      {/* Custom Text - Compact */}
      <div>
        <label className="flex items-center gap-2 font-display font-bold text-xs text-black mb-2">
          <Type className="w-4 h-4" />
          ACCROCHE
        </label>
        <input
          type="text"
          value={customText}
          onChange={(e) => onCustomTextChange(e.target.value)}
          placeholder="SOLDES -50%, LIVRAISON OFFERTE..."
          maxLength={50}
          className="w-full px-3 py-2 border-2 border-black font-body text-sm placeholder:text-black/40"
          style={{ backgroundColor: '#FFFFFF' }}
        />
      </div>

      {/* Premium Options Row */}
      <div
        className="flex items-center justify-between p-3 border-2 border-black"
        style={{ backgroundColor: canRemoveWatermark ? '#FFFFFF' : '#F5F5F5' }}
      >
        <div className="flex items-center gap-2">
          <Stamp className="w-4 h-4" />
          <span className="font-bold text-xs">Watermark</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={hasWatermark}
              onChange={(e) => canRemoveWatermark && onWatermarkChange(e.target.checked)}
              disabled={!canRemoveWatermark}
              className="sr-only"
            />
            <div
              className={`
                w-8 h-5 border-2 border-black relative
                ${!canRemoveWatermark ? 'opacity-50' : ''}
              `}
              style={{ backgroundColor: hasWatermark ? '#1D3354' : '#FFFFFF' }}
            >
              <span
                className={`
                  absolute top-[1px] left-[1px] w-3 h-3 border border-black transition-transform
                  ${hasWatermark ? 'translate-x-3' : ''}
                `}
                style={{ backgroundColor: '#FFFFFF' }}
              />
            </div>
          </label>
        </div>

        {!canRemoveWatermark && (
          <a href="#pricing" className="flex items-center gap-1 text-[10px] font-bold" style={{ color: '#1D3354' }}>
            <Crown className="w-3 h-3" />
            PRO
          </a>
        )}
      </div>

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        disabled={loading || selectedArticles.length === 0}
        className="w-full px-6 py-4 border-3 border-black font-display font-bold text-base text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        style={{ backgroundColor: '#D64045' }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            GENERATION EN COURS...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            GENERER LA VIDEO
          </span>
        )}
      </button>

      {loading && (
        <p className="text-xs font-bold text-black/50 text-center">
          Environ 1-2 minutes
        </p>
      )}
    </div>
  )
}
