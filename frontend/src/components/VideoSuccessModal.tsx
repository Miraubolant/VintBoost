import { useState } from 'react'
import { Download, History, RefreshCw, Play, X, Video, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { VideoGenerationResult } from '../types/vinted'
import { VideoPlayerModal } from './VideoPlayerModal'

interface VideoSuccessModalProps {
  result: VideoGenerationResult
  onDownload: () => void
  onReset: () => void
  onClose: () => void
}

export function VideoSuccessModal({
  result,
  onDownload,
  onReset,
  onClose,
}: VideoSuccessModalProps) {
  const [showPlayer, setShowPlayer] = useState(false)
  const navigate = useNavigate()

  const handleHistory = () => {
    onClose()
    navigate('/compte')
  }

  const handleNewVideo = () => {
    onReset()
    onClose()
  }

  return (
    <>
      <div
        className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-md border-3 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden animate-scale-in"
          style={{ backgroundColor: '#FFFFFF' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all z-10"
            style={{ backgroundColor: '#D64045' }}
          >
            <X className="w-4 h-4 text-white" />
          </button>

          {/* Success Header */}
          <div
            className="px-6 py-4 border-b-3 border-black"
            style={{ backgroundColor: '#9ED8DB' }}
          >
            <div className="flex items-center justify-center gap-3">
              <div
                className="w-12 h-12 border-3 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                style={{ backgroundColor: '#FFFFFF' }}
              >
                <CheckCircle className="w-6 h-6" style={{ color: '#1D3354' }} />
              </div>
              <div>
                <h2 className="font-display font-bold text-xl" style={{ color: '#1D3354' }}>
                  VIDÉO GÉNÉRÉE !
                </h2>
                <p className="font-body text-xs text-black/60">
                  Ta vidéo est prête à être téléchargée
                </p>
              </div>
            </div>
          </div>

          {/* Video Preview */}
          <div className="p-6">
            <div className="flex justify-center mb-6">
              <div
                onClick={() => setShowPlayer(true)}
                className="relative w-40 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden cursor-pointer hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all group"
                style={{ backgroundColor: '#1D3354' }}
              >
                {/* Thumbnail */}
                <div className="aspect-[9/16] relative overflow-hidden">
                  {result.thumbnailUrl ? (
                    <img
                      src={result.thumbnailUrl}
                      alt="Video"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="w-10 h-10 text-white/30" />
                    </div>
                  )}

                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
                    <div
                      className="w-14 h-14 border-3 border-black flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                      style={{ backgroundColor: '#D64045' }}
                    >
                      <Play className="w-7 h-7 text-white fill-white ml-1" />
                    </div>
                  </div>

                  {/* Duration badge */}
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs font-display font-bold">
                    {result.duration}s
                  </div>
                </div>

                {/* Info bar */}
                <div className="px-3 py-2 border-t-2 border-black" style={{ backgroundColor: '#FFFFFF' }}>
                  <p className="font-display font-bold text-xs text-center text-black/60">
                    {result.fileSize} MB • MP4
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Primary: Download */}
              <button
                onClick={onDownload}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 border-3 border-black font-display font-bold text-base text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                style={{ backgroundColor: '#D64045' }}
              >
                <Download className="w-5 h-5" />
                TÉLÉCHARGER LA VIDÉO
              </button>

              {/* Secondary actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleHistory}
                  className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-black font-display font-bold text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  style={{ backgroundColor: '#9ED8DB' }}
                >
                  <History className="w-4 h-4" />
                  HISTORIQUE
                </button>

                <button
                  onClick={handleNewVideo}
                  className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-black font-display font-bold text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  style={{ backgroundColor: '#FFFFFF' }}
                >
                  <RefreshCw className="w-4 h-4" />
                  NOUVELLE
                </button>
              </div>
            </div>

            {/* Tip */}
            <p className="text-[10px] text-black/40 text-center mt-4 font-body">
              Partage ta vidéo sur TikTok, Instagram ou YouTube pour booster tes ventes !
            </p>
          </div>
        </div>
      </div>

      {/* Video Player Modal */}
      <VideoPlayerModal
        isOpen={showPlayer}
        onClose={() => setShowPlayer(false)}
        videoUrl={result.videoUrl}
        title="Ma vidéo VintBoost"
        thumbnailUrl={result.thumbnailUrl}
      />

      <style>{`
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </>
  )
}
