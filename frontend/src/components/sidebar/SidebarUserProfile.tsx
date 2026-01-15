import { MapPin, Package, ShoppingBag, Users, Star } from 'lucide-react'
import type { UserInfo } from '../../types/vinted'

interface SidebarUserProfileProps {
  username?: string
  userInfo?: UserInfo
  totalItems: number
}

export function SidebarUserProfile({ username, userInfo, totalItems }: SidebarUserProfileProps) {
  return (
    <div className="border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Header with profile */}
      <div className="p-4 border-b-2 border-black" style={{ backgroundColor: '#1D3354' }}>
        <div className="flex items-center gap-3">
          {userInfo?.profilePicture ? (
            <div className="w-12 h-12 border-2 border-white overflow-hidden flex-shrink-0">
              <img
                src={userInfo.profilePicture}
                alt={username}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div
              className="w-12 h-12 border-2 border-white flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#9ED8DB' }}
            >
              <span className="font-display font-bold text-lg text-black">
                {(username || 'U')[0].toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-display font-bold text-white truncate">
              @{username || 'Utilisateur'}
            </h3>
            {userInfo?.city && (
              <p className="text-xs text-white/70 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" />
                {userInfo.city}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stats row */}
      {userInfo && (
        <div className="grid grid-cols-4 divide-x-2 divide-black" style={{ backgroundColor: '#F8F8F8' }}>
          <StatItem icon={<Package className="w-3.5 h-3.5" />} value={totalItems} label="articles" />
          <StatItem icon={<ShoppingBag className="w-3.5 h-3.5" />} value={userInfo.soldItemsCount} label="vendus" />
          <StatItem icon={<Users className="w-3.5 h-3.5" />} value={userInfo.followersCount} label="abonnes" />
          <StatItem icon={<Star className="w-3.5 h-3.5" />} value={userInfo.positiveFeedbackCount} label="avis" />
        </div>
      )}
    </div>
  )
}

function StatItem({ icon, value, label }: { icon: React.ReactNode; value: number | string; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-2.5">
      <div className="flex items-center gap-1" style={{ color: '#1D3354' }}>
        {icon}
        <span className="font-display font-bold text-sm">{value}</span>
      </div>
      <span className="text-[9px] text-black/50 font-body">{label}</span>
    </div>
  )
}
