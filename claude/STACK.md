# VintBoost - Stack Technique & Design System

## 🎨 Design System - Neo-Brutalism

### Palette de Couleurs Principales

```css
/* Couleur 1 - Electric Purple (Primaire) */
--vb-purple: #8B5CF6
--vb-purple-light: #A78BFA
--vb-purple-dark: #6D28D9

/* Couleur 2 - Cyber Yellow (Accent) */
--vb-yellow: #FCD34D
--vb-yellow-light: #FDE68A
--vb-yellow-dark: #F59E0B

/* Couleur 3 - Hot Pink (CTA) */
--vb-pink: #EC4899
--vb-pink-light: #F472B6
--vb-pink-dark: #BE185D

/* Couleur 4 - Mint Green (Success) */
--vb-mint: #34D399
--vb-mint-light: #6EE7B7
--vb-mint-dark: #059669

/* Neutres */
--vb-black: #0A0A0A
--vb-white: #FFFFFF
--vb-gray: #E5E7EB
```

### Style Neo-Brutalism

- **Bordures**: 4px solid black sur tous les composants
- **Ombres**: `8px 8px 0px 0px #0A0A0A` (pas de blur)
- **Typographie**:
  - Titres: Space Grotesk (bold, 700-900)
  - Corps: Inter (400-600)
- **Boutons**: Hauteur 56px, border 4px, ombre décalée
- **Cards**: Background coloré, border noir, ombre portée
- **Hover**: Translation -4px -4px + ombre 12px 12px
- **Transitions**: 150ms ease-out

### Exemples de Composants

```jsx
// Bouton Principal
<button className="
  bg-vb-purple text-white font-bold px-8 py-4
  border-4 border-black
  shadow-[8px_8px_0px_0px_#0A0A0A]
  hover:translate-x-[-4px] hover:translate-y-[-4px]
  hover:shadow-[12px_12px_0px_0px_#0A0A0A]
  transition-all duration-150
">
  Générer ma vidéo
</button>

// Card Article
<div className="
  bg-white border-4 border-black
  shadow-[8px_8px_0px_0px_#0A0A0A]
  p-6 rounded-none
">
  <img className="border-4 border-black" />
  <h3 className="font-bold text-2xl">Article Title</h3>
  <span className="bg-vb-yellow px-4 py-2 border-2 border-black">
    29.99€
  </span>
</div>
```

## 🏗️ Stack Technique

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS (custom config neo-brutalism)
- **Fonts**: Space Grotesk, Inter (Google Fonts)
- **State Management**: React Query + Context API
- **Drag & Drop**: @dnd-kit/core
- **Forms**: React Hook Form + Zod
- **Auth**: Supabase JS Client
- **Video Preview**: Canvas API
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Architecture**: MVC (Services, Controllers, Routes)
- **Video Generation**: FFmpeg + fluent-ffmpeg
- **Scraping**: Puppeteer
- **Job Queue**: Bull + Redis (pour génération vidéo async)
- **File Upload**: Multer (musique custom)
- **Validation**: Joi

### Base de Données & Auth
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage (vidéos + assets)
- **Auth**: Supabase Auth (email/password + OAuth)
- **Real-time**: Supabase Realtime (statut génération)

### Paiements
- **Provider**: Stripe
- **Mode**: Checkout Sessions
- **Webhooks**: Stripe → Supabase (via API)
- **Plans**: Free (1 vidéo/mois) + Pro (9.99€/mois)

### Infrastructure
- **Hosting**: Coolify (VPS)
- **FFmpeg**: Installé sur serveur
- **Redis**: Pour Bull Queue
- **Domain**: Custom domain + SSL
- **Monitoring**: Sentry (errors) + Posthog (analytics)

## 🔄 Workflow Utilisateur

### 1. Authentification
```
Landing Page (hero neo-brutalism)
  ↓
Signup/Login (Supabase Auth)
  ↓
Dashboard
```

