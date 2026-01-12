# Plan de Test Local - Scraping + Génération Vidéo

## 🎯 Objectif

Tester et valider la logique métier principale **avant** d'intégrer Supabase, Stripe et l'authentification:
1. Scraping d'un vestiaire Vinted
2. Sélection d'articles (interface simple)
3. Génération d'une vidéo avec FFmpeg
4. Téléchargement de la vidéo générée

**Durée estimée**: 3-5 jours

---

## 📋 Phase 1: Setup Environnement Local (1/2 journée)

### 1.1 Installation FFmpeg

**Windows**:
```bash
# Télécharger depuis https://ffmpeg.org/download.html
# Ou via Chocolatey
choco install ffmpeg

# Vérifier l'installation
ffmpeg -version
```

**Linux/Mac**:
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install ffmpeg

# Mac
brew install ffmpeg

# Vérifier
ffmpeg -version
```

### 1.2 Dépendances Backend

```bash
cd api-server
npm install fluent-ffmpeg
npm install bull redis  # pour queue (optionnel en local)
npm install multer      # pour upload musique custom

# Dev dependencies
npm install --save-dev nodemon
```

### 1.3 Dépendances Frontend

```bash
cd frontend
npm install @dnd-kit/core @dnd-kit/sortable
npm install react-query
npm install lucide-react
npm install react-hook-form zod @hookform/resolvers
```

### 1.4 Structure Fichiers

```
api-server/
├── src/
│   ├── services/
│   │   ├── video.service.js      # NOUVEAU: Génération FFmpeg
│   │   └── queue.service.js      # NOUVEAU: Bull Queue (optionnel)
│   ├── controllers/
│   │   └── video.controller.js   # NOUVEAU: Contrôleur vidéo
│   ├── routes/
│   │   └── video.routes.js       # NOUVEAU: Routes vidéo
│   └── utils/
│       ├── ffmpeg.utils.js       # NOUVEAU: Helpers FFmpeg
│       └── file.utils.js         # NOUVEAU: Gestion fichiers temp
├── temp/                          # NOUVEAU: Stockage temporaire
│   ├── images/
│   └── videos/
├── output/                        # NOUVEAU: Vidéos générées
└── assets/
    ├── music/                     # NOUVEAU: Musiques libres
    │   ├── upbeat-pop.mp3
    │   ├── chill-vibes.mp3
    │   └── electronic-beat.mp3
    ├── fonts/                     # NOUVEAU: Fonts pour FFmpeg
    │   ├── SpaceGrotesk-Bold.ttf
    │   └── Inter-SemiBold.ttf
    └── watermark.png              # NOUVEAU: Logo watermark

frontend/
├── src/
│   ├── components/
│   │   ├── ArticleCard.tsx       # MODIFIER: Sélection checkbox
│   │   ├── ArticleGrid.tsx       # MODIFIER: Grille avec filtres
│   │   ├── SelectedArticles.tsx  # NOUVEAU: Liste drag&drop
│   │   ├── VideoConfig.tsx       # NOUVEAU: Config vidéo
│   │   ├── VideoPreview.tsx      # NOUVEAU: Preview miniatures
│   │   └── VideoPlayer.tsx       # NOUVEAU: Player vidéo
│   ├── hooks/
│   │   ├── useArticleSelection.ts # NOUVEAU: Logique sélection
│   │   ├── useVideoGeneration.ts  # NOUVEAU: Génération vidéo
│   │   └── useVideoConfig.ts      # NOUVEAU: Config vidéo
│   └── pages/
│       ├── ScrapePage.tsx         # Page scraping
│       ├── SelectionPage.tsx      # NOUVEAU: Sélection articles
│       ├── ConfigPage.tsx         # NOUVEAU: Config vidéo
│       └── ResultPage.tsx         # NOUVEAU: Résultat + download
```

---

## 🔧 Phase 2: Backend - Service Génération Vidéo (1-2 jours)

### 2.1 Créer `src/services/video.service.js`

**Fonctionnalités**:
- Télécharger images depuis URLs Vinted (temp)
- Créer clips individuels avec overlays texte
- Assembler clips avec transitions
- Ajouter musique de fond
- Ajouter watermark
- Exporter vidéo finale
- Nettoyer fichiers temporaires

**Structure de base**:
```javascript
class VideoService {
  async generateVideo(config) {
    const {
      articles,        // [{id, title, brand, price, imageUrl}]
      duration,        // 15, 30, 45, 60
      musicTrack,      // 'upbeat-pop.mp3'
      title,           // Titre vidéo
      hasWatermark     // true/false
    } = config

    try {
      // 1. Créer dossier temp unique
      const jobId = uuidv4()
      const tempDir = `temp/${jobId}`

      // 2. Télécharger images
      await this.downloadImages(articles, tempDir)

      // 3. Générer clips individuels
      const clips = await this.generateClips(articles, tempDir, duration)

      // 4. Assembler vidéo
      const videoPath = await this.assembleVideo(clips, musicTrack, hasWatermark, jobId)

      // 5. Cleanup
      await this.cleanup(tempDir)

      return {
        success: true,
        videoPath,
        videoUrl: `/output/${jobId}.mp4`
      }
    } catch (error) {
      await this.cleanup(tempDir)
      throw error
    }
  }

