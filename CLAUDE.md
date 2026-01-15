# VintBoost - Claude Code Configuration

## Project Overview
VintBoost is a video generator for Vinted sellers. Users paste their wardrobe URL, select articles, and generate promotional videos automatically.

**Repository**: https://github.com/Miraubolant/VintBoost

## Architecture

### Frontend (`/frontend`)
- **Framework**: React 18 + TypeScript
- **Build**: Vite
- **Styling**: TailwindCSS with Neo-Brutalism design
- **Auth**: Supabase Auth (Google OAuth)
- **Port**: 4173 (preview)

### API Server (`/api-server`)
- **Runtime**: Node.js 20
- **Video**: Remotion
- **Scraping**: Puppeteer
- **Port**: 3000

### Database (Supabase)
- **Tables**: profiles, subscriptions, credits, user_videos, user_analytics
- **Storage**: `videos` bucket for user generated videos
- **RLS**: Enabled on all tables and storage
- **Migrations**: `/supabase/migrations`

## Design System

### Color Palette
- **Navy**: `#1D3354` - Primary brand color
- **Background**: `#E8DFD5` - Cream beige
- **Cyan**: `#9ED8DB` - Accent
- **Red**: `#D64045` - CTA buttons
- **White**: `#FFFFFF` - Cards

### Typography
- **Display**: Space Grotesk (headings)
- **Body**: Inter (text)

### Neo-Brutalism Style
- **Borders**: `border-2 border-black` or `border-3 border-black`
- **Shadows**: `shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`
- **Hover**: `hover:translate-x-[-2px] hover:translate-y-[-2px]`

## Key Files

### Frontend
- `src/App.tsx` - Main app with routing
- `src/context/AuthContext.tsx` - Supabase auth
- `src/components/Header.tsx` - Navigation
- `src/components/Footer.tsx` - Footer with legal links
- `src/components/BeforeAfterSection.tsx` - 4 steps tutorial
- `src/components/VintDressSection.tsx` - VintDress promo
- `src/components/VintedScraperPage.tsx` - Hero section with URL input
- `src/components/VideoConfigPanel.tsx` - Video generation options (watermark, duration, etc.)
- `src/components/PricingSection.tsx` - Pricing plans
- `src/components/AuthModal.tsx` - Login/signup modal
- `src/components/NoCreditModal.tsx` - No credits modal
- `src/pages/ResultatPage.tsx` - Video generation
- `src/pages/AccountPage.tsx` - User account and videos history
- `src/pages/FAQPage.tsx` - Frequently asked questions
- `src/pages/MentionsLegalesPage.tsx` - Legal mentions (includes CGU and Privacy tabs)
- `src/hooks/useVideoGeneration.ts` - Video generation hook with Supabase upload
- `src/lib/supabase.ts` - Supabase client and storage helpers

### API Server
- `server.js` - Express server
- `src/services/scraper.service.js` - Vinted scraping
- `src/services/video.service.js` - Video generation
- `src/remotion/` - Remotion compositions

## Production URLs
- **Frontend**: https://vintboost.com
- **API**: https://api.vintboost.com
- **Supabase**: https://mkzhgzvtvsezqlpesdgc.supabase.co

## Deployment (Coolify)

### Frontend Service
- **Domain**: vintboost.com
- **Dockerfile**: `frontend/Dockerfile`
- **Port**: 4173
- **Build Args**:
  - `VITE_SUPABASE_URL=https://mkzhgzvtvsezqlpesdgc.supabase.co`
  - `VITE_SUPABASE_ANON_KEY=<supabase_anon_key>`
  - `VITE_SCRAPER_API_URL=https://api.vintboost.com`
  - `VITE_SCRAPER_API_KEY=<your_api_key>` (must match API_KEY on backend)

### API Service
- **Domain**: api.vintboost.com
- **Dockerfile**: `api-server/Dockerfile`
- **Port**: 3000
- **Environment**:
  - `API_KEY=<your_api_key>`
  - `ALLOWED_ORIGINS=https://vintboost.com`

## Commands

```bash
# Frontend
cd frontend
npm install
npm run dev      # Development
npm run build    # Production build
npm run preview  # Preview build

# API Server
cd api-server
npm install
npm run dev      # Development
npm start        # Production

# Supabase
supabase db push  # Push migrations
```

## Subscription Plans
| Plan | Type | Videos | Price | Features |
|------|------|--------|-------|----------|
| Free | - | 1 | 0€ | 1 template, Watermark, 1 jour sauvegarde |
| Pack Pro | One-time | 5 | 2,99€ | All templates, No watermark, 1080p HD, 7 jours sauvegarde |
| Business | Abonnement | 15/mois | 5,99€/mois | All templates, No watermark, 4K, 30 jours sauvegarde |

