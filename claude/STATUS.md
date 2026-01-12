# VintBoost - État du Projet

**Dernière mise à jour**: 11 janvier 2026

---

## ✅ Complété

### Infrastructure de base
- [x] Architecture backend MVC propre
- [x] Structure frontend React + TypeScript
- [x] Configuration TailwindCSS avec design system neo-brutalism
- [x] Palette de couleurs VintBoost définie
- [x] Fonts Google (Space Grotesk + Inter) intégrées
- [x] Composants CSS utilities (btn-primary, card, input, badge)
- [x] Service de scraping Vinted (API + fallback HTML)
- [x] Détection et extraction des marques (fix appliqué)

### Documentation
- [x] PROJECT-OVERVIEW.md (vue d'ensemble)
- [x] STACK.md (stack technique + design system)
- [x] PLAN-TEST-LOCAL.md (plan détaillé phase 1)
- [x] README.md (instructions setup)

### Backend
- [x] `src/config/` - Configuration centralisée
- [x] `src/middlewares/` - Auth + CORS
- [x] `src/services/puppeteer.service.js` - Gestion Puppeteer
- [x] `src/services/vinted.service.js` - API Vinted + sessions
- [x] `src/services/scraper.service.js` - Orchestration scraping
- [x] `src/controllers/scraper.controller.js` - Contrôleur HTTP
- [x] `src/routes/scraper.routes.js` - Routes scraping
- [x] `src/app.js` - Application Express
- [x] `server.js` - Point d'entrée

### Frontend
- [x] TailwindCSS config avec couleurs VintBoost
- [x] Composants de base (ArticleCard, ArticleGrid, VintedScraperPage)
- [x] Hook useVintedScraper (scraping)
- [x] Types TypeScript (VintedItem)

---

## 🚧 En Cours - Phase 1: Test Local

### Backend - Service Vidéo
- [ ] Installer FFmpeg sur machine locale
- [ ] `src/services/video.service.js` - Service génération vidéo
- [ ] `src/utils/ffmpeg.utils.js` - Helpers FFmpeg
- [ ] `src/utils/file.utils.js` - Gestion fichiers temp
- [ ] `src/controllers/video.controller.js` - Contrôleur vidéo
- [ ] `src/routes/video.routes.js` - Routes vidéo
- [ ] Créer dossiers: `temp/`, `output/`, `assets/music/`, `assets/fonts/`
- [ ] Télécharger 3-5 musiques libres de droits
- [ ] Télécharger fonts TTF (Space Grotesk + Inter)
- [ ] Créer watermark.png (logo VintBoost)

### Frontend - Sélection & Config
- [ ] Installer @dnd-kit/core + @dnd-kit/sortable
- [ ] Hook `useArticleSelection.ts` - Gestion sélection
- [ ] Hook `useVideoGeneration.ts` - Génération vidéo
- [ ] Hook `useVideoConfig.ts` - Configuration vidéo
- [ ] Composant `SelectedArticles.tsx` - Liste drag & drop
- [ ] Composant `VideoConfig.tsx` - Configuration (durée, musique)
- [ ] Composant `VideoPreview.tsx` - Preview miniatures
- [ ] Composant `VideoPlayer.tsx` - Player vidéo
- [ ] Page `SelectionPage.tsx` - Workflow complet
- [ ] Page `ResultPage.tsx` - Résultat + téléchargement

### Tests
- [ ] Test scraping complet
- [ ] Test sélection multiple + drag & drop
- [ ] Test génération vidéo (30s, 5 articles)
- [ ] Test qualité vidéo (résolution, texte, musique)
- [ ] Test téléchargement MP4
- [ ] Test cleanup fichiers temp

---

## 📅 Prochaines Phases

### Phase 2: Intégration Supabase (après test local)
- [ ] Créer projet Supabase
- [ ] Setup tables (users, profiles, subscriptions, wardrobes, videos)
- [ ] Configurer RLS policies
- [ ] Intégrer Supabase Auth frontend
- [ ] Sauvegarder wardrobes en DB
- [ ] Upload vidéos vers Supabase Storage
- [ ] Real-time updates statut génération

### Phase 3: Intégration Stripe (après Supabase)
- [ ] Créer compte Stripe
- [ ] Configurer produits (Free + Pro)
- [ ] Implémenter Checkout flow
- [ ] Setup webhooks Stripe → Supabase
- [ ] Middleware limites (1 vidéo/mois Free)
- [ ] Page gestion abonnement

### Phase 4: Déploiement (après Stripe)
- [ ] Setup Coolify
- [ ] Configurer variables d'environnement
- [ ] Installer FFmpeg sur VPS
- [ ] CI/CD GitHub Actions
- [ ] Monitoring Sentry
- [ ] Analytics Posthog/Plausible

### Phase 5: Polish & Launch (après déploiement)
- [ ] Landing page optimisée
- [ ] Onboarding UX
- [ ] Help center / docs
- [ ] Email notifications (Resend/SendGrid)
- [ ] Beta testing
- [ ] Lancement public

---

## 🎯 Focus Immédiat

**Objectif**: Valider la génération vidéo en local avant d'intégrer Supabase/Stripe

**Prochaines actions**:
1. Installer FFmpeg
2. Créer service de génération vidéo (FFmpeg)
3. Créer interface sélection + drag & drop
4. Tester génération avec 5 articles
5. Valider qualité vidéo générée

**Durée estimée**: 3-5 jours

---

## 🛠️ Stack Actuelle

### Frontend
- React 18.2.0
- TypeScript 5.3.0
- Vite 5.0.0
- TailwindCSS 3.4.0 (config neo-brutalism)
- Lucide React (icons, à installer)
- @dnd-kit (à installer)
- React Query (à installer)

### Backend
- Node.js 18+
- Express.js 4.18.2
- Puppeteer 21.0.0
- CORS 2.8.5
- FFmpeg (à installer)
- fluent-ffmpeg (à installer)
- Bull + Redis (à installer, optionnel)

### À venir
- Supabase (DB + Auth + Storage)
- Stripe (paiements)
- Sentry (monitoring)
- Posthog (analytics)

---

## 📊 Métriques Projet

- **Durée totale**: 5 jours (depuis début)
- **Phase actuelle**: Phase 1 - Test Local
- **Progression**: 40% (infrastructure + docs)
- **Lignes de code**: ~2000 lignes
- **Fichiers**: ~25 fichiers (hors node_modules)
- **Dépendances**: 13 packages npm

---

## 🐛 Issues Connus

### Résolus ✅
- Brand extraction ne fonctionnait pas → Fix: `item.brand` est une string, pas un objet
- Network timeout issues → Normal, problème temporaire de connectivité

### En cours
- Aucun (structure de base complète)

### À surveiller
- Performance FFmpeg (temps de génération)
- Taille des vidéos générées
- Gestion mémoire avec plusieurs générations parallèles

---

## 💡 Notes & Décisions

### Design
- Style neo-brutalism validé
- 4 couleurs principales (purple, yellow, pink, mint)
- Fonts: Space Grotesk (titres) + Inter (corps)
- Ombres portées sans blur
- Bordures noires épaisses (4px)

### Vidéo
- Template unique pour MVP (carousel simple)
- Durée configurable (15-60s)
- Musique libre de droits (3-5 tracks)
- Images en hotlink (pas de stockage local)
- Watermark pour plan Free

### Sélection
- Max 10 articles par vidéo
- Drag & drop pour ordre
- Filtres: marque, prix, statut
- Preview miniatures en temps réel
- Auto-sélection top prices (optionnel)

---

## 📞 Contact & Support

Pour toute question sur le projet:
- Email: [à définir]
- Discord: [à créer]
- GitHub: [à créer repo]

---

**Projet initialisé**: 10 janvier 2026
**Dernière restructuration**: 11 janvier 2026
**Prochaine milestone**: Validation génération vidéo locale
