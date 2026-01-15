# Plan de Mise à Jour des Tarifs VintBoost

## Résumé des Nouveaux Tarifs

### Plan Gratuit (Free)
- **Prix**: 0€
- **Vidéos**: 1 vidéo
- **Templates**: 1 (Classic uniquement)
- **Watermark**: Obligatoire
- **Sauvegarde vidéos**: 1 jour
- **Export**: 1080p
- **Articles max**: 5
- **Note**: Retirer la mention "paiement unique"

### Pack Pro (ONE-TIME - Plus d'abonnement)
- **Prix**: 2,99€ (achat unique)
- **Vidéos**: 5 vidéos incluses
- **Templates**: Tous (3)
- **Watermark**: Sans watermark
- **Sauvegarde vidéos**: 7 jours
- **Export**: 1080p HD
- **Articles max**: 10

### Abonnement Business (RÉCURRENT)
- **Prix**: 5,99€/mois
- **Vidéos**: 15 vidéos/mois
- **Templates**: Tous (3)
- **Watermark**: Sans watermark
- **Sauvegarde vidéos**: 30 jours
- **Export**: 4K
- **Articles max**: 20

---

## Fichiers à Modifier

### 1. Frontend - Section Tarifs Homepage
- [ ] `frontend/src/components/PricingSection.tsx`
  - Mettre à jour les prix (2,99€ et 5,99€)
  - Changer "Pro" de abonnement à pack unique
  - Ajouter les nouvelles features (sauvegarde, articles max)
  - Retirer "paiement unique" du plan gratuit
  - Modifier les labels (Pack vs Abonnement)

### 2. Frontend - Modal Tarifs
- [ ] `frontend/src/components/PricingModal.tsx` (si existe)
  - Mêmes modifications que PricingSection

### 3. Frontend - Page FAQ
- [ ] `frontend/src/pages/FAQPage.tsx`
  - Mettre à jour les références aux tarifs
  - Modifier les explications sur les packs/abonnements

### 4. Frontend - Articles Blog
- [ ] `frontend/src/data/blogPosts.ts`
  - Rechercher toutes les mentions de prix
  - Mettre à jour les références aux plans
  - Vérifier la cohérence des features mentionnées

### 5. Frontend - Page Compte
- [ ] `frontend/src/pages/AccountPage.tsx`
  - Afficher la durée de sauvegarde restante
  - Indiquer le type de plan (pack vs abonnement)

### 6. Frontend - Hooks & Types
- [ ] `frontend/src/types/vinted.ts`
  - Ajouter les nouveaux champs (storage_days, max_articles)
- [ ] `frontend/src/hooks/useSubscription.ts`
  - Adapter la logique pour pack unique vs abonnement

### 7. Backend - Stripe Edge Functions
- [ ] `supabase/functions/create-checkout-session/index.ts`
  - Créer nouveau produit/prix pour Pack Pro (one-time)
  - Mettre à jour le prix Business (5,99€)
  - Adapter la logique payment_mode vs subscription

### 8. Backend - Webhook Stripe
- [ ] `supabase/functions/stripe-webhook/index.ts`
  - Gérer les paiements one-time pour Pack Pro
  - Adapter la logique de renouvellement

### 9. Database - Migrations
- [ ] `supabase/migrations/` - Nouvelle migration
  - Ajouter colonne `storage_days` à subscriptions
  - Ajouter colonne `max_articles` à subscriptions
  - Ajouter colonne `pack_type` ('one_time' | 'subscription')
  - Ajouter colonne `videos_expire_at` à user_videos

### 10. Backend - Nettoyage Automatique Vidéos
- [ ] `supabase/functions/cleanup-expired-videos/index.ts` (NOUVEAU)
  - Edge function pour supprimer les vidéos expirées
  - Logique basée sur le plan utilisateur:
    - Free: 1 jour
    - Pack Pro: 7 jours
    - Business: 30 jours
