# VintBoost - Vue d'Ensemble du Projet

## 🎯 Concept

VintBoost est un SaaS qui permet aux vendeurs Vinted de générer automatiquement du contenu vidéo court (15-60s) pour promouvoir leur vestiaire sur TikTok et Instagram.

## 🎨 Design

**Style**: Neo-Brutalism
- Couleurs vives et contrastées
- Bordures épaisses noires (4px)
- Ombres portées sans blur
- Typographie bold (Space Grotesk + Inter)
- Inspiration: vintdress.com (mais couleurs différentes)

**Palette**:
- 🟣 Electric Purple (primaire)
- 💛 Cyber Yellow (accent)
- 💗 Hot Pink (CTA)
- 💚 Mint Green (success)

## 🛠️ Stack Technique

### Frontend
- React 18 + TypeScript + Vite
- TailwindCSS (custom neo-brutalism)
- @dnd-kit (drag & drop)
- React Query (cache)
- Supabase JS Client (auth)

### Backend
- Node.js + Express (MVC architecture)
- FFmpeg (génération vidéo)
- Puppeteer (scraping Vinted)
- Bull + Redis (queue async)
- Supabase (DB + Storage + Auth)

### Paiements
- Stripe Checkout
- Webhooks → Supabase
- Plans: Free (1 vidéo/mois) + Pro (9.99€/mois)

### Infrastructure
- Coolify (VPS hosting)
- Supabase (BaaS)
- Cloudflare (CDN, optionnel)

## 🔄 Workflow Utilisateur

1. **Authentification** → Signup/Login Supabase
2. **Scraping** → Coller URL Vinted → Récupération articles
3. **Sélection** → Choisir jusqu'à 10 articles + drag & drop ordre
4. **Configuration** → Durée (15-60s) + musique + titre
5. **Génération** → FFmpeg crée vidéo (async)
6. **Téléchargement** → MP4 prêt à publier

## 📊 Fonctionnalités

### MVP (Phase Test Local)
- ✅ Scraping vestiaire Vinted
- ✅ Sélection multiple articles (10 max)
- ✅ Drag & drop pour réorganiser
- ✅ Filtres (marque, prix, statut)
- ✅ Configuration vidéo (durée, musique)
- ✅ Génération FFmpeg
- ✅ Preview miniatures
- ✅ Téléchargement MP4

### V1 (Après intégration Supabase/Stripe)
- Auth complète (email + OAuth)
- Dashboard utilisateur
- Historique vidéos
- Gestion abonnement Stripe
- Limites plan Free/Pro
- Notifications email
- Analytics de base

### V2 (Future)
- Plusieurs templates vidéo
- Upload musique custom
- Édition texte/couleurs
- Stats vidéos (vues, likes)
- Partage direct TikTok/Instagram
- Mode collaboratif (équipes)

## 📁 Structure du Projet

```
vintboost/
├── claude/                      # Documentation
│   ├── PROJECT-OVERVIEW.md      # Ce fichier
│   ├── STACK.md                 # Stack + design system
│   ├── PLAN-TEST-LOCAL.md       # Plan phase test local
│   └── README.md                # Instructions générales
│
├── api-server/                  # Backend
│   ├── src/
│   │   ├── config/              # Configuration
│   │   ├── middlewares/         # Auth, CORS, etc.
│   │   ├── services/            # Logique métier
│   │   │   ├── puppeteer.service.js
│   │   │   ├── vinted.service.js
│   │   │   ├── scraper.service.js
│   │   │   └── video.service.js    # NOUVEAU
│   │   ├── controllers/         # Contrôleurs HTTP
│   │   ├── routes/              # Routes API
│   │   └── utils/               # Helpers
│   │       ├── ffmpeg.utils.js     # NOUVEAU
│   │       └── file.utils.js       # NOUVEAU
│   ├── assets/                  # Assets vidéo
│   │   ├── music/               # Musiques libres
│   │   ├── fonts/               # Fonts FFmpeg
│   │   └── watermark.png
│   ├── temp/                    # Fichiers temporaires
│   ├── output/                  # Vidéos générées
│   ├── server.js
│   └── package.json
│
└── frontend/                    # Frontend
    ├── src/
    │   ├── components/
    │   │   ├── ArticleCard.tsx
    │   │   ├── ArticleGrid.tsx
    │   │   ├── SelectedArticles.tsx   # NOUVEAU
    │   │   ├── VideoConfig.tsx        # NOUVEAU
    │   │   ├── VideoPreview.tsx       # NOUVEAU
    │   │   └── VideoPlayer.tsx        # NOUVEAU
    │   ├── hooks/
    │   │   ├── useVintedScraper.ts
    │   │   ├── useArticleSelection.ts # NOUVEAU
    │   │   ├── useVideoGeneration.ts  # NOUVEAU
    │   │   └── useVideoConfig.ts      # NOUVEAU
    │   ├── pages/
    │   │   ├── ScrapePage.tsx
    │   │   ├── SelectionPage.tsx      # NOUVEAU
    │   │   ├── ConfigPage.tsx         # NOUVEAU
    │   │   └── ResultPage.tsx         # NOUVEAU
    │   └── types/
    │       └── vinted.ts
    ├── tailwind.config.js       # Config neo-brutalism
    └── package.json
```

