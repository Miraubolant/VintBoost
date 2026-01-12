import { useState } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, TouchSensor } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Music, Layout, Type, GripVertical, X, Play, Pause, Clock, Sparkles, Stamp, Lock } from 'lucide-react'
import type { VintedItem } from '../types/vinted'

interface VideoConfigPanelProps {
  selectedArticles: VintedItem[]
  onArticlesReorder: (articles: VintedItem[]) => void
  onRemoveArticle: (id: string) => void
  videoDuration: 15 | 30 | 45 | 60
  onDurationChange: (duration: 15 | 30 | 45 | 60) => void
  musicTrack: string
  onMusicChange: (track: string) => void
  template: string
  onTemplateChange: (template: string) => void
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
  { id: '', name: 'Aucune', icon: null },
  { id: 'upbeat', name: 'Upbeat', icon: '🎵' },
  { id: 'chill', name: 'Chill', icon: '🎶' },
  { id: 'fashion', name: 'Fashion', icon: '💃' },
  { id: 'trendy', name: 'Trendy', icon: '🔥' },
]

const templates = [
  { id: 'classic', name: 'Classique', color: '#1D3354' },
  { id: 'modern', name: 'Moderne', color: '#9ED8DB' },
  { id: 'bold', name: 'Bold', color: '#D64045' },
  { id: 'minimal', name: 'Minimal', color: '#F5F5F5' },
]

function SortableArticle({ item, index, onRemove, isMobile }: { item: VintedItem; index: number; onRemove: () => void; isMobile?: boolean }) {
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
      className={`flex items-center gap-2 border-2 border-black mb-2 ${isMobile ? 'p-3' : 'p-2'}`}
      {...attributes}
    >
      <button {...listeners} className="cursor-grab active:cursor-grabbing touch-none p-1">
        <GripVertical className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'} text-black/40`} />
      </button>
      <div className={`${isMobile ? 'w-12 h-12' : 'w-8 h-8'} border-2 border-black overflow-hidden flex-shrink-0`}>
        <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`${isMobile ? 'text-xs' : 'text-[10px]'} font-bold truncate`}>{item.title}</p>
        <p className={`${isMobile ? 'text-[11px]' : 'text-[9px]'} text-black/50`}>{item.price}€</p>
      </div>
      <span
        className={`${isMobile ? 'w-7 h-7 text-xs' : 'w-5 h-5 text-[10px]'} flex items-center justify-center font-bold border-2 border-black`}
        style={{ backgroundColor: '#9ED8DB' }}
      >
        {index + 1}
      </span>
      <button
        onClick={onRemove}
        className={`${isMobile ? 'w-8 h-8' : 'w-5 h-5'} flex items-center justify-center border-2 border-black active:bg-red-100`}
        style={{ backgroundColor: '#FFFFFF' }}
      >
        <X className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'}`} />
      </button>
    </div>
  )
}

