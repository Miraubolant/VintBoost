import { createContext, useContext, useState, ReactNode } from 'react'
import type { WardrobeData } from '../types/vinted'

interface WardrobeContextType {
  wardrobeData: WardrobeData | null
  setWardrobeData: (data: WardrobeData | null) => void
  clearWardrobeData: () => void
  pendingUrl: string | null
  setPendingUrl: (url: string | null) => void
}

const WardrobeContext = createContext<WardrobeContextType | undefined>(undefined)

export function WardrobeProvider({ children }: { children: ReactNode }) {
  const [wardrobeData, setWardrobeData] = useState<WardrobeData | null>(null)
  const [pendingUrl, setPendingUrl] = useState<string | null>(null)

  const clearWardrobeData = () => {
    setWardrobeData(null)
    setPendingUrl(null)
  }

  return (
    <WardrobeContext.Provider value={{ wardrobeData, setWardrobeData, clearWardrobeData, pendingUrl, setPendingUrl }}>
      {children}
    </WardrobeContext.Provider>
  )
}

export function useWardrobe() {
  const context = useContext(WardrobeContext)
  if (context === undefined) {
    throw new Error('useWardrobe must be used within a WardrobeProvider')
  }
  return context
}
