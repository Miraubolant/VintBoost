# VintBoost - Claude Code Configuration

## Project Overview
VintBoost is a video generator for Vinted sellers. Users paste their wardrobe URL, select articles, and generate promotional videos automatically.

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
- **RLS**: Enabled on all tables
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
- `src/components/BeforeAfterSection.tsx` - 5 steps tutorial
- `src/components/VintDressSection.tsx` - VintDress promo
- `src/pages/ResultatPage.tsx` - Video generation

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

### API Service
- **Domain**: api.vintboost.com
- **Dockerfile**: `api-server/Dockerfile`
- **Port**: 3000
- **Environment**:
  - `API_KEY=<your_api_key>`
  - `CORS_ORIGIN=https://vintboost.com`

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
| Plan | Videos/month | Price |
|------|--------------|-------|
| Free | 1 | 0€ |
| Pro | 15 | 9.99€ |
| Business | 50 | 24.99€ |