export function VideoConfigPanel({
  selectedArticles,
  onArticlesReorder,
  onRemoveArticle,
  videoDuration,
  onDurationChange,
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
  isMobile = false,
}: VideoConfigPanelProps) {
  const [expandedSection, setExpandedSection] = useState<'articles' | 'music' | 'template' | 'text' | null>('articles')
  const [previewMusic, setPreviewMusic] = useState<string | null>(null)

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

  const toggleSection = (section: 'articles' | 'music' | 'template' | 'text') => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  return (
    <div className={`space-y-${isMobile ? '4' : '3'}`}>
      {/* Duration */}
      <div>
        <label className={`flex items-center gap-2 font-display font-bold ${isMobile ? 'text-sm' : 'text-xs'} text-black mb-3`}>
          <Clock className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'}`} />
          DURÉE VIDÉO
        </label>
        <div className="grid grid-cols-4 gap-2">
          {[15, 30, 45, 60].map((d) => (
            <button
              key={d}
              onClick={() => onDurationChange(d as 15 | 30 | 45 | 60)}
              className={`${isMobile ? 'py-3 text-sm' : 'py-2 text-xs'} font-display font-bold border-2 border-black transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]`}
              style={{ backgroundColor: videoDuration === d ? '#9ED8DB' : '#FFFFFF' }}
            >
              {d}s
            </button>
          ))}
        </div>
      </div>

      {/* Articles Order (Drag & Drop) */}
      <div className="border-2 border-black overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        <button
          onClick={() => toggleSection('articles')}
          className={`w-full flex items-center justify-between ${isMobile ? 'px-4 py-3' : 'px-3 py-2'} font-display font-bold ${isMobile ? 'text-sm' : 'text-xs'} border-b-2 border-black`}
          style={{ backgroundColor: expandedSection === 'articles' ? '#9ED8DB' : '#FFFFFF' }}
        >
          <span className="flex items-center gap-2">
            <GripVertical className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'}`} />
            ORDRE DES ARTICLES ({selectedArticles.length})
          </span>
          <span className={`${isMobile ? 'text-lg' : 'text-base'}`}>{expandedSection === 'articles' ? '−' : '+'}</span>
        </button>
        {expandedSection === 'articles' && (
          <div className={`${isMobile ? 'p-3 max-h-60' : 'p-2 max-h-48'} overflow-y-auto`} style={{ backgroundColor: '#FFFFFF' }}>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={selectedArticles.map((a) => a.id)} strategy={verticalListSortingStrategy}>
                {selectedArticles.map((item, index) => (
                  <SortableArticle
                    key={item.id}
                    item={item}
                    index={index}
                    onRemove={() => onRemoveArticle(item.id)}
                    isMobile={isMobile}
                  />
                ))}
              </SortableContext>
            </DndContext>
            {selectedArticles.length === 0 && (
              <p className={`${isMobile ? 'text-sm py-6' : 'text-xs py-4'} text-black/50 text-center`}>
                Aucun article sélectionné
              </p>
            )}
          </div>
        )}
      </div>

      {/* Music Selection */}
      <div className="border-2 border-black overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        <button
          onClick={() => toggleSection('music')}
          className={`w-full flex items-center justify-between ${isMobile ? 'px-4 py-3' : 'px-3 py-2'} font-display font-bold ${isMobile ? 'text-sm' : 'text-xs'} border-b-2 border-black`}
          style={{ backgroundColor: expandedSection === 'music' ? '#9ED8DB' : '#FFFFFF' }}
        >
          <span className="flex items-center gap-2">
            <Music className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'}`} />
            MUSIQUE
            {musicTrack && <span className={`${isMobile ? 'text-xs' : 'text-[10px]'} font-normal`}>({musicTracks.find(m => m.id === musicTrack)?.name})</span>}
          </span>
          <span className={`${isMobile ? 'text-lg' : 'text-base'}`}>{expandedSection === 'music' ? '−' : '+'}</span>
        </button>
        {expandedSection === 'music' && (
          <div className={`${isMobile ? 'p-3 space-y-2' : 'p-2 space-y-1.5'}`} style={{ backgroundColor: '#FFFFFF' }}>
            {musicTracks.map((track) => (
              <button
                key={track.id}
                onClick={() => onMusicChange(track.id)}
                className={`w-full flex items-center justify-between ${isMobile ? 'px-4 py-3 text-sm' : 'px-3 py-2 text-xs'} border-2 border-black font-bold transition-colors`}
                style={{ backgroundColor: musicTrack === track.id ? '#9ED8DB' : '#FFFFFF' }}
              >
                <span className="flex items-center gap-2">
                  {track.icon && <span className={isMobile ? 'text-lg' : 'text-base'}>{track.icon}</span>}
                  {track.name}
                </span>
                {track.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setPreviewMusic(previewMusic === track.id ? null : track.id)
                    }}
                    className={`${isMobile ? 'w-8 h-8' : 'w-5 h-5'} flex items-center justify-center border-2 border-black`}
                    style={{ backgroundColor: '#FFFFFF' }}
                  >
                    {previewMusic === track.id ? <Pause className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'}`} /> : <Play className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'}`} />}
                  </button>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Template Selection */}
      <div className="border-2 border-black overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        <button
          onClick={() => toggleSection('template')}
          className={`w-full flex items-center justify-between ${isMobile ? 'px-4 py-3' : 'px-3 py-2'} font-display font-bold ${isMobile ? 'text-sm' : 'text-xs'} border-b-2 border-black`}
          style={{ backgroundColor: expandedSection === 'template' ? '#9ED8DB' : '#FFFFFF' }}
        >
          <span className="flex items-center gap-2">
            <Layout className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'}`} />
            TEMPLATE
            {template && <span className={`${isMobile ? 'text-xs' : 'text-[10px]'} font-normal`}>({templates.find(t => t.id === template)?.name})</span>}
          </span>
          <span className={`${isMobile ? 'text-lg' : 'text-base'}`}>{expandedSection === 'template' ? '−' : '+'}</span>
        </button>
        {expandedSection === 'template' && (
          <div className={`${isMobile ? 'p-3' : 'p-2'} grid grid-cols-2 gap-2`} style={{ backgroundColor: '#FFFFFF' }}>
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => onTemplateChange(t.id)}
                className={`relative ${isMobile ? 'p-4 text-sm' : 'p-3 text-xs'} border-2 border-black font-bold transition-all ${
                  template === t.id ? 'ring-2 ring-offset-1 ring-[#1D3354]' : ''
                }`}
                style={{ backgroundColor: t.color, color: t.color === '#F5F5F5' || t.color === '#9ED8DB' ? '#000' : '#FFF' }}
              >
                {t.name}
                {template === t.id && (
                  <span className={`absolute -top-1 -right-1 ${isMobile ? 'w-5 h-5 text-[10px]' : 'w-4 h-4 text-[8px]'} flex items-center justify-center border-2 border-black`} style={{ backgroundColor: '#9ED8DB' }}>
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Custom Text */}
      <div className="border-2 border-black overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        <button
          onClick={() => toggleSection('text')}
          className={`w-full flex items-center justify-between ${isMobile ? 'px-4 py-3' : 'px-3 py-2'} font-display font-bold ${isMobile ? 'text-sm' : 'text-xs'} border-b-2 border-black`}
          style={{ backgroundColor: expandedSection === 'text' ? '#9ED8DB' : '#FFFFFF' }}
        >
          <span className="flex items-center gap-2">
            <Type className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'}`} />
            TEXTE PERSONNALISÉ
            {customText && <span className={`${isMobile ? 'text-xs' : 'text-[10px]'} font-normal`}>(actif)</span>}
          </span>
          <span className={`${isMobile ? 'text-lg' : 'text-base'}`}>{expandedSection === 'text' ? '−' : '+'}</span>
        </button>
        {expandedSection === 'text' && (
          <div className={`${isMobile ? 'p-3' : 'p-2'}`} style={{ backgroundColor: '#FFFFFF' }}>
            <input
              type="text"
              value={customText}
              onChange={(e) => onCustomTextChange(e.target.value)}
              placeholder="Ex: @monpseudo - Soldes -50%"
              maxLength={50}
              className={`w-full ${isMobile ? 'px-4 py-3 text-sm' : 'px-3 py-2 text-xs'} border-2 border-black font-body placeholder:text-black/40`}
            />
            <p className={`${isMobile ? 'text-xs' : 'text-[10px]'} text-black/50 mt-2`}>{customText.length}/50 caractères</p>
          </div>
        )}
      </div>

      {/* Watermark Option */}
      <div
        className={`flex items-center justify-between ${isMobile ? 'px-4 py-3' : 'px-3 py-2'} border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
        style={{ backgroundColor: '#FFFFFF' }}
      >
        <div className="flex items-center gap-2">
          <Stamp className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'}`} />
          <span className={`font-display font-bold ${isMobile ? 'text-sm' : 'text-xs'}`}>WATERMARK</span>
          {!canRemoveWatermark && (
            <span
              className={`flex items-center gap-1 ${isMobile ? 'text-[10px]' : 'text-[9px]'} font-body px-1.5 py-0.5 border border-black`}
              style={{ backgroundColor: '#9ED8DB' }}
            >
              <Lock className="w-2.5 h-2.5" />
              PRO/BUSINESS
            </span>
          )}
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={hasWatermark}
            onChange={(e) => canRemoveWatermark && onWatermarkChange(e.target.checked)}
            disabled={!canRemoveWatermark}
            className="sr-only peer"
          />
          <div
            className={`${isMobile ? 'w-11 h-6' : 'w-9 h-5'} border-2 border-black peer-checked:after:translate-x-full after:content-[''] after:absolute ${isMobile ? 'after:top-[2px] after:left-[2px] after:h-4 after:w-4' : 'after:top-[1px] after:left-[1px] after:h-3.5 after:w-3.5'} after:border-2 after:border-black after:transition-all ${!canRemoveWatermark ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{
              backgroundColor: hasWatermark ? '#1D3354' : '#FFFFFF',
            }}
          >
            <span
              className={`absolute ${isMobile ? 'top-[2px] left-[2px] w-4 h-4' : 'top-[1px] left-[1px] w-3.5 h-3.5'} border-2 border-black transition-transform ${hasWatermark ? (isMobile ? 'translate-x-5' : 'translate-x-4') : ''}`}
              style={{ backgroundColor: '#FFFFFF' }}
            />
          </div>
        </label>
      </div>
      {!canRemoveWatermark && (
        <p className={`${isMobile ? 'text-[10px]' : 'text-[9px]'} text-black/50 font-body text-center -mt-1`}>
          Passe a Pro ou Business pour retirer le watermark
        </p>
      )}

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        disabled={loading || selectedArticles.length === 0}
        className={`w-full ${isMobile ? 'px-6 py-4 text-base' : 'px-4 py-3 text-sm'} border-3 border-black font-display font-bold text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
        style={{ backgroundColor: '#D64045' }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'} border-2 border-white border-t-transparent rounded-full animate-spin`}></div>
            GÉNÉRATION EN COURS...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Sparkles className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'}`} />
            GÉNÉRER LA VIDÉO
          </span>
        )}
      </button>

      {loading && (
        <p className={`${isMobile ? 'text-xs' : 'text-[10px]'} font-bold text-black/50 text-center`}>
          Environ 1-2 minutes
        </p>
      )}
    </div>
  )
}