  async downloadImages(articles, tempDir) { /* ... */ }
  async generateClips(articles, tempDir, duration) { /* ... */ }
  async assembleVideo(clips, musicTrack, hasWatermark, jobId) { /* ... */ }
  async cleanup(tempDir) { /* ... */ }
}
```

### 2.2 Créer `src/utils/ffmpeg.utils.js`

**Helpers FFmpeg**:
```javascript
const ffmpeg = require('fluent-ffmpeg')
const path = require('path')

// Créer un clip avec overlays
exports.createArticleClip = async (article, imagePath, duration, outputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(imagePath)
      .size('1080x1920')
      .videoFilters([
        // Crop et scale
        'scale=1080:1920:force_original_aspect_ratio=increase',
        'crop=1080:1920',

        // Gradient overlay (simulate avec color overlay)
        'colorkey=0x000000:0.3:0.1[tmp];[tmp]fade=t=in:st=0:d=0.5',

        // Texte titre (top)
        {
          filter: 'drawtext',
          options: {
            text: article.title,
            fontfile: path.join(__dirname, '../../assets/fonts/SpaceGrotesk-Bold.ttf'),
            fontsize: 60,
            fontcolor: 'white',
            x: '(w-text_w)/2',
            y: 100,
            shadowcolor: 'black',
            shadowx: 4,
            shadowy: 4
          }
        },

        // Texte marque (middle)
        {
          filter: 'drawtext',
          options: {
            text: article.brand,
            fontfile: path.join(__dirname, '../../assets/fonts/Inter-SemiBold.ttf'),
            fontsize: 40,
            fontcolor: '#FCD34D',
            x: '(w-text_w)/2',
            y: 'h/2',
            shadowcolor: 'black',
            shadowx: 2,
            shadowy: 2
          }
        },

        // Prix (bottom-right badge)
        {
          filter: 'drawtext',
          options: {
            text: `${article.price}€`,
            fontfile: path.join(__dirname, '../../assets/fonts/SpaceGrotesk-Bold.ttf'),
            fontsize: 80,
            fontcolor: 'black',
            box: 1,
            boxcolor: '#FCD34D@1',
            boxborderw: 10,
            x: 'w-text_w-50',
            y: 'h-text_h-50'
          }
        }
      ])
      .duration(duration)
      .output(outputPath)
      .on('end', () => resolve(outputPath))
      .on('error', reject)
      .run()
  })
}

// Assembler plusieurs clips avec transitions
exports.concatenateClips = async (clipPaths, musicPath, hasWatermark, outputPath) => {
  return new Promise((resolve, reject) => {
    const command = ffmpeg()

    // Ajouter tous les clips
    clipPaths.forEach(clip => command.input(clip))

    // Ajouter musique
    command.input(musicPath)

    // Filtre complexe pour transitions fade
    const filters = []
    for (let i = 0; i < clipPaths.length - 1; i++) {
      filters.push(
        `[${i}:v]fade=t=out:st=${duration-0.5}:d=0.5[v${i}out]`,
        `[${i+1}:v]fade=t=in:st=0:d=0.5[v${i+1}in]`,
        `[v${i}out][v${i+1}in]xfade=transition=fade:duration=0.5:offset=${duration-0.5}[v${i+1}]`
      )
    }

    // Watermark si nécessaire
    if (hasWatermark) {
      command.input(path.join(__dirname, '../../assets/watermark.png'))
      filters.push('[v${clipPaths.length-1}][${clipPaths.length}:v]overlay=W-w-20:H-h-20')
    }

    command
      .complexFilter(filters)
      .audioCodec('aac')
      .audioBitrate('128k')
      .audioFilters('volume=0.3')
      .videoCodec('libx264')
      .outputOptions([
        '-preset fast',
        '-crf 23',
        '-movflags +faststart'
      ])
      .output(outputPath)
      .on('end', () => resolve(outputPath))
      .on('error', reject)
      .on('progress', (progress) => {
        console.log(`[FFMPEG] Processing: ${progress.percent}%`)
      })
      .run()
  })
}
```

### 2.3 Créer `src/controllers/video.controller.js`

```javascript
const videoService = require('../services/video.service')
const path = require('path')
const fs = require('fs')