## Credits & Subscription Logic

### Plans Details
| Plan | Type | Videos | Articles/video | Duration | Resolution | Templates | Watermark | Sauvegarde |
|------|------|--------|----------------|----------|------------|-----------|-----------|------------|
| Free | - | 1 | 5 | 15s | 1080p | 1 (Classic) | Forced | 1 jour |
| Pack Pro | One-time | 5 | 10 | 15s/30s/60s | 1080p HD | 3 | Optional | 7 jours |
| Business | Subscription | 15/mois | 20 | 15s/30s/60s | 4K | 3 | Optional | 30 jours |

### Database Tables

#### `subscriptions`
- `user_id` - UUID (unique per user)
- `plan` - 'free' | 'pro' | 'business'
- `plan_type` - 'free' | 'one_time' | 'subscription' (NEW)
- `status` - 'active' | 'cancelled' | 'expired' | 'past_due' | 'trialing'
- `videos_limit` - Video limit (1, 5, or 15)
- `videos_used` - Usage counter
- `max_articles` - Max articles per video (5, 10, or 20) (NEW)
- `storage_days` - Video retention days (1, 7, or 30) (NEW)
- `period_start` / `period_end` - Billing period (for Business only)

#### `credits`
- `user_id` - UUID
- `amount` - Extra credits purchased (not monthly, persistent)

#### `user_videos`
- `id` - UUID
- `user_id` - UUID
- `video_url` - Storage URL
- `thumbnail_url` - Thumbnail URL
- `expires_at` - Auto-deletion timestamp (NEW)
- `created_at` - Creation timestamp

#### `user_analytics`
- `total_videos_generated` - Lifetime total
- `total_articles_used` - Lifetime total
- `last_generation_at` - Timestamp

### Credit Verification Flow
```
1. VintedScraperPage.tsx - canGenerateVideo() check before scraping
2. Shows AuthModal if not logged in
3. Shows NoCreditModal if no credits available
```

### canGenerateVideo() Logic
```typescript
// Priority order:
1. subscription.videosUsed < subscription.videosLimit → true
2. credits.amount > 0 → true
3. Otherwise → false
```

### consumeVideoCredit() Logic
```typescript
// Priority order:
1. If videosUsed < videosLimit → increment subscription.videos_used
2. Else if credits > 0 → decrement credits.amount
3. Update user_analytics (total_videos_generated, total_articles_used)
```

### IMPORTANT: Credit Consumption
**Credits must be consumed AFTER successful video generation, not before.**
- Call `consumeVideoCredit()` in `useVideoGeneration.ts` after `generate()` success
- This ensures users are only charged for successful generations

### Monthly Reset (Business only)
- `videos_used` resets to 0 at the start of each billing period
- Handled by Stripe webhook on subscription renewal
- Extra `credits.amount` do NOT reset (persistent purchases)
- **Pack Pro**: No reset (one-time purchase, 5 videos total)

### Video Auto-Deletion Logic
Videos are automatically deleted based on user's plan:

| Plan | Storage Duration | expires_at calculation |
|------|------------------|------------------------|
| Free | 1 jour | created_at + 1 day |
| Pack Pro | 7 jours | created_at + 7 days |
| Business | 30 jours | created_at + 30 days |

**Implementation**:
- Edge function `cleanup-expired-videos` runs daily via CRON
- Deletes videos where `expires_at < NOW()`
- Also removes files from Supabase Storage bucket

### Watermark Logic
- **Free plan**: Watermark forced ON, cannot be disabled
- **Pro/Business**: Watermark optional (can be toggled off)
- Checkbox in `VideoConfigPanel.tsx` disabled for free users

## Legal Pages
- `/mentions-legales` - Legal mentions with tabs (Mentions, CGU, Privacy)
- `/mentions-legales?tab=cgu` - Terms of service
- `/mentions-legales?tab=confidentialite` - Privacy policy (GDPR compliant)

## Blog System
- **Blog Page**: `/blog` - List of all articles
- **Article Page**: `/blog/:slug` - Individual article with VintDress-inspired design
- **Data**: `src/data/blogPosts.ts` - 6 SEO-optimized articles
- **Components**:
  - `src/components/BlogSection.tsx` - Homepage blog preview (4 articles)
  - `src/pages/BlogPage.tsx` - Full blog listing
  - `src/pages/BlogArticlePage.tsx` - Article detail with hero, FAQ accordions, CTA

