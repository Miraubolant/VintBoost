import { useState, useCallback, useEffect } from 'react'
import type { VideoConfig, VideoGenerationResult, MusicTrack } from '../types/vinted'

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
    } catch (err) {
      console.error('Erreur lors du chargement des musiques:', err)
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
      const response = await fetch(`${API_URL}/api/video/generate`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          articles: config.articles,
          duration: config.duration,
          musicTrack: config.musicTrack,
          title: config.title || '',
          hasWatermark: config.hasWatermark,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de la génération')
      }

      const videoResult: VideoGenerationResult = {
        success: true,
        videoId: data.videoId,
        videoUrl: `${API_URL}${data.videoUrl}`,
        thumbnailUrl: `${API_URL}${data.thumbnailUrl}`,
        duration: data.duration,
        fileSize: data.fileSize,
      }

      setResult(videoResult)
      return videoResult
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue'
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
    } catch (err) {
      console.error('Erreur lors du téléchargement:', err)
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
