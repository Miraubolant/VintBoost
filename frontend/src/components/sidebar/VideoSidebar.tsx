import type { VintedItem, UserInfo, VideoTemplate } from '../../types/vinted'
import { SidebarUserProfile } from './SidebarUserProfile'
import { SidebarVideoPreview } from './SidebarVideoPreview'
import { SidebarVideoConfig } from './SidebarVideoConfig'
import { SidebarGenerateButton } from './SidebarGenerateButton'

interface VideoSidebarProps {
  // User info
  username?: string
  userInfo?: UserInfo
  totalItems: number
  // Video content
  selectedArticles: VintedItem[]
  profileScreenshotUrl?: string | null
  includeProfileScreenshot?: boolean
  // Configuration
  musicTrack: string
  template: string
  customText: string
  hasWatermark: boolean
  plan: 'free' | 'pro' | 'business'
  // Config handlers
  onMusicChange?: (track: string) => void
  onTemplateChange?: (template: VideoTemplate) => void
  onCustomTextChange?: (text: string) => void
  onWatermarkChange?: (hasWatermark: boolean) => void
  // Generation
  creditsRemaining: number
  onGenerate: () => void
  loading: boolean
  // Actions
  onUpgradeClick?: () => void
}

export function VideoSidebar({
  username,
  userInfo,
  totalItems,
  selectedArticles,
  profileScreenshotUrl,
  includeProfileScreenshot,
  musicTrack,
  template,
  customText,
  hasWatermark,
  plan,
  onMusicChange,
  onTemplateChange,
  onCustomTextChange,
  onWatermarkChange,
  creditsRemaining,
  onGenerate,
  loading,
  onUpgradeClick,
}: VideoSidebarProps) {
  const canGenerate = selectedArticles.length > 0 && creditsRemaining > 0

  return (
    <div className="space-y-4">
      {/* User Profile Card */}
      <SidebarUserProfile
        username={username}
        userInfo={userInfo}
        totalItems={totalItems}
      />

      {/* Video Preview */}
      <SidebarVideoPreview
        selectedArticles={selectedArticles}
        profileScreenshotUrl={profileScreenshotUrl}
        includeProfileScreenshot={includeProfileScreenshot}
      />

      {/* Video Configuration */}
      <SidebarVideoConfig
        musicTrack={musicTrack}
        template={template}
        customText={customText}
        hasWatermark={hasWatermark}
        plan={plan}
        onMusicChange={onMusicChange}
        onTemplateChange={onTemplateChange}
        onCustomTextChange={onCustomTextChange}
        onWatermarkChange={onWatermarkChange}
        onUpgradeClick={onUpgradeClick}
      />

      {/* Generate Button */}
      <SidebarGenerateButton
        canGenerate={canGenerate}
        creditsRemaining={creditsRemaining}
        loading={loading}
        onGenerate={onGenerate}
        onUpgradeClick={onUpgradeClick}
      />
    </div>
  )
}

// Re-export all sidebar components for granular use
export { SidebarUserProfile } from './SidebarUserProfile'
export { SidebarVideoPreview } from './SidebarVideoPreview'
export { SidebarVideoConfig } from './SidebarVideoConfig'
export { SidebarGenerateButton } from './SidebarGenerateButton'