## 📝 Décisions Techniques Validées

### Génération Vidéo
- **Solution**: FFmpeg (server-side)
- **Template**: 1 template simple (carousel)
- **Durée**: Configurable par user (15-60s)
- **Musique**: Bibliothèque libre de droits
- **Images**: Hotlink direct (pas de stockage)

### Sélection Articles
- Ordre personnalisé (drag & drop)
- Filtres (marque, prix, statut)
- Sélection auto (top prices)
- Preview temps réel

### Base de Données
- Tables: users, profiles, subscriptions, wardrobes, videos, music_library
- RLS policies actives
- Real-time pour statut génération

### Paiements
- Stripe Checkout (hosted)
- 2 plans: Free (1/mois + watermark) / Pro (illimité + sans watermark)
- Webhooks pour sync Supabase

## 🚀 Roadmap

### Phase 1: Test Local (5 jours) ← EN COURS
- Setup FFmpeg + dépendances
- Service génération vidéo
- Interface sélection + config
- Tests & validation

### Phase 2: Intégration Supabase (1 semaine)
- Setup tables + RLS
- Auth frontend
- Sauvegarde wardrobes/videos
- Real-time updates

### Phase 3: Intégration Stripe (1 semaine)
- Setup produits Stripe
- Checkout flow
- Webhooks
- Gestion limites

### Phase 4: Déploiement (1 semaine)
- Coolify setup
- CI/CD GitHub Actions
- Monitoring Sentry
- Analytics

### Phase 5: Polish & Launch (1 semaine)
- Landing page optimisée
- Onboarding UX
- Documentation
- Lancement beta

**Durée totale estimée**: 5-6 semaines

## 💰 Modèle Économique

### Coûts Mensuels
- VPS Coolify: ~10€
- Supabase: Gratuit (puis ~25€ si scale)
- Stripe: 0€ + 1.4% + 0.25€/transaction
- Domain: ~10€/an
- **Total**: ~15-20€/mois

### Prix
- **Free**: 0€ (1 vidéo/mois, watermark)
- **Pro**: 9.99€/mois (illimité, sans watermark)

### Objectifs
- 100 users → ~30 Pro (30%) → ~300€/mois
- 500 users → ~150 Pro (30%) → ~1500€/mois
- 1000 users → ~300 Pro (30%) → ~3000€/mois

**Break-even**: ~5-10 utilisateurs Pro

## 🎯 Métriques de Succès

### Acquisition
- Inscriptions/semaine
- Taux de conversion signup
- Source traffic (organic, paid, referral)

### Engagement
- Vidéos générées/user
- Taux de retour (J7, J30)
- Temps moyen sur le site

### Conversion
- Free → Pro conversion rate
- Churn rate
- LTV (Customer Lifetime Value)

### Technique
- Temps génération vidéo
- Taux d'erreur scraping
- Uptime API

## 📞 Support & Communauté

- **Email**: support@vintboost.com
- **Discord**: Communauté users (feedback)
- **GitHub**: Issues techniques
- **Twitter/X**: Annonces + tips

## 🔐 Sécurité

- Auth Supabase (bcrypt + JWT)
- RLS sur toutes les tables
- Rate limiting API
- HTTPS obligatoire
- Validation inputs (Joi/Zod)
- Sanitization URLs Vinted
- Cleanup fichiers temp
- Watermark plan Free (protection)

## ⚡ Performance

- Cache Redis (wardrobes)
- CDN pour assets statiques
- Lazy loading images
- Code splitting routes
- Virtual scrolling grilles
- FFmpeg preset optimisé
- Compression gzip
- Minification JS/CSS

## 🐛 Monitoring

- Sentry (errors frontend + backend)
- Posthog/Plausible (analytics)
- Logs structurés (Winston)
- Alerts email (downtime, errors)
- Dashboard Supabase (DB perf)

## 📚 Documentation

- README.md (setup + commandes)
- STACK.md (tech + design)
- PLAN-TEST-LOCAL.md (phase actuelle)
- API docs (Swagger, à venir)
- User guide (help center, à venir)
