# Plan de Redesign - Interface de Creation Video VintBoost

## 1. Resume des Specifications

### Layout Desktop
- **3 colonnes** : Articles (gauche) | Configuration (centre) | Preview (droite)
- Largeur responsive avec breakpoints adaptes

### Layout Mobile
- **Liste verticale compacte** pour les articles
- Sections repliables pour economiser l'espace
- Bottom sheet pour la configuration video

### Workflow
- **3 etapes avec stepper** :
  1. Selection des articles
  2. Configuration video
  3. Generation et resultat
- Indicateur de progression visible

---

## 2. Specifications Detaillees par Section

### 2.1 Colonne Articles (Gauche)

#### Selection des articles
- **Grille avec checkboxes** pour selection multiple
- Miniatures carrees avec overlay de selection
- Prix affiche sur chaque miniature

#### Limites par plan
| Plan | Articles max |
|------|--------------|
| Free | 5 |
| Pro | 10 |
| Business | 20 |

#### Actions
- Bouton "Tout selectionner" (jusqu'a la limite du plan)
- Bouton "Deselectionner tout"
- Compteur d'articles selectionnes visible
- Drag & drop pour reordonner (optionnel)

---

### 2.2 Colonne Configuration (Centre)

#### Template
- **3 templates disponibles** :
  1. Classic (Free, Pro, Business)
  2. Modern (Pro, Business uniquement)
  3. Premium (Pro, Business uniquement)
- Apercu miniature de chaque template
- Templates bloques grisés avec icone cadenas pour Free

#### Duree
| Plan | Durees disponibles |
|------|-------------------|
| Free | 15s uniquement |
| Pro | 15s, 30s, 60s |
| Business | 15s, 30s, 60s |

- Boutons radio ou slider
- Durees bloquees grisées pour Free

#### Musique
- **Bibliotheque de 5-10 musiques libres de droits**
- Option "Sans musique"
- **Upload musique personnelle** (Premium - Pro/Business)
- Lecteur audio pour previsualisation
- Indication de la duree de chaque piste

#### Texte personnalise
- **Titre + pseudo vendeur** auto-rempli depuis le scraping
- **Affichage automatique des prix** sur chaque article
- **Texte d'accroche personnalisable** (ex: "SOLDES -50%", "LIVRAISON GRATUITE")
- Champ texte avec compteur de caracteres (max 50)

#### Options Premium (Section separee)
Section visuellement distincte avec badge "PRO" ou "BUSINESS" :

| Option | Free | Pro | Business |
|--------|------|-----|----------|
| Retirer watermark | Non | Oui | Oui |
| Durees 30s/60s | Non | Oui | Oui |
| Templates 2-3 | Non | Oui | Oui |
| Upload musique | Non | Oui | Oui |
| Resolution 4K | Non | Non | Oui |

- Checkbox "Sans watermark VintBoost" (desactivee pour Free)
- Message incitatif pour upgrader le plan

---

### 2.3 Colonne Preview (Droite)

#### Resume de configuration
- Recapitulatif visuel :
  - Nombre d'articles selectionnes
  - Template choisi (avec miniature)
  - Duree selectionnee
  - Musique choisie
  - Options actives (watermark, etc.)

#### Estimation
- Estimation du temps de generation
- Taille approximative du fichier

#### CTA Principal
- **Bouton "GENERER MA VIDEO"** prominent
- Style Neo-Brutalism (rouge #D64045)
- Desactive si :
  - Aucun article selectionne
  - Plus de credits disponibles

#### Indication credits
- Affichage clair : "Il vous reste X credits"
- Lien vers la page tarifs si credits epuises

---

## 3. Qualite Video

| Plan | Resolution |
|------|------------|
| Free | 1080p |
| Pro | 1080p |
| Business | 4K |

---

## 4. Watermark

| Plan | Watermark |
|------|-----------|
| Free | Obligatoire (logo VintBoost discret) |
| Pro | Optionnel (checkbox pour retirer) |
| Business | Optionnel (checkbox pour retirer) |

---

## 5. Ecran de Succes

Apres generation reussie :
- **Redirection vers page resultat dediee** (`/resultat/:videoId`)
- Lecteur video avec la video generee
- Bouton "Telecharger" (MP4)
- Bouton "Partager" (lien, reseaux sociaux)
- Bouton "Creer une nouvelle video"
- Statistiques : duree, taille, date

---

## 6. BUG CRITIQUE IDENTIFIE - Logique des Credits

### Probleme actuel
**`consumeVideoCredit()` est defini dans AuthContext mais n'est JAMAIS appele !**

#### Workflow actuel (BUGUE)
1. `VintedScraperPage.tsx:37` - Verifie `canGenerateVideo()` avant scraping
2. L'utilisateur accede a `ResultatPage`
3. L'utilisateur genere une video via `handleGenerateVideo()`
4. **Le credit n'est JAMAIS consomme** → Videos illimitees possibles !

#### Workflow correct (A IMPLEMENTER)
1. Verifier credits avant scraping (deja fait)
2. L'utilisateur configure et genere la video
3. **APRES succes de generation** → Appeler `consumeVideoCredit()`
4. Mettre a jour l'UI avec les credits restants
5. Enregistrer dans `user_analytics` (total_videos_generated, total_articles_used)

### Correction requise
Dans `useVideoGeneration.ts` ou `ResultatPage.tsx`, apres la generation reussie :

```typescript
// Dans handleGenerateVideo ou apres generate() success
const videoResult = await generate(config)
if (videoResult?.success) {
  const consumed = await consumeVideoCredit()
  if (!consumed) {
    // Gerer l'erreur - ne devrait pas arriver si canGenerateVideo() etait vrai
    console.error('Failed to consume credit')
  }
  // Optionnel: refreshUserData() pour synchroniser l'UI
}
```

### Tables concernees
- `subscriptions.videos_used` - Incremente si sous la limite
- `credits.amount` - Decremente si abonnement epuise
- `user_analytics.total_videos_generated` - Incremente
- `user_analytics.total_articles_used` - Incremente du nombre d'articles

---

## 7. Logique Complete des Credits et Abonnements

### Structure des plans

| Plan | Prix | Videos/mois | Articles/video | Resolution | Templates | Watermark |
|------|------|-------------|----------------|------------|-----------|-----------|
| Free | 0€ | 1 | 5 | 1080p | 1 | Force |
| Pro | 9.99€ | 15 | 10 | 1080p | 3 | Optionnel |
| Business | 24.99€ | 50 | 20 | 4K | 3 | Optionnel |

### Verification des credits (`canGenerateVideo()`)
```typescript
// Ordre de priorite :
1. subscription.videosUsed < subscription.videosLimit → true
2. credits.amount > 0 → true
3. Sinon → false (afficher modal upgrade)
```

### Consommation des credits (`consumeVideoCredit()`)
```typescript
// Ordre de priorite :
1. Si videosUsed < videosLimit → incrementer videosUsed
2. Sinon si credits > 0 → decrementer credits
3. Mettre a jour user_analytics
```

### Tables Supabase

#### `subscriptions`
- `user_id` - UUID
- `plan` - 'free' | 'pro' | 'business'
- `status` - 'active' | 'cancelled' | 'expired'
- `videos_limit` - Limite mensuelle (1, 15, 50)
- `videos_used` - Compteur du mois
- `period_start` / `period_end` - Periode de facturation
- `stripe_subscription_id` - ID Stripe

#### `credits`
- `user_id` - UUID
- `amount` - Credits supplementaires achetes

#### `user_analytics`
- `user_id` - UUID
- `total_videos_generated` - Total historique
- `total_articles_used` - Total articles utilises
- `last_generation_at` - Timestamp derniere generation

### Reset mensuel
Les `videos_used` doivent etre remis a 0 au debut de chaque periode de facturation.
Ceci peut etre gere par :
- Un webhook Stripe sur renouvellement d'abonnement
- Une fonction Edge Supabase planifiee
- Une verification cote client au chargement

---

## 8. Implementation Mobile

### Stepper mobile
- Barre de progression horizontale en haut
- 3 etapes cliquables avec icones
- Etape active mise en evidence

### Liste d'articles
- **Liste verticale compacte**
- Miniature 60x60px + titre + prix + checkbox
- Scroll vertical infini ou pagination

### Configuration
- Bottom sheet depuis le bas
- Sections accordeon repliables
- Bouton CTA fixe en bas

---

## 9. Composants UI a Creer/Modifier

### Nouveaux composants
1. `VideoCreationStepper.tsx` - Indicateur d'etapes
2. `ArticleSelector.tsx` - Grille de selection
3. `VideoConfigForm.tsx` - Formulaire de configuration
4. `VideoPreviewSummary.tsx` - Resume avant generation
5. `PremiumOptionsSection.tsx` - Section options premium
6. `CreditIndicator.tsx` - Affichage credits restants

### Composants a modifier
1. `ResultatPage.tsx` - Restructurer en 3 colonnes
2. `VideoConfigPanel.tsx` - Deplacer vers nouvelle structure
3. `useVideoGeneration.ts` - Ajouter consommation de credit

---

## 10. Estimation des Taches

### Phase 1 - Bug Fix Credits (Prioritaire)
- [ ] Ajouter appel `consumeVideoCredit()` apres generation
- [ ] Tester le workflow complet de consommation
- [ ] Verifier mise a jour `user_analytics`

### Phase 2 - Structure Layout
- [ ] Creer layout 3 colonnes desktop
- [ ] Implementer stepper de progression
- [ ] Adapter mobile avec bottom sheet

### Phase 3 - Selection Articles
- [ ] Grille avec checkboxes
- [ ] Limites par plan
- [ ] Drag & drop reordering

### Phase 4 - Configuration Video
- [ ] Section templates avec restrictions plan
- [ ] Section duree avec restrictions plan
- [ ] Section musique avec upload premium
- [ ] Section texte personnalise
- [ ] Section options premium

### Phase 5 - Preview & Generation
- [ ] Resume de configuration
- [ ] Indicateur credits
- [ ] CTA generation
- [ ] Page resultat

---

## 11. Design System (Neo-Brutalism)

### Couleurs
- Navy: `#1D3354` - Elements principaux
- Red: `#D64045` - CTA, actions
- Cyan: `#9ED8DB` - Accents, success
- Cream: `#E8DFD5` - Background
- White: `#FFFFFF` - Cards

### Composants
- Borders: `border-2 border-black` ou `border-3 border-black`
- Shadows: `shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`
- Hover: `hover:translate-x-[-2px] hover:translate-y-[-2px]`
- Active: `active:translate-x-[1px] active:translate-y-[1px]`

### Typography
- Display: Space Grotesk (headings)
- Body: Inter (text)

---

*Document genere le 13/01/2026*
*A valider avant implementation*
