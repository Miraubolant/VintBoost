import { useState, useCallback } from 'react'
import type { WardrobeData } from '../types/vinted'

const API_URL = import.meta.env.VITE_SCRAPER_API_URL || 'http://localhost:3000'
const API_KEY = import.meta.env.VITE_SCRAPER_API_KEY || ''

interface ProfileScreenshotResult {
  success: boolean
  screenshot: string // base64 data URL
  width: number
  height: number
  error?: string
}

export function useVintedScraper() {
  const [data, setData] = useState<WardrobeData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [screenshotLoading, setScreenshotLoading] = useState(false)

  const scrapeWardrobe = useCallback(async (wardrobeUrl: string) => {
    if (!wardrobeUrl.includes('vinted') || !wardrobeUrl.includes('/member')) {
      setError('URL invalide. Utilisez un lien de vestiaire Vinted.')
      return null
    }

    setLoading(true)
    setError(null)
    setData(null)

    try {
      const response = await fetch(`${API_URL}/api/scrape-wardrobe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(API_KEY && { 'X-API-Key': API_KEY }),
        },
        body: JSON.stringify({ wardrobeUrl }),
      })

      const result: WardrobeData = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Erreur lors du scraping')
      }

      setData(result)
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
  }, [])

  const captureProfileScreenshot = useCallback(async (wardrobeUrl: string): Promise<ProfileScreenshotResult | null> => {
    if (!wardrobeUrl.includes('vinted') || !wardrobeUrl.includes('/member')) {
      return null
    }

    setScreenshotLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/profile-screenshot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(API_KEY && { 'X-API-Key': API_KEY }),
        },
        body: JSON.stringify({ wardrobeUrl }),
      })

      const result: ProfileScreenshotResult = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Erreur lors de la capture')
      }

      return result
    } catch (err) {
      console.error('Screenshot capture error:', err)
      return null
    } finally {
      setScreenshotLoading(false)
    }
  }, [])

  return { scrapeWardrobe, captureProfileScreenshot, data, loading, screenshotLoading, error, reset }
}
