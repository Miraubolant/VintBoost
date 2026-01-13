import { ArrowLeft } from 'lucide-react'

interface UserHeaderProps {
  onBack: () => void
}

export function UserHeader({ onBack }: UserHeaderProps) {
  return (
    <div className="border-b-3 border-black" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3">
        <button
          onClick={onBack}
          className="w-10 h-10 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
