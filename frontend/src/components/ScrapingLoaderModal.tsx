import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

const messages = [
  'Connexion a Vinted...',
  'Recuperation du vestiaire...',
  'Analyse des articles...',
  'Chargement des images...',
  'Presque termine...',
]

export function ScrapingLoaderModal() {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
    >
      <div
        className="w-full max-w-sm border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        {/* Loader Icon */}
        <div className="flex justify-center mb-4">
          <div
            className="w-16 h-16 border-3 border-black flex items-center justify-center"
            style={{ backgroundColor: '#1D3354' }}
          >
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-lg text-center mb-2">
          CHARGEMENT
        </h3>

        {/* Message */}
        <p className="font-body text-sm text-center text-black/70 mb-4">
          {messages[messageIndex]}
        </p>

        {/* Progress dots */}
        <div className="flex justify-center gap-2">
          {messages.map((_, idx) => (
            <div
              key={idx}
              className="w-2.5 h-2.5 border border-black transition-colors"
              style={{ backgroundColor: idx <= messageIndex ? '#1D3354' : '#E8DFD5' }}
            />
          ))}
        </div>

        {/* Tip */}
        <p className="text-[10px] text-black/40 text-center mt-4 font-body">
          Les videos augmentent tes ventes jusqu'a +300%
        </p>
      </div>
    </div>
  )
}
