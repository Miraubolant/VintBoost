import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: ReactNode
  requireAuth?: boolean
}

export function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const location = useLocation()

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#E8DFD5' }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-16 h-16 border-3 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            style={{ backgroundColor: '#1D3354' }}
          >
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <span className="font-display font-bold text-sm">Chargement...</span>
        </div>
      </div>
    )
  }

  // If auth is required but user is not logged in, redirect to home
  if (requireAuth && !user) {
    return <Navigate to="/" state={{ from: location, showAuth: true }} replace />
  }

  return <>{children}</>
}
