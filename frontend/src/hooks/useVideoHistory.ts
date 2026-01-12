import { useState, useEffect } from 'react'
import { supabase, UserVideo } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

interface VideoHistoryItem {
  id: string
  videoId: string
  videoUrl: string | null
  thumbnailUrl: string | null
  title: string | null
  duration: number | null
  fileSize: string | null
  template: string | null
  articlesCount: number | null
  createdAt: Date
}

interface UseVideoHistoryReturn {
  videos: VideoHistoryItem[]
  loading: boolean
  error: string | null
  fetchVideos: () => Promise<void>
  saveVideo: (video: Omit<VideoHistoryItem, 'id' | 'createdAt'>) => Promise<boolean>
  deleteVideo: (videoId: string) => Promise<boolean>
}

export function useVideoHistory(): UseVideoHistoryReturn {
  const { user } = useAuth()
  const [videos, setVideos] = useState<VideoHistoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchVideos = async () => {
    if (!user) {
      setVideos([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from('user_videos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (fetchError) {
        throw fetchError
      }

      const formattedVideos: VideoHistoryItem[] = (data || []).map((video: UserVideo) => ({
        id: video.id,
        videoId: video.video_id,
        videoUrl: video.video_url,
        thumbnailUrl: video.thumbnail_url,
        title: video.title,
        duration: video.duration,
        fileSize: video.file_size,
        template: video.template,
        articlesCount: video.articles_count,
        createdAt: new Date(video.created_at),
      }))

      setVideos(formattedVideos)
    } catch (err) {
      console.error('Error fetching video history:', err)
      setError('Erreur lors du chargement de l\'historique')
    } finally {
      setLoading(false)
    }
  }

  const saveVideo = async (video: Omit<VideoHistoryItem, 'id' | 'createdAt'>): Promise<boolean> => {
    if (!user) return false

    try {
      const { error: insertError } = await supabase
        .from('user_videos')
        .insert({
          user_id: user.id,
          video_id: video.videoId,
          video_url: video.videoUrl,
          thumbnail_url: video.thumbnailUrl,
          title: video.title,
          duration: video.duration,
          file_size: video.fileSize,
          template: video.template,
          articles_count: video.articlesCount,
        })

      if (insertError) {
        throw insertError
      }

      // Refresh the list
      await fetchVideos()
      return true
    } catch (err) {
      console.error('Error saving video:', err)
      return false
    }
  }

  const deleteVideo = async (videoId: string): Promise<boolean> => {
    if (!user) return false

    try {
      const { error: deleteError } = await supabase
        .from('user_videos')
        .delete()
        .eq('id', videoId)
        .eq('user_id', user.id)

      if (deleteError) {
        throw deleteError
      }

      // Refresh the list
      await fetchVideos()
      return true
    } catch (err) {
      console.error('Error deleting video:', err)
      return false
    }
  }

  // Fetch videos when user changes
  useEffect(() => {
    if (user) {
      fetchVideos()
    } else {
      setVideos([])
    }
  }, [user?.id])

  return {
    videos,
    loading,
    error,
    fetchVideos,
    saveVideo,
    deleteVideo,
  }
}
