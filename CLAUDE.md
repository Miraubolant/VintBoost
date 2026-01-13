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
- `src/pages/MentionsLegalesPage.tsx` - Legal mentions
- `src/pages/CGUPage.tsx` - Terms of service
- `src/pages/ConfidentialitePage.tsx` - Privacy policy
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
| Plan | Videos/month | Price | Features |
|------|--------------|-------|----------|
| Free | 1 | 0€ | Basic templates, Watermark |
| Pro | 15 | 3.99€ | All templates, No watermark, 1080p |
| Business | 50 | 12.99€ | All templates, No watermark, 4K |

## Auth & Credits Protection

### Scraping Protection
- User must be logged in to scrape wardrobe (shows AuthModal if not)
- User must have credits to scrape (shows NoCreditModal if no credits)
- Protection implemented in `VintedScraperPage.tsx`

### Watermark Logic
- **Free plan**: Watermark forced ON, cannot be disabled
- **Pro/Business**: Watermark optional (can be toggled off)
- Checkbox in `VideoConfigPanel.tsx` disabled for free users

## Legal Pages
- `/mentions-legales` - Legal mentions
- `/cgu` - Terms of service (CGU)
- `/confidentialite` - Privacy policy (GDPR compliant)

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
- **Pro Plan**: `price_1Sow53K7Yon7d585HdHNbLgS` (3.99€/month)
- **Business Plan**: `price_1Sow6DK7Yon7d585RsV1cflP` (12.99€/month)
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
```