### 2. Scraping Vestiaire
```
Input URL Vinted
  ↓
Validation URL → POST /api/scrape-wardrobe
  ↓
Puppeteer récupère articles via API Vinted
  ↓
Sauvegarde dans table "wardrobes" (Supabase)
  ↓
Affichage grille d'articles
```

### 3. Sélection d'Articles
```
Grille d'articles (cards neo-brutalism)
  ↓
Filtres: marque, prix, statut
  ↓
Sélection: click pour ajouter (max 10 articles)
  ↓
Drag & Drop pour réorganiser l'ordre
  ↓
Preview miniatures en temps réel (Canvas)
  ↓
Bouton "Configurer ma vidéo"
```

### 4. Configuration Vidéo
```
Modal/Page configuration:
  - Durée vidéo (15s, 30s, 45s, 60s) → slider
  - Template (1 seul pour MVP)
  - Musique: liste de tracks libres de droits
  - Titre vidéo

Bouton "Générer"
  ↓
Vérification plan:
  - Free: 1/1 utilisée → Upgrade modal
  - Pro: Génération autorisée
```

### 5. Génération Vidéo
```
POST /api/generate-video
  ↓
Création job Bull Queue
  ↓
Worker process:
  1. Download images (hotlink Vinted)
  2. FFmpeg génère vidéo
     - Carousel d'images (transition fade)
     - Overlay texte (titre, prix, marque)
     - Musique de fond
     - Watermark si plan Free
  3. Upload vers Supabase Storage
  4. Update table "videos" (status: completed)
  ↓
Real-time update (Supabase) → Frontend
  ↓
Notification: "Vidéo prête!"
```

### 6. Téléchargement & Partage
```
Page "Mes Vidéos"
  ↓
Liste des vidéos générées (thumbnail, date, titre)
  ↓
Click → Modale:
  - Player vidéo
  - Bouton "Télécharger MP4"
  - Bouton "Partager" (copy link)
  - Stats (vues si intégré)
```

## 📦 Structure Base de Données

```sql
-- users (géré par Supabase Auth)

-- profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  videos_generated_this_month INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan TEXT CHECK (plan IN ('free', 'pro')) DEFAULT 'free',
  status TEXT CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')) DEFAULT 'active',
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- wardrobes
CREATE TABLE wardrobes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  vinted_url TEXT NOT NULL,
  vinted_user_id TEXT NOT NULL,
  username TEXT,
  total_items INTEGER,
  data JSONB NOT NULL, -- tous les articles
  scraped_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- videos
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  wardrobe_id UUID REFERENCES wardrobes,
  title TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  template TEXT DEFAULT 'carousel-v1',
  selected_items JSONB NOT NULL, -- articles sélectionnés
  duration INTEGER, -- en secondes
  music_track TEXT,
  has_watermark BOOLEAN DEFAULT TRUE,
  status TEXT CHECK (status IN ('queued', 'processing', 'completed', 'failed')) DEFAULT 'queued',
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- music_library (bibliothèque musiques libres)
CREATE TABLE music_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  artist TEXT,
  file_url TEXT NOT NULL,
  duration INTEGER,
  genre TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🔒 Row Level Security (RLS)

```sql
-- profiles: users can only read/update their own
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);

-- subscriptions: users can only view their own
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);

-- wardrobes: users can CRUD their own
ALTER TABLE wardrobes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own wardrobes" ON wardrobes FOR ALL USING (auth.uid() = user_id);

-- videos: users can manage their own
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own videos" ON videos FOR ALL USING (auth.uid() = user_id);