class VideoController {
  async generate(req, res) {
    const { articles, duration, musicTrack, title, hasWatermark } = req.body

    // Validation
    if (!articles || articles.length === 0) {
      return res.status(400).json({ error: 'No articles provided' })
    }

    if (articles.length > 10) {
      return res.status(400).json({ error: 'Max 10 articles allowed' })
    }

    if (![15, 30, 45, 60].includes(duration)) {
      return res.status(400).json({ error: 'Invalid duration' })
    }

    try {
      console.log(`[VIDEO] Generating video with ${articles.length} articles`)

      const result = await videoService.generateVideo({
        articles,
        duration,
        musicTrack,
        title,
        hasWatermark: hasWatermark !== false // true par défaut
      })

      res.json(result)
    } catch (error) {
      console.error('[VIDEO] Generation failed:', error)
      res.status(500).json({ error: error.message })
    }
  }

  async download(req, res) {
    const { videoId } = req.params
    const videoPath = path.join(__dirname, `../../output/${videoId}.mp4`)

    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({ error: 'Video not found' })
    }

    res.download(videoPath, `vintboost-${videoId}.mp4`)
  }

  async list(req, res) {
    const outputDir = path.join(__dirname, '../../output')
    const files = fs.readdirSync(outputDir)
      .filter(f => f.endsWith('.mp4'))
      .map(f => ({
        id: f.replace('.mp4', ''),
        filename: f,
        url: `/api/video/${f.replace('.mp4', '')}`,
        createdAt: fs.statSync(path.join(outputDir, f)).mtime
      }))
      .sort((a, b) => b.createdAt - a.createdAt)

    res.json({ videos: files })
  }
}

module.exports = new VideoController()
```

### 2.4 Créer `src/routes/video.routes.js`

```javascript
const express = require('express')
const router = express.Router()
const videoController = require('../controllers/video.controller')

router.post('/generate', videoController.generate.bind(videoController))
router.get('/list', videoController.list.bind(videoController))
router.get('/:videoId', videoController.download.bind(videoController))

module.exports = router
```

### 2.5 Intégrer dans `src/app.js`

```javascript
const videoRoutes = require('./routes/video.routes')

// Routes
app.use('/api', scraperRoutes)
app.use('/api/video', videoRoutes) // NOUVEAU

// Servir fichiers statiques (vidéos)
app.use('/output', express.static('output'))
```

### 2.6 Télécharger Musiques & Assets

```bash
# Créer dossiers
mkdir -p api-server/assets/music
mkdir -p api-server/assets/fonts
mkdir -p api-server/temp
mkdir -p api-server/output

# Télécharger musiques (YouTube Audio Library)
# → Placer 3-5 pistes MP3 dans assets/music/

# Télécharger fonts
# → Space Grotesk: https://fonts.google.com/specimen/Space+Grotesk
# → Inter: https://fonts.google.com/specimen/Inter
# → Placer TTF dans assets/fonts/

# Créer watermark simple (PNG transparent)
# → Logo "VINTBOOST" avec Canva/Figma
# → Résolution: 200x200px
# → Placer dans assets/watermark.png
```

---

## 🎨 Phase 3: Frontend - Interface Sélection & Config (1-2 jours)

### 3.1 Hook `useArticleSelection.ts`

```typescript
import { useState, useCallback } from 'react'
import type { VintedItem } from '../types/vinted'