- [ ] Configurer un CRON job Supabase pour exécuter quotidiennement

### 11. Documentation
- [ ] `CLAUDE.md`
  - Mettre à jour la section "Subscription Plans"
  - Ajouter la nouvelle logique de suppression
  - Documenter les nouveaux champs DB

---

## Descriptions Stripe

### Pack Pro (One-time payment)
```
Nom: Pack Pro - 5 Vidéos
Prix: 2,99€ (paiement unique)
Description:
Pack de 5 vidéos promotionnelles pour Vinted.
- 5 vidéos HD incluses
- Tous les templates disponibles
- Sans watermark
- Export 1080p
- Jusqu'à 10 articles par vidéo
- Vidéos sauvegardées 7 jours
```

### Abonnement Business (Recurring)
```
Nom: Abonnement Business
Prix: 5,99€/mois
Description:
Abonnement mensuel pour vendeurs Vinted professionnels.
- 15 vidéos 4K par mois
- Tous les templates disponibles
- Sans watermark
- Export 4K haute qualité
- Jusqu'à 20 articles par vidéo
- Vidéos sauvegardées 30 jours
- Renouvellement automatique
```

---

## Logique de Suppression Automatique des Vidéos

### Règles
| Plan | Durée de sauvegarde | Suppression après |
|------|---------------------|-------------------|
| Free (aucun pack) | 1 jour | 24h après création |
| Pack Pro | 7 jours | 7 jours après création |
| Business | 30 jours | 30 jours après création |

### Implémentation

1. **À la création de vidéo** (`useVideoGeneration.ts`):
   - Calculer `expires_at` basé sur le plan actuel
   - Stocker dans `user_videos.expires_at`

2. **Edge Function de nettoyage** (CRON quotidien):
   ```sql
   -- Supprimer les vidéos expirées
   DELETE FROM user_videos
   WHERE expires_at < NOW();

   -- Supprimer les fichiers Storage correspondants
   ```

3. **Affichage frontend**:
   - Montrer "Expire dans X jours" sur chaque vidéo
   - Alerte quand expiration proche (< 24h)

---

## Ordre d'Exécution

### Phase 1: Base de données
1. [ ] Créer migration pour nouveaux champs
2. [ ] Appliquer migration sur Supabase

### Phase 2: Backend
3. [ ] Créer nouveaux produits/prix Stripe
4. [ ] Mettre à jour create-checkout-session
5. [ ] Mettre à jour stripe-webhook
6. [ ] Créer cleanup-expired-videos function
7. [ ] Configurer CRON job

### Phase 3: Frontend - Logique
8. [ ] Mettre à jour types TypeScript
9. [ ] Adapter useSubscription hook
10. [ ] Adapter useVideoGeneration (calcul expiration)

### Phase 4: Frontend - UI
11. [ ] Mettre à jour PricingSection
12. [ ] Mettre à jour PricingModal (si existe)
13. [ ] Mettre à jour FAQPage
14. [ ] Mettre à jour blogPosts.ts
15. [ ] Ajouter affichage expiration dans AccountPage

### Phase 5: Documentation & Tests
16. [ ] Mettre à jour CLAUDE.md
17. [ ] Tester flux complet Pack Pro
18. [ ] Tester flux complet Business
19. [ ] Tester suppression automatique
20. [ ] Déployer sur Coolify

---

## Points d'Attention

### Breaking Changes
- Les utilisateurs avec abonnement Pro actuel doivent être migrés
- Gérer la transition pack unique vs abonnement

### Stripe
- Créer NOUVEAU produit pour Pack Pro (ne pas modifier l'existant)
- Archiver l'ancien prix Pro
- Tester en mode test avant production

### UX
- Clarifier la différence pack unique vs abonnement
- Expliquer clairement la durée de sauvegarde
- Notifier les utilisateurs avant expiration

### Sécurité
- RLS policies pour la suppression
- Vérifier que seules les vidéos expirées sont supprimées
- Log des suppressions pour audit
