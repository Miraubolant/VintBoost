import { useState, useCallback, useEffect } from 'react'
import type { VideoConfig, VideoGenerationResult, MusicTrack } from '../types/vinted'
import { supabase, uploadVideoToStorage } from '../lib/supabase'

const API_URL = import.meta.env.VITE_SCRAPER_API_URL || 'http://localhost:3000'
const API_KEY = import.meta.env.VITE_SCRAPER_API_KEY || ''

const getHeaders = () => ({
  'Content-Type': 'application/json',
  ...(API_KEY && { 'X-API-Key': API_KEY }),
})

export function useVideoGeneration() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<VideoGenerationResult | null>(null)
  const [musicTracks, setMusicTracks] = useState<MusicTrack[]>([])

  // Charger les musiques disponibles
  const fetchMusicTracks = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/video/music`, {
        headers: getHeaders(),
      })
      const data = await response.json()
      if (data.success && data.tracks) {
        setMusicTracks(data.tracks)
      }
    } catch {
      // Musiques par défaut si l'API échoue
      setMusicTracks([
        { id: 'default', name: 'Musique par défaut', filename: 'default.mp3' }
      ])
    }
  }, [])

  // Charger les musiques au montage
  useEffect(() => {
    fetchMusicTracks()
  }, [fetchMusicTracks])

  // Générer la vidéo
  const generate = useCallback(async (config: VideoConfig): Promise<VideoGenerationResult | null> => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('Utilisateur non connecte')
      }

      const response = await fetch(`${API_URL}/api/video/generate`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          articles: config.articles,
          duration: config.duration,
          musicTrack: config.musicTrack,
          title: config.title || '',
          template: config.template || 'classic',
          customText: config.customText || '',
          hasWatermark: config.hasWatermark,
          resolution: config.resolution || '1080p',
          aspectRatio: config.aspectRatio || '9:16',
          username: config.username || '',
          profileScreenshotId: config.profileScreenshotId || null,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de la generation')
      }

      // Fetch video and thumbnail blobs from API
      const videoUrl = `${API_URL}${data.videoUrl}`
      const thumbnailUrl = `${API_URL}${data.thumbnailUrl}`

      let supabaseVideoUrl = videoUrl
      let supabaseThumbnailUrl = thumbnailUrl

      try {
        // Fetch video blob
        const videoResponse = await fetch(videoUrl)
        const videoBlob = await videoResponse.blob()

        // Fetch thumbnail blob
        const thumbResponse = await fetch(thumbnailUrl)
        const thumbBlob = await thumbResponse.blob()

        // Upload to Supabase storage
        const uploadResult = await uploadVideoToStorage(
          user.id,
          data.videoId,
          videoBlob,
          thumbBlob
        )

        if (uploadResult.videoUrl) {
          supabaseVideoUrl = uploadResult.videoUrl
        }
        if (uploadResult.thumbnailUrl) {
          supabaseThumbnailUrl = uploadResult.thumbnailUrl
        }

        // Save video record to database
        await supabase.from('user_videos').insert({
          user_id: user.id,
          video_id: data.videoId,
          video_url: supabaseVideoUrl,
          thumbnail_url: supabaseThumbnailUrl,
          title: config.title || '',
          duration: data.duration,
          file_size: data.fileSize,
          template: config.template || 'classic',
          articles_count: config.articles.length,
        })
      } catch {
        // Continue with API URLs if Supabase upload fails
      }

      const videoResult: VideoGenerationResult = {
        success: true,
        videoId: data.videoId,
        videoUrl: supabaseVideoUrl,
        thumbnailUrl: supabaseThumbnailUrl,
        duration: data.duration,
        fileSize: data.fileSize,
      }

      setResult(videoResult)
      return videoResult
    } catch (err) {
      let message = 'Erreur inconnue'
      if (err instanceof Error) {
        if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          message = 'Erreur de connexion au serveur. Verifiez votre connexion internet.'
        } else {
          message = err.message
        }
      }
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Télécharger la vidéo
  const downloadVideo = useCallback(async (videoId: string) => {
    try {
      const link = document.createElement('a')
      link.href = `${API_URL}/api/video/${videoId}/download`
      link.download = `vintboost-${videoId}.mp4`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch {
      // Download error - silently fail
    }
  }, [])

  // Reset
  const reset = useCallback(() => {
    setResult(null)
    setError(null)
  }, [])

  return {
    generate,
    downloadVideo,
    loading,
    error,
    result,
    musicTracks,
    reset,
  }
}
