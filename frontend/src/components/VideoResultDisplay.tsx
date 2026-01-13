import { useState } from 'react'
import { Sparkles, Download, RefreshCw, Share2, Play, Video } from 'lucide-react'
import type { VideoGenerationResult } from '../types/vinted'
import { VideoPlayerModal } from './VideoPlayerModal'

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
  const [showPlayer, setShowPlayer] = useState(false)

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
    <>
      <div className={isMobile ? 'space-y-4' : 'space-y-3'}>
        {/* Success Banner */}
        <div
          className="border-2 border-black p-2 flex items-center justify-center gap-2"
          style={{ backgroundColor: '#9ED8DB' }}
        >
          <Sparkles className="w-4 h-4" />
          <p className="font-display font-bold text-black text-xs">
            VIDEO GENEREE !
          </p>
        </div>

        {/* Video Card - Compact style like "Mes Videos" */}
        <div className="flex justify-center">
          <div
            onClick={() => setShowPlayer(true)}
            className="w-32 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] overflow-hidden cursor-pointer hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all group"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            {/* Thumbnail */}
            <div className="aspect-[9/16] relative overflow-hidden" style={{ backgroundColor: '#1D3354' }}>
              {result.thumbnailUrl ? (
                <img
                  src={result.thumbnailUrl}
                  alt="Video"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Video className="w-8 h-8 text-white/30" />
                </div>
              )}

              {/* Play overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
                <div
                  className="w-10 h-10 border-2 border-black flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  style={{ backgroundColor: '#D64045' }}
                >
                  <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                </div>
              </div>

              {/* Duration badge */}
              <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-black/80 text-white text-[10px] font-display font-bold">
                {result.duration}s
              </div>
            </div>

            {/* Info */}
            <div className="p-2 border-t-2 border-black">
              <p className="font-display font-bold text-[10px] text-center text-black/60">
                {result.fileSize} MB • MP4
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons - More compact */}
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={onDownload}
            className="flex items-center justify-center gap-1.5 px-2 py-2 border-2 border-black font-display font-bold text-[10px] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
            style={{ backgroundColor: '#D64045' }}
          >
            <Download className="w-3.5 h-3.5" />
            DL
          </button>

          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-1.5 px-2 py-2 border-2 border-black font-display font-bold text-[10px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
            style={{ backgroundColor: '#9ED8DB' }}
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onReset}
            className="flex items-center justify-center gap-1.5 px-2 py-2 border-2 border-black font-display font-bold text-[10px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Video Player Modal */}
      <VideoPlayerModal
        isOpen={showPlayer}
        onClose={() => setShowPlayer(false)}
        videoUrl={result.videoUrl}
        title="Ma video VintBoost"
        thumbnailUrl={result.thumbnailUrl}
      />
    </>
  )
}