export function useArticleSelection(maxArticles = 10) {
  const [selectedArticles, setSelectedArticles] = useState<VintedItem[]>([])

  const toggleArticle = useCallback((article: VintedItem) => {
    setSelectedArticles(prev => {
      const isSelected = prev.some(a => a.id === article.id)

      if (isSelected) {
        return prev.filter(a => a.id !== article.id)
      } else {
        if (prev.length >= maxArticles) {
          alert(`Maximum ${maxArticles} articles`)
          return prev
        }
        return [...prev, article]
      }
    })
  }, [maxArticles])

  const reorderArticles = useCallback((fromIndex: number, toIndex: number) => {
    setSelectedArticles(prev => {
      const result = [...prev]
      const [removed] = result.splice(fromIndex, 1)
      result.splice(toIndex, 0, removed)
      return result
    })
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedArticles([])
  }, [])

  const isSelected = useCallback((articleId: string) => {
    return selectedArticles.some(a => a.id === articleId)
  }, [selectedArticles])

  return {
    selectedArticles,
    toggleArticle,
    reorderArticles,
    clearSelection,
    isSelected,
    count: selectedArticles.length,
    canSelectMore: selectedArticles.length < maxArticles
  }
}
```

### 3.2 Hook `useVideoGeneration.ts`

```typescript
import { useState } from 'react'
import type { VintedItem } from '../types/vinted'

interface VideoConfig {
  articles: VintedItem[]
  duration: number
  musicTrack: string
  title: string
  hasWatermark: boolean
}

