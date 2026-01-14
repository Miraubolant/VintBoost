import { useState, useRef, useEffect } from 'react'
import { X, Play, Pause, Volume2, VolumeX, Download, Maximize, SkipBack, SkipForward, ExternalLink } from 'lucide-react'

interface VideoPlayerModalProps {
  isOpen: boolean
  onClose: () => void
  videoUrl: string | null
  title: string | null
  thumbnailUrl: string | null
}

export function VideoPlayerModal({ isOpen, onClose, videoUrl, title, thumbnailUrl }: VideoPlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play().catch(() => {})
      setIsPlaying(true)
    }
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case ' ':
          e.preventDefault()
          togglePlay()
          break
        case 'ArrowLeft':
          skip(-10)
          break
        case 'ArrowRight':
          skip(10)
          break
        case 'm':
          setIsMuted(!isMuted)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isMuted])

  const togglePlay = () => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const skip = (seconds: number) => {
    if (!videoRef.current) return
    videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds))
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const toggleFullscreen = () => {
    const container = document.getElementById('video-container')
    if (!container) return

    if (!document.fullscreenElement) {
      container.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)
  }

  if (!isOpen || !videoUrl) return null

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[10000] p-4">
      {/* Close button - always visible */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 w-10 h-10 border-2 border-white/20 flex items-center justify-center bg-black/50 hover:bg-black/70 transition-colors"
      >
        <X className="w-5 h-5 text-white" />
      </button>

      {/* Video container - Adapted for vertical videos (9:16) */}
      <div
        id="video-container"
        className="relative bg-black border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] aspect-[9/16]"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        {/* Video */}
        <video
          ref={videoRef}
          src={videoUrl}
          poster={thumbnailUrl || undefined}
          className="w-full h-full object-contain"
          onClick={togglePlay}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          muted={isMuted}
          playsInline
        />

        {/* Play overlay when paused */}
        {!isPlaying && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
            onClick={togglePlay}
          >
            <div
              className="w-20 h-20 border-3 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              style={{ backgroundColor: '#D64045' }}
            >
              <Play className="w-10 h-10 text-white fill-white ml-1" />
            </div>
          </div>
        )}

        {/* Controls overlay */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Title */}
          {title && (
            <p className="font-display font-bold text-white text-sm mb-3 truncate">
              {title}
            </p>
          )}

          {/* Progress bar */}
          <div className="relative mb-3">
            <div className="h-2 bg-white/20 overflow-hidden">
              <div
                className="h-full transition-all"
                style={{ width: `${progress}%`, backgroundColor: '#D64045' }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {/* Skip back */}
              <button
                onClick={() => skip(-10)}
                className="w-8 h-8 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <SkipBack className="w-4 h-4 text-white" />
              </button>

              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="w-10 h-10 border-2 border-white flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-white" />
                ) : (
                  <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                )}
              </button>

              {/* Skip forward */}
              <button
                onClick={() => skip(10)}
                className="w-8 h-8 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <SkipForward className="w-4 h-4 text-white" />
              </button>

              {/* Mute */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="w-8 h-8 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-white" />
                ) : (
                  <Volume2 className="w-4 h-4 text-white" />
                )}
              </button>

              {/* Time */}
              <span className="font-display text-xs text-white/70 ml-2">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Download */}
              <a
                href={videoUrl}
                download
                className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-white font-display font-bold text-xs text-white hover:bg-white/10 transition-colors"
              >
                <Download className="w-3 h-3" />
                <span className="hidden sm:inline">TELECHARGER</span>
              </a>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="w-8 h-8 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <Maximize className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-friendly bottom actions */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-3 sm:hidden">
        <a
          href={videoUrl}
          download
          className="flex items-center gap-2 px-4 py-2.5 border-2 border-black font-display font-bold text-sm text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          style={{ backgroundColor: '#1D3354' }}
        >
          <Download className="w-4 h-4" />
          TELECHARGER
        </a>
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 border-2 border-black font-display font-bold text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          style={{ backgroundColor: '#9ED8DB' }}
        >
          <ExternalLink className="w-4 h-4" />
          OUVRIR
        </a>
      </div>
    </div>
  )
}