## SEO & Analytics
- **Sitemap**: `public/sitemap.xml` - 12 URLs indexed
- **Robots**: `public/robots.txt` - Crawling rules
- **Google Tag Manager**: GTM-KJJ7364T
- **Google Analytics 4**: G-JCXWT2EF12
- **Microsoft Clarity**: v0qbq57yke
- **JSON-LD**: WebApplication and Organization schemas in index.html

## Video Storage
Videos are uploaded to Supabase Storage bucket `videos`:
- Path: `{user_id}/{video_id}.mp4`
- Thumbnail: `{user_id}/{video_id}-thumb.jpg`
- Public read access for sharing
- User-scoped write/delete access

## Stripe Integration

### Edge Functions (`/supabase/functions`)
- `create-checkout-session` - Creates Stripe checkout session for subscriptions
- `stripe-webhook` - Handles Stripe events (subscription updates, payments)
- `customer-portal` - Opens Stripe customer portal for subscription management

### Stripe Configuration
- **Pack Pro**: `price_1SpoqGK7Yon7d585SyjAeqea` (2,99€ one-time, 5 videos)
- **Business Plan**: `price_1SpoqrK7Yon7d585I02XU0ya` (5,99€/month, 15 videos/month)
- **Webhook URL**: `https://mkzhgzvtvsezqlpesdgc.supabase.co/functions/v1/stripe-webhook`

### Supabase Secrets
```bash
supabase secrets set STRIPE_SECRET_KEY=sk_live_xxxxx
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### Frontend Hook
- `src/hooks/useStripe.ts` - Hook for checkout and customer portal

### Database Fields (Stripe)
- `profiles.stripe_customer_id` - Stripe customer ID
- `subscriptions.stripe_subscription_id` - Stripe subscription ID
- `subscriptions.stripe_customer_id` - Stripe customer ID
- `subscriptions.current_period_start` - Billing period start
- `subscriptions.current_period_end` - Billing period end
- `subscriptions.cancel_at_period_end` - Cancellation flag

### Deploy Edge Functions
```bash
supabase functions deploy create-checkout-session --no-verify-jwt
supabase functions deploy customer-portal --no-verify-jwt
supabase functions deploy stripe-webhook --no-verify-jwt
supabase functions deploy cleanup-expired-videos --no-verify-jwt
```

### CRON Job for Video Cleanup
Configure in Supabase Dashboard > Database > Extensions > pg_cron:
```sql
-- Run daily at 3:00 AM UTC
SELECT cron.schedule(
  'cleanup-expired-videos',
  '0 3 * * *',
  $$
  SELECT net.http_post(
    url := 'https://mkzhgzvtvsezqlpesdgc.supabase.co/functions/v1/cleanup-expired-videos',
    headers := '{"Authorization": "Bearer <service_role_key>"}'::jsonb
  );
  $$
);
```

## Deployment Checklist (Pricing V2 Migration)

### 1. Stripe Dashboard
- [ ] Create new product "Pack Pro" (one-time, 2,99€)
- [ ] Create new product "Business" (subscription, 5,99€/month)
- [ ] Copy new price IDs and update in `frontend/src/hooks/useStripe.ts`
- [ ] Archive old prices (3.99€ Pro, 9.99€ Business)

### 2. Supabase Database
```bash
# Push migration (adds plan_type, max_articles, storage_days, expires_at)
supabase db push
```

### 3. Deploy Edge Functions
```bash
supabase functions deploy create-checkout-session --no-verify-jwt
supabase functions deploy stripe-webhook --no-verify-jwt
supabase functions deploy cleanup-expired-videos --no-verify-jwt
```

### 4. Configure CRON Job
In Supabase Dashboard > Database > Extensions > pg_cron, enable pg_cron and pg_net extensions, then run:
```sql
SELECT cron.schedule(
  'cleanup-expired-videos',
  '0 3 * * *',
  $$
  SELECT net.http_post(
    url := 'https://mkzhgzvtvsezqlpesdgc.supabase.co/functions/v1/cleanup-expired-videos',
    headers := '{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
  );
  $$
);
```

### 5. Deploy Frontend
Redeploy frontend via Coolify to apply UI changes:
- New pricing display (2,99€ / 5,99€)
- Video expiration badges in AccountPage
- Updated FAQ answers

### 6. Test the Migration
- [ ] Test Pack Pro purchase (one-time payment)
- [ ] Test Business subscription
- [ ] Verify videos show expiration countdown
- [ ] Verify expired videos are deleted by cleanup function