-- music_library: tous peuvent lire
ALTER TABLE music_library ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view music library" ON music_library FOR SELECT USING (is_active = TRUE);
```

## 🎵 Musiques Libres de Droits

### Sources
1. **YouTube Audio Library** (téléchargement manuel)
2. **Free Music Archive** (CC BY)
3. **Incompetech** (Kevin MacLeod)

### Tracks suggérées (15-60s loops)
- Upbeat Pop (énergique)
- Chill Vibes (décontracté)
- Electronic Beat (moderne)
- Indie Folk (authentique)

### Stockage
- Supabase Storage bucket: `music-library/`
- Format: MP3, 128kbps, mono (léger)
- Durée: 60-90s loops

## 📱 Pages & Routes

### Public
- `/` - Landing page
- `/login` - Connexion
- `/signup` - Inscription
- `/pricing` - Plans & tarifs

### Protected (auth required)
- `/dashboard` - Dashboard principal
- `/scrape` - Scraper un vestiaire
- `/wardrobe/:id` - Détail vestiaire + sélection
- `/generate/:wardrobeId` - Configuration vidéo
- `/videos` - Liste mes vidéos
- `/video/:id` - Détail vidéo + download
- `/settings` - Paramètres compte
- `/billing` - Gestion abonnement

### API Routes
- `POST /api/scrape-wardrobe` - Scrape
- `POST /api/generate-video` - Générer
- `GET /api/videos` - Liste vidéos user
- `GET /api/video/:id` - Détail vidéo
- `DELETE /api/video/:id` - Supprimer vidéo
- `POST /api/stripe/checkout` - Create checkout session
- `POST /api/stripe/webhook` - Stripe webhooks
- `POST /api/stripe/portal` - Customer portal

## 🎬 Template Vidéo "Carousel V1"

### Spécifications Techniques
- **Résolution**: 1080x1920 (9:16)
- **FPS**: 30
- **Codec**: H.264
- **Durée**: Configurable (15-60s)
- **Transitions**: Fade (0.5s)

### Structure
```
[0-2s] Intro
  - Fond coloré (purple gradient)
  - Texte: "@username sur Vinted"
  - Logo/watermark

[2s-fin] Carousel articles
  Pour chaque article (durée/nb_articles):
    - Image plein écran (fit cover)
    - Overlay gradient bottom
    - Texte: Titre (top)
    - Texte: Marque (middle)
    - Badge prix (bottom-right, fond yellow)
    - Transition fade vers suivant

[dernière 1s] Outro
  - Texte: "Retrouvez-moi sur Vinted"
  - Lien profil
```

### FFmpeg Pipeline
```javascript
// Pseudo-code
for (article of selectedArticles) {
  // 1. Créer overlay texte
  ffmpeg.input(article.imageUrl)
    .complexFilter([
      // Fond image
      'scale=1080:1920:force_original_aspect_ratio=increase',
      'crop=1080:1920',
      // Gradient overlay
      'gradient=bottom',
      // Texte titre
      `drawtext=text='${article.title}':fontsize=60:fontcolor=white`,
      // Texte marque
      `drawtext=text='${article.brand}':fontsize=40:fontcolor=#FCD34D`,
      // Badge prix
      `drawtext=text='${article.price}€':fontsize=80:box=1:boxcolor=#FCD34D`
    ])
    .duration(clipDuration)
}

// 2. Concatener tous les clips
ffmpeg.concat(clips)
  .input(musicTrack)
  .audioFilters('volume=0.3')
  .outputOptions([
    '-c:v libx264',
    '-preset fast',
    '-crf 23',
    '-c:a aac',
    '-b:a 128k'
  ])
  .output('final-video.mp4')
```

## 🚀 Performance & Optimisations

### Frontend
- Code splitting par route
- Lazy loading images (react-lazy-load-image)
- Debounce sur filtres
- Virtual scrolling pour grilles (react-window)

### Backend
- Bull Queue pour vidéos (async)
- Cache Redis (wardrobes scrapés)
- Rate limiting (express-rate-limit)
- Compression gzip
- CDN Cloudflare pour assets

### Vidéo
- Preset FFmpeg "fast" (compromis qualité/vitesse)
- CRF 23 (bonne qualité, taille raisonnable)
- Résolution fixe 1080x1920
- Suppression fichiers temp après upload

## 📊 Limites & Quotas

### Plan Free
- 1 vidéo/mois
- Watermark obligatoire
- Max 5 articles par vidéo
- Durée max 30s

### Plan Pro (9.99€/mois)
- Vidéos illimitées
- Sans watermark
- Max 10 articles par vidéo
- Durée max 60s
- Priority queue (génération plus rapide)
