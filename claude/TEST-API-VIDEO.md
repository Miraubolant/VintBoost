# Test API Vidéo - Guide Rapide

## État Backend

✅ **Serveur fonctionnel** sur http://localhost:3000

### Services implémentés:
- ✅ `video.service.js` - Génération vidéo complète
- ✅ `ffmpeg.utils.js` - Utilitaires FFmpeg
- ✅ `file.utils.js` - Gestion fichiers

### Routes disponibles:
- `GET /api/video/music` - Liste musiques
- `POST /api/video/generate` - Générer vidéo
- `GET /api/video/list` - Liste vidéos
- `GET /api/video/:id` - Infos vidéo
- `GET /api/video/:id/download` - Télécharger
- `DELETE /api/video/:id` - Supprimer

## Test 1: Vérifier serveur

```bash
curl http://localhost:3000/
```

**Résultat attendu**:
```json
{"name":"VintBoost API","version":"1.0.0","status":"running"}
```

## Test 2: Liste musiques

```bash
curl http://localhost:3000/api/video/music
```

**Résultat**: Liste des musiques (vide si aucune musique dans `assets/music/`)

## Test 3: Scraper un vestiaire (requis pour Test 4)

```bash
curl -X POST http://localhost:3000/api/scrape-wardrobe \
  -H "Content-Type: application/json" \
  -d "{\"wardrobeUrl\": \"https://www.vinted.fr/member/11085046-marinette-v\"}"
```

**Résultat**: JSON avec liste d'articles

**Copier** les 3-5 premiers articles depuis le résultat pour le Test 4.

## Test 4: Générer une vidéo (exemple complet)

```bash
curl -X POST http://localhost:3000/api/video/generate \
  -H "Content-Type: application/json" \
  -d @- << 'EOF'
{
  "articles": [
    {
      "id": "1234567",
      "title": "Jean Levi's 501",
      "price": "25",
      "currency": "EUR",
      "brand": "Levi's",
      "imageUrl": "https://images1.vinted.net/t/xxx/image.jpeg",
      "size": "M"
    },
    {
      "id": "1234568",
      "title": "T-shirt Nike",
      "price": "15",
      "currency": "EUR",
      "brand": "Nike",
      "imageUrl": "https://images1.vinted.net/t/xxx/image2.jpeg",
      "size": "L"
    },
    {
      "id": "1234569",
      "title": "Chaussures Adidas",
      "price": "40",
      "currency": "EUR",
      "brand": "Adidas",
      "imageUrl": "https://images1.vinted.net/t/xxx/image3.jpeg",
      "size": "42"
    }
  ],
  "duration": 30,
  "musicTrack": null,
  "title": "Test Video",
  "hasWatermark": false,
  "username": "marinette-v"
}
EOF
```

**Attention**:
- Remplacer les URLs d'images par de vraies URLs depuis le scraping
- `musicTrack: null` car pas de musique pour l'instant
- `hasWatermark: false` car pas de watermark.png créé

**Résultat attendu**:
```json
{
  "success": true,
  "videoId": "uuid-here",
  "videoPath": "/path/to/output/uuid.mp4",
  "videoUrl": "/output/uuid.mp4",
  "thumbnailUrl": "/output/uuid-thumb.jpg",
  "duration": 30,
  "fileSize": 5.2,
  "articlesCount": 3,
  "title": "Test Video",
  "hasWatermark": false,
  "createdAt": "2026-01-11T..."
}
```

**Temps de génération**: ~30-90 secondes (selon machine)

## Test 5: Télécharger la vidéo générée

Depuis le résultat du Test 4, copier le `videoId`, puis:

```bash
# Ouvrir dans navigateur
http://localhost:3000/output/<videoId>.mp4

# Ou télécharger avec curl
curl -O http://localhost:3000/output/<videoId>.mp4
```

## Test 6: Lister les vidéos

```bash
curl http://localhost:3000/api/video/list
```

## Workflow Complet (PowerShell)

```powershell
# 1. Scraper
$scrapeResult = Invoke-RestMethod -Method Post `
  -Uri "http://localhost:3000/api/scrape-wardrobe" `
  -ContentType "application/json" `
  -Body '{"wardrobeUrl": "https://www.vinted.fr/member/11085046-marinette-v"}'

# 2. Sélectionner 3 articles
$articles = $scrapeResult.items | Select-Object -First 3 | ForEach-Object {
  @{
    id = $_.id
    title = $_.title
    price = $_.price
    currency = $_.currency
    brand = $_.brand
    imageUrl = $_.imageUrl
    size = $_.size
  }
}

# 3. Générer vidéo
$videoConfig = @{
  articles = $articles
  duration = 30
  musicTrack = $null
  title = "Test VintBoost"
  hasWatermark = $false
  username = "marinette-v"
} | ConvertTo-Json -Depth 10

$videoResult = Invoke-RestMethod -Method Post `
  -Uri "http://localhost:3000/api/video/generate" `
  -ContentType "application/json" `
  -Body $videoConfig

# 4. Ouvrir vidéo
Start-Process "http://localhost:3000$($videoResult.videoUrl)"
```

## Troubleshooting

### Erreur: "FFmpeg not found"
```bash
# Vérifier installation
ffmpeg -version

# Réinstaller si nécessaire (Windows)
choco install ffmpeg
```

### Erreur: "Failed to download images"
- Vérifier que les URLs d'images sont valides
- Vérifier connexion internet
- Certaines images Vinted peuvent être bloquées

### Vidéo ne se génère pas
- Vérifier les logs serveur (console ou fichier output)
- Vérifier dossiers: `temp/`, `output/`, `assets/`
- Logs FFmpeg dans console serveur

### Vidéo générée sans texte
- Fonts manquantes (fallback Arial)
- Télécharger Space Grotesk et Inter dans `assets/fonts/`

### Vidéo sans musique
- Normal si `musicTrack: null`
- Ajouter musiques MP3 dans `assets/music/`
- Utiliser `musicTrack: "nom-fichier"` (sans .mp3)

## Prochaines Étapes

Maintenant que le backend fonctionne:

1. ✅ Backend complet
2. 🔄 Frontend - Créer hooks (en cours)
3. ⏳ Frontend - Créer composants sélection
4. ⏳ Frontend - Créer page workflow complet
5. ⏳ Tests end-to-end

## Assets Requis (optionnel pour MVP)

Pour avoir une vidéo production-ready:

1. **Fonts** (`assets/fonts/`):
   - Space Grotesk Bold (700)
   - Inter SemiBold (600)

2. **Musiques** (`assets/music/`):
   - 3-5 pistes MP3 libres de droits (30-60s)

3. **Watermark** (`assets/watermark.png`):
   - Logo VintBoost 200x200px

**Pour tester sans assets**: Le code utilise des fallbacks (Arial, pas de musique, pas de watermark).
