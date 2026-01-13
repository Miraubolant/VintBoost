import { Sparkles, Download, RefreshCw, Share2 } from 'lucide-react'
import type { VideoGenerationResult } from '../types/vinted'

interface VideoResultDisplayProps {
  result: VideoGenerationResult
  onDownload: () => void
  onReset: () => void
  isMobile?: boolean
}

export function VideoResultDisplay({
  result,
  onDownload,
  onReset,
  isMobile = false,
}: VideoResultDisplayProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Ma video VintBoost',
          text: 'Decouvre ma video promotionnelle Vinted !',
          url: result.videoUrl,
        })
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(result.videoUrl)
    }
  }

  return (
    <div className={isMobile ? 'space-y-4' : 'space-y-3'}>
      {/* Success Banner */}
      <div
        className="border-2 border-black p-3 flex items-center gap-2"
        style={{ backgroundColor: '#9ED8DB' }}
      >
        <Sparkles className="w-5 h-5" />
        <p className="font-display font-bold text-black text-sm">
          VIDEO GENEREE AVEC SUCCES !
        </p>
      </div>

      {/* Video Player */}
      <div className="border-2 border-black overflow-hidden">
        <video
          src={result.videoUrl}
          controls
          className="w-full"
          poster={result.thumbnailUrl}
          playsInline
        />
      </div>

      {/* Video Info */}
      <div className="flex items-center justify-center gap-4 text-xs text-black/60">
        <span className="font-bold">{result.duration}s</span>
        <span>•</span>
        <span>{result.fileSize}</span>
        <span>•</span>
        <span>MP4</span>
      </div>

      {/* Action Buttons */}
      <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-3'} gap-2`}>
        <button
          onClick={onDownload}
          className={`
            flex items-center justify-center gap-2 px-4 py-3
            border-2 border-black font-display font-bold text-sm text-white
            shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
            active:translate-x-[1px] active:translate-y-[1px]
            active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
            transition-all
            ${isMobile ? 'col-span-2' : ''}
          `}
          style={{ backgroundColor: '#D64045' }}
        >
          <Download className="w-5 h-5" />
          TELECHARGER
        </button>

        <button
          onClick={handleShare}
          className={`
            flex items-center justify-center gap-2 px-4 py-3
            border-2 border-black font-display font-bold text-sm
            shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
            active:translate-x-[1px] active:translate-y-[1px]
            active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
            transition-all
          `}
          style={{ backgroundColor: '#9ED8DB' }}
        >
          <Share2 className="w-5 h-5" />
          {!isMobile && 'PARTAGER'}
        </button>

        <button
          onClick={onReset}
          className={`
            flex items-center justify-center gap-2 px-4 py-3
            border-2 border-black font-display font-bold text-sm
            shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
            active:translate-x-[1px] active:translate-y-[1px]
            active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
            transition-all
          `}
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <RefreshCw className="w-5 h-5" />
          {!isMobile && 'NOUVELLE'}
        </button>
      </div>
    </div>
  )
}