export function useVideoGeneration() {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const generate = async (config: VideoConfig) => {
    setLoading(true)
    setProgress(0)
    setError(null)

    try {
      const response = await fetch('http://localhost:3000/api/video/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })

      if (!response.ok) {
        throw new Error('Generation failed')
      }

      const data = await response.json()
      setResult(data)
      setProgress(100)
      return data

    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setResult(null)
    setError(null)
    setProgress(0)
  }

  return {
    generate,
    loading,
    progress,
    result,
    error,
    reset
  }
}
```

### 3.3 Composant `SelectedArticles.tsx` (Drag & Drop)

```typescript
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { VintedItem } from '../types/vinted'

function SortableArticle({ article, index }: { article: VintedItem, index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: article.id
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center gap-4 p-4 bg-white border-4 border-black shadow-[4px_4px_0px_0px_#0A0A0A]"
    >
      <span className="text-2xl font-bold text-vb-purple">{index + 1}</span>
      <img src={article.imageUrl} className="w-20 h-20 border-2 border-black" />
      <div className="flex-1">
        <h3 className="font-bold">{article.title}</h3>
        <p className="text-sm text-gray-600">{article.brand}</p>
      </div>
      <span className="px-4 py-2 bg-vb-yellow border-2 border-black font-bold">
        {article.price}€
      </span>
    </div>
  )
}

export function SelectedArticles({ articles, onReorder }: {
  articles: VintedItem[]
  onReorder: (fromIndex: number, toIndex: number) => void
}) {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = articles.findIndex(a => a.id === active.id)
      const newIndex = articles.findIndex(a => a.id === over.id)
      onReorder(oldIndex, newIndex)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Articles sélectionnés ({articles.length}/10)</h2>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={articles.map(a => a.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {articles.map((article, index) => (
              <SortableArticle key={article.id} article={article} index={index} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
```

### 3.4 Composant `VideoConfig.tsx`

```typescript
import { useState } from 'react'

const MUSIC_TRACKS = [
  { id: 'upbeat-pop', name: 'Upbeat Pop', duration: 60 },
  { id: 'chill-vibes', name: 'Chill Vibes', duration: 60 },
  { id: 'electronic-beat', name: 'Electronic Beat', duration: 60 }
]

export function VideoConfig({ onSubmit }: { onSubmit: (config: any) => void }) {
  const [duration, setDuration] = useState(30)
  const [musicTrack, setMusicTrack] = useState('upbeat-pop')
  const [title, setTitle] = useState('')

  return (
    <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#0A0A0A] p-8">
      <h2 className="text-3xl font-bold mb-6">Configuration vidéo</h2>

      {/* Durée */}
      <div className="mb-6">
        <label className="block font-bold mb-2">Durée de la vidéo</label>
        <input
          type="range"
          min="15"
          max="60"
          step="15"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-sm mt-2">
          <span>15s</span>
          <span className="font-bold text-vb-purple">{duration}s</span>
          <span>60s</span>
        </div>
      </div>

      {/* Musique */}
      <div className="mb-6">
        <label className="block font-bold mb-2">Musique de fond</label>
        <div className="space-y-2">
          {MUSIC_TRACKS.map(track => (
            <label key={track.id} className="flex items-center gap-3 p-3 border-2 border-black cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="music"
                value={track.id}
                checked={musicTrack === track.id}
                onChange={(e) => setMusicTrack(e.target.value)}
              />
              <span className="font-semibold">{track.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Titre */}
      <div className="mb-6">
        <label className="block font-bold mb-2">Titre de la vidéo (optionnel)</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Mon vestiaire automne 2024"
          className="w-full px-4 py-3 border-4 border-black focus:outline-none focus:border-vb-purple"
        />
      </div>

      {/* Submit */}
      <button
        onClick={() => onSubmit({ duration, musicTrack, title, hasWatermark: true })}
        className="w-full bg-vb-purple text-white font-bold py-4 px-8 border-4 border-black shadow-[8px_8px_0px_0px_#0A0A0A] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_#0A0A0A] transition-all"
      >
        Générer ma vidéo 🎬
      </button>
    </div>
  )
}
```

### 3.5 Page `SelectionPage.tsx` (workflow complet)

```typescript
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArticleGrid } from '../components/ArticleGrid'
import { SelectedArticles } from '../components/SelectedArticles'
import { VideoConfig } from '../components/VideoConfig'
import { useArticleSelection } from '../hooks/useArticleSelection'
import { useVideoGeneration } from '../hooks/useVideoGeneration'

export function SelectionPage() {
  const { wardrobeId } = useParams()
  const navigate = useNavigate()
  const [step, setStep] = useState<'select' | 'config' | 'generating'>('select')

  const {
    selectedArticles,
    toggleArticle,
    reorderArticles,
    isSelected,
    count
  } = useArticleSelection(10)

  const { generate, loading, result } = useVideoGeneration()

  const handleGenerate = async (config: any) => {
    setStep('generating')

    try {
      const result = await generate({
        articles: selectedArticles,
        ...config
      })

      navigate(`/video/${result.videoId}`)
    } catch (error) {
      alert('Erreur lors de la génération')
      setStep('config')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Créer ma vidéo</h1>
          <p className="text-gray-600">Sélectionnez jusqu'à 10 articles et configurez votre vidéo</p>
        </div>

        {/* Steps */}
        <div className="flex gap-4 mb-8">
          <div className={`flex-1 p-4 border-4 border-black ${step === 'select' ? 'bg-vb-purple text-white' : 'bg-white'}`}>
            <span className="font-bold">1. Sélection</span>
          </div>
          <div className={`flex-1 p-4 border-4 border-black ${step === 'config' ? 'bg-vb-purple text-white' : 'bg-white'}`}>
            <span className="font-bold">2. Configuration</span>
          </div>
          <div className={`flex-1 p-4 border-4 border-black ${step === 'generating' ? 'bg-vb-purple text-white' : 'bg-white'}`}>
            <span className="font-bold">3. Génération</span>
          </div>
        </div>

        {/* Content */}
        {step === 'select' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ArticleGrid
                onArticleClick={toggleArticle}
                isSelected={isSelected}
              />
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <SelectedArticles
                  articles={selectedArticles}
                  onReorder={reorderArticles}
                />

                <button
                  onClick={() => setStep('config')}
                  disabled={count === 0}
                  className="w-full mt-6 bg-vb-pink text-white font-bold py-4 px-8 border-4 border-black shadow-[8px_8px_0px_0px_#0A0A0A] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_#0A0A0A] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuer ({count}/10)
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'config' && (
          <div className="max-w-2xl mx-auto">
            <VideoConfig onSubmit={handleGenerate} />
          </div>
        )}

        {step === 'generating' && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#0A0A0A] p-12">
              <div className="animate-spin w-16 h-16 border-8 border-black border-t-vb-purple mx-auto mb-6"></div>
              <h2 className="text-3xl font-bold mb-2">Génération en cours...</h2>
              <p className="text-gray-600">Cela peut prendre 1-2 minutes</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

---

## 🧪 Phase 4: Tests & Validation (1 jour)

### 4.1 Test Scraping
```bash
# Terminal 1: Démarrer backend
cd api-server
npm run dev

# Terminal 2: Démarrer frontend
cd frontend
npm run dev

# Browser: http://localhost:5173
# 1. Scraper un vestiaire
# 2. Vérifier que tous les articles sont bien récupérés
# 3. Vérifier images, marques, prix
```

### 4.2 Test Sélection
```
1. Cliquer sur plusieurs articles (max 10)
2. Vérifier que le compteur s'incrémente
3. Drag & drop pour réorganiser
4. Vérifier l'ordre dans la liste
```

### 4.3 Test Génération Vidéo
```
1. Configurer durée (30s)
2. Choisir musique
3. Cliquer "Générer"
4. Attendre fin génération (logs backend)
5. Vérifier vidéo dans output/
```

### 4.4 Test Qualité Vidéo
```
1. Ouvrir vidéo générée
2. Vérifier résolution 1080x1920
3. Vérifier overlays texte lisibles
4. Vérifier transitions fluides
5. Vérifier musique audible (30% volume)
6. Vérifier watermark visible
```

### 4.5 Checklist Validation

- [ ] Scraping fonctionne (articles + images)
- [ ] Sélection multiple fonctionne
- [ ] Drag & drop fonctionne
- [ ] Filtres fonctionnent
- [ ] Config vidéo fonctionne
- [ ] Génération FFmpeg fonctionne
- [ ] Vidéo générée qualité OK
- [ ] Téléchargement vidéo fonctionne
- [ ] Cleanup fichiers temp fonctionne
- [ ] Logs backend clairs
- [ ] Gestion erreurs OK

---

## 📝 Phase 5: Documentation & Refinement (1/2 journée)

### 5.1 Documenter les commandes

Créer `claude/COMMANDS.md`:
```markdown
# Commandes Test Local

## Démarrer l'environnement
```bash
# Terminal 1: Backend
cd api-server
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

## Tester la génération vidéo (curl)
```bash
curl -X POST http://localhost:3000/api/video/generate \
  -H "Content-Type: application/json" \
  -d '{
    "articles": [...],
    "duration": 30,
    "musicTrack": "upbeat-pop.mp3",
    "title": "Test Video",
    "hasWatermark": true
  }'
```

## Vérifier les vidéos générées
```bash
ls -la api-server/output/
```

## Nettoyer les fichiers temp
```bash
rm -rf api-server/temp/*
rm -rf api-server/output/*
```
```

### 5.2 Mesurer les performances

- Temps de scraping: ~5-10s
- Temps de génération vidéo (30s, 5 articles): ~30-60s
- Taille vidéo: ~5-10 MB

### 5.3 Optimisations identifiées

- FFmpeg preset "fast" → "veryfast" (plus rapide, qualité OK)
- Cache des images scrapées (éviter re-download)
- Queue system (Bull) pour gérer plusieurs générations
- Compression vidéo (CRF 25 au lieu de 23)

---

## ✅ Résultat Attendu

À la fin de cette phase de test local, vous aurez:

1. ✅ Backend capable de scraper Vinted
2. ✅ Backend capable de générer des vidéos avec FFmpeg
3. ✅ Frontend avec sélection + drag & drop
4. ✅ Frontend avec configuration vidéo
5. ✅ Workflow complet testé et validé
6. ✅ Plusieurs vidéos de test générées
7. ✅ Documentation des commandes et bugs

**Prochaine étape**: Intégrer Supabase (auth + DB + storage) puis Stripe (paiements).

---

## 🐛 Troubleshooting

### FFmpeg not found
```bash
# Vérifier installation
ffmpeg -version

# Si erreur, réinstaller
# Windows: choco install ffmpeg
# Linux: sudo apt install ffmpeg
# Mac: brew install ffmpeg
```

### Images ne se téléchargent pas
- Vérifier que les URLs Vinted sont accessibles
- Ajouter User-Agent dans les requêtes HTTP
- Utiliser axios au lieu de fetch pour download

### Vidéo générée est vide/noire
- Vérifier chemins des fonts (absolus)
- Vérifier format images (JPEG/PNG)
- Vérifier logs FFmpeg (verbose mode)

### Génération trop lente
- Réduire résolution temporairement (720x1280)
- Utiliser preset "veryfast"
- Désactiver certains filtres complexes

### Mémoire insuffisante
- Limiter à 5 articles max en local
- Réduire qualité images (scale avant traitement)
- Augmenter swap sur VPS

---

## 📅 Timeline Estimée

| Phase | Durée | Description |
|-------|-------|-------------|
| 1. Setup | 0.5j | FFmpeg, deps, structure fichiers |
| 2. Backend vidéo | 1.5j | Service génération + FFmpeg utils |
| 3. Frontend | 1.5j | Sélection, drag&drop, config |
| 4. Tests | 1j | Tests complets + validation |
| 5. Doc | 0.5j | Documentation + optimisations |
| **TOTAL** | **5 jours** | MVP fonctionnel en local |

Après validation locale → Intégration Supabase/Stripe → Déploiement Coolify
