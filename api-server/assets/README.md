# Assets VintBoost

Ce dossier contient les assets nécessaires pour la génération de vidéos.

## Fonts (fonts/)

Télécharger les fonts suivantes au format TTF:

1. **Space Grotesk Bold**
   - URL: https://fonts.google.com/specimen/Space+Grotesk
   - Télécharger: Space Grotesk Bold (700)
   - Fichier: `SpaceGrotesk-Bold.ttf`

2. **Inter SemiBold**
   - URL: https://fonts.google.com/specimen/Inter
   - Télécharger: Inter SemiBold (600)
   - Fichier: `Inter-SemiBold.ttf`

**Installation**:
- Aller sur Google Fonts
- Cliquer sur "Download family"
- Extraire les fichiers TTF
- Copier dans `assets/fonts/`

## Musiques (music/)

Télécharger des musiques libres de droits (15-90 secondes):

### Sources recommandées:
1. **YouTube Audio Library**
   - URL: https://www.youtube.com/audiolibrary
   - Filtrer: Pop, Electronic, Indie
   - Durée: 30-60s

2. **Free Music Archive**
   - URL: https://freemusicarchive.org/
   - Licence: CC BY

3. **Incompetech (Kevin MacLeod)**
   - URL: https://incompetech.com/
   - Libre de droits avec attribution

### Pistes suggérées:
- `upbeat-pop.mp3` - Énergique, moderne
- `chill-vibes.mp3` - Décontracté, relaxant
- `electronic-beat.mp3` - Électro, dynamique

**Format**: MP3, 128kbps, durée 60-90s

## Watermark (watermark.png)

Créer un logo "VINTBOOST" avec les specs suivantes:
- Format: PNG transparent
- Résolution: 200x200px
- Couleurs: Blanc avec bordure noire (neo-brutalism)
- Position: Bottom-right corner dans les vidéos

**Créer avec**:
- Canva (gratuit)
- Figma
- Photoshop/GIMP

**Template**:
```
Fond: transparent
Texte: "VINTBOOST"
Font: Space Grotesk Bold
Couleur: Blanc (#FFFFFF)
Stroke: 4px noir (#0A0A0A)
Taille: 180x60px centré dans 200x200px
```

## ⚠️ Important

Pour les tests locaux, vous pouvez:
1. Utiliser des musiques temporaires (silencieuses ou simples)
2. Créer un watermark basique avec Paint/Preview
3. Utiliser des fonts système (Arial, Helvetica) temporairement

Les vrais assets seront nécessaires pour la production.

## État Actuel

- [ ] SpaceGrotesk-Bold.ttf
- [ ] Inter-SemiBold.ttf
- [ ] upbeat-pop.mp3
- [ ] chill-vibes.mp3
- [ ] electronic-beat.mp3
- [ ] watermark.png

**Pour tester sans assets**: Le code utilisera des fallbacks (fonts système, pas de musique, pas de watermark).
