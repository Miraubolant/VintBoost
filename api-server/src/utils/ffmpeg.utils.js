/**
 * Utilitaires FFmpeg pour génération vidéo
 */

const ffmpeg = require('fluent-ffmpeg')
const { execFile } = require('child_process')
const path = require('path')
const fs = require('fs')

// Configurer le chemin FFmpeg explicitement
const ffmpegPath = 'C:\\ProgramData\\chocolatey\\bin\\ffmpeg.exe'
const ffprobePath = 'C:\\ProgramData\\chocolatey\\bin\\ffprobe.exe'

if (fs.existsSync(ffmpegPath)) {
  ffmpeg.setFfmpegPath(ffmpegPath)
  console.log('[FFMPEG] Using FFmpeg at:', ffmpegPath)
}
if (fs.existsSync(ffprobePath)) {
  ffmpeg.setFfprobePath(ffprobePath)
}

/**
 * Exécuter FFmpeg directement (contourne le bug fluent-ffmpeg avec lavfi)
 */
function runFFmpegDirect(args) {
  return new Promise((resolve, reject) => {
    console.log(`[FFMPEG] Running: ffmpeg ${args.join(' ').substring(0, 100)}...`)
    execFile(ffmpegPath, args, { maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        console.error('[FFMPEG] Error:', stderr)
        reject(new Error(stderr || error.message))
      } else {
        resolve(stdout)
      }
    })
  })
}

// Couleurs Neo-Brutalism
const COLORS = {
  primary: '#FF6B6B',      // Rouge corail vif
  secondary: '#4ECDC4',    // Turquoise
  accent: '#FFE66D',       // Jaune vif
  dark: '#2D3436',         // Noir profond
  white: '#FFFFFF',
  black: '#000000',
  purple: '#A855F7',       // Violet vif
  pink: '#EC4899',         // Rose vif
  lime: '#84CC16',         // Vert lime
}

class FFmpegUtils {
  /**
   * Créer un clip individuel pour un article - Style Neo-Brutalism
   * Caractéristiques: bordures noires épaisses, ombres décalées, couleurs vives
   */
  async createArticleClip(article, imagePath, duration, outputPath, clipIndex = 0) {
    const fontsDir = path.join(__dirname, '../../assets/fonts')
    const fontBold = path.join(fontsDir, 'SpaceGrotesk-Bold.ttf')
    const fontSemiBold = path.join(fontsDir, 'Inter-SemiBold.ttf')

    const titleFont = fs.existsSync(fontBold) ? fontBold : 'Arial'
    const bodyFont = fs.existsSync(fontSemiBold) ? fontSemiBold : 'Arial'

    const clipDuration = Math.max(duration, 2)

    // Alterner les couleurs pour chaque article
    const accentColors = [COLORS.primary, COLORS.secondary, COLORS.accent, COLORS.purple, COLORS.pink, COLORS.lime]
    const accentColor = accentColors[clipIndex % accentColors.length]

    return new Promise((resolve, reject) => {
      const filters = []

      // 1. Scale et crop propre pour format 9:16 (1080x1920)
      filters.push('scale=1080:1920:force_original_aspect_ratio=increase')
      filters.push('crop=1080:1920')

      // 2. Neo-Brutalism: Bande colorée en haut avec bordure noire
      filters.push(`drawbox=x=0:y=0:w=1080:h=120:color=${accentColor}:t=fill`)
      filters.push('drawbox=x=0:y=116:w=1080:h=8:color=black:t=fill')

      // 3. Neo-Brutalism: Zone de texte en bas avec bordure épaisse
      filters.push('drawbox=x=0:y=1580:w=1080:h=340:color=white:t=fill')
      filters.push('drawbox=x=0:y=1576:w=1080:h=8:color=black:t=fill')

      // 4. Numéro de l'article - Badge Neo-Brutalism en haut à gauche
      const articleNum = String(clipIndex + 1).padStart(2, '0')
      // Ombre décalée (effet Neo-Brutalism)
      filters.push('drawbox=x=44:y=34:w=80:h=70:color=black:t=fill')
      // Box principale
      filters.push(`drawbox=x=40:y=30:w=80:h=70:color=${COLORS.white}:t=fill`)
      filters.push('drawbox=x=40:y=30:w=80:h=70:color=black:t=4')
      filters.push(
        `drawtext=text='${articleNum}':fontfile='${titleFont}':fontsize=42:fontcolor=black:` +
        `x=55:y=42`
      )

      // 5. Marque (si disponible) - Badge Neo-Brutalism
      if (article.brand) {
        const brand = this.escapeText(article.brand.toUpperCase())
        // Ombre décalée
        filters.push(
          `drawtext=text='  ${brand}  ':fontfile='${bodyFont}':fontsize=36:fontcolor=black:` +
          `box=1:boxcolor=black:boxborderw=12:` +
          `x=44:y=1604`
        )
        // Texte principal avec box
        filters.push(
          `drawtext=text='  ${brand}  ':fontfile='${bodyFont}':fontsize=36:fontcolor=black:` +
          `box=1:boxcolor=${accentColor}:boxborderw=12:borderw=3:bordercolor=black:` +
          `x=40:y=1600`
        )
      }

      // 6. Titre de l'article (tronqué si trop long)
      if (article.title) {
        let title = article.title
        if (title.length > 35) {
          title = title.substring(0, 32) + '...'
        }
        const escapedTitle = this.escapeText(title)
        filters.push(
          `drawtext=text='${escapedTitle}':fontfile='${bodyFont}':fontsize=32:fontcolor=${COLORS.dark}:` +
          `x=40:y=1680`
        )
      }

      // 7. Prix - Style Neo-Brutalism avec bordure épaisse et ombre décalée
      const price = `${article.price} EUR`
      // Ombre décalée noire
      filters.push(
        `drawtext=text='  ${price}  ':fontfile='${titleFont}':fontsize=64:fontcolor=white:` +
        `box=1:boxcolor=black:boxborderw=16:` +
        `x=w-text_w-36:y=1764`
      )
      // Box principale colorée avec bordure
      filters.push(
        `drawtext=text='  ${price}  ':fontfile='${titleFont}':fontsize=64:fontcolor=black:` +
        `box=1:boxcolor=${accentColor}:boxborderw=16:borderw=4:bordercolor=black:` +
        `x=w-text_w-40:y=1760`
      )

      console.log(`[FFMPEG] Creating Neo-Brutalism clip for article ${article.id} (${clipDuration}s)`)

      ffmpeg(imagePath)
        .loop(clipDuration)
        .videoFilters(filters)
        .duration(clipDuration)
        .fps(30)
        .videoCodec('libx264')
        .outputOptions([
          '-preset medium',
          '-crf 16',         // Qualité maximale
          '-pix_fmt yuv420p'
        ])
        .output(outputPath)
        .on('end', () => {
          console.log(`[FFMPEG] Clip created: ${outputPath}`)
          resolve(outputPath)
        })
        .on('error', (err) => {
          console.error(`[FFMPEG] Error creating clip:`, err.message)
          reject(err)
        })
        .run()
    })
  }

  /**
   * Assembler plusieurs clips avec transitions
   */
  async concatenateClips(clipPaths, musicPath, hasWatermark, outputPath) {
    return new Promise((resolve, reject) => {
      const command = ffmpeg()

      console.log(`[FFMPEG] Concatenating ${clipPaths.length} clips`)

      // Créer fichier de concat temporaire
      const concatFile = path.join(path.dirname(outputPath), 'concat.txt')
      const concatContent = clipPaths.map(p => `file '${p}'`).join('\n')
      fs.writeFileSync(concatFile, concatContent)

      // Utiliser concat demuxer (plus simple et rapide)
      command.input(concatFile)
        .inputOptions(['-f concat', '-safe 0'])

      // Ajouter musique si disponible
      if (musicPath && fs.existsSync(musicPath)) {
        command.input(musicPath)
        command.audioFilters('volume=0.3')
        command.audioCodec('aac')
        command.audioBitrate('128k')
        // Couper la musique à la durée de la vidéo
        command.outputOptions('-shortest')
      } else {
        console.log('[FFMPEG] No music track, generating silent video')
        command.outputOptions(['-an']) // No audio
      }

      // Watermark si nécessaire
      const watermarkPath = path.join(__dirname, '../../assets/watermark.png')
      if (hasWatermark && fs.existsSync(watermarkPath)) {
        command.input(watermarkPath)
        command.complexFilter([
          '[0:v][1:v]overlay=W-w-20:H-h-20'
        ])
      }

      command
        .videoCodec('libx264')
        .outputOptions([
          '-preset medium',
          '-crf 18',            // Haute qualité pour la vidéo finale
          '-pix_fmt yuv420p',
          '-movflags +faststart' // Optimisation streaming
        ])
        .output(outputPath)
        .on('start', (cmd) => {
          console.log(`[FFMPEG] Assembling video...`)
        })
        .on('progress', (progress) => {
          if (progress.percent) {
            console.log(`[FFMPEG] Assembly progress: ${Math.round(progress.percent)}%`)
          }
        })
        .on('end', () => {
          // Cleanup concat file
          try {
            fs.unlinkSync(concatFile)
          } catch (e) {
            console.warn('[FFMPEG] Could not delete concat file:', e.message)
          }
          console.log(`[FFMPEG] Video assembled: ${outputPath}`)
          resolve(outputPath)
        })
        .on('error', (err) => {
          console.error(`[FFMPEG] Error assembling video:`, err.message)
          // Cleanup
          try {
            fs.unlinkSync(concatFile)
          } catch (e) {}
          reject(err)
        })
        .run()
    })
  }

  /**
   * Créer une vidéo intro (2.5 secondes) avec lavfi - Style Neo-Brutalism
   * Utilise execFile directement pour contourner le bug fluent-ffmpeg
   */
  async createIntroClip(username, outputPath) {
    const fontsDir = path.join(__dirname, '../../assets/fonts')
    const fontBold = path.join(fontsDir, 'SpaceGrotesk-Bold.ttf')
    const titleFont = fs.existsSync(fontBold) ? fontBold.replace(/\\/g, '/').replace(/:/g, '\\\\:') : 'Arial'

    const mainText = username ? `@${username}` : 'MON VESTIAIRE'
    const subText = 'VINTED'
    const escapedMain = this.escapeText(mainText.toUpperCase())
    const escapedSub = this.escapeText(subText)

    console.log(`[FFMPEG] Creating Neo-Brutalism intro clip`)

    // Neo-Brutalism: fond coloré vif avec éléments géométriques
    const vf = [
      // Fond principal jaune vif
      `drawbox=x=0:y=0:w=1080:h=1920:color=${COLORS.accent}:t=fill`,
      // Bandes noires décoratives en haut et bas
      'drawbox=x=0:y=0:w=1080:h=200:color=black:t=fill',
      'drawbox=x=0:y=1720:w=1080:h=200:color=black:t=fill',
      // Rectangle blanc central avec ombre décalée (Neo-Brutalism)
      'drawbox=x=114:y=714:w=860:h=500:color=black:t=fill',
      `drawbox=x=110:y=710:w=860:h=500:color=${COLORS.white}:t=fill`,
      'drawbox=x=110:y=710:w=860:h=500:color=black:t=8',
      // Texte principal avec ombre décalée
      `drawtext=text='${escapedMain}':fontfile='${titleFont}':fontsize=72:fontcolor=black:x=(w-text_w)/2+4:y=804`,
      `drawtext=text='${escapedMain}':fontfile='${titleFont}':fontsize=72:fontcolor=${COLORS.primary}:x=(w-text_w)/2:y=800`,
      // Sous-texte VINTED avec badge coloré
      `drawtext=text='  ${escapedSub}  ':fontfile='${titleFont}':fontsize=96:fontcolor=black:box=1:boxcolor=black:boxborderw=20:x=(w-text_w)/2+6:y=926`,
      `drawtext=text='  ${escapedSub}  ':fontfile='${titleFont}':fontsize=96:fontcolor=black:box=1:boxcolor=${COLORS.secondary}:boxborderw=20:borderw=4:bordercolor=black:x=(w-text_w)/2:y=920`,
      // Petits carrés décoratifs (style Neo-Brutalism)
      `drawbox=x=100:y=100:w=60:h=60:color=${COLORS.primary}:t=fill`,
      'drawbox=x=100:y=100:w=60:h=60:color=black:t=4',
      `drawbox=x=920:y=100:w=60:h=60:color=${COLORS.secondary}:t=fill`,
      'drawbox=x=920:y=100:w=60:h=60:color=black:t=4',
      `drawbox=x=100:y=1760:w=60:h=60:color=${COLORS.purple}:t=fill`,
      'drawbox=x=100:y=1760:w=60:h=60:color=black:t=4',
      `drawbox=x=920:y=1760:w=60:h=60:color=${COLORS.pink}:t=fill`,
      'drawbox=x=920:y=1760:w=60:h=60:color=black:t=4',
    ].join(',')

    const args = [
      '-f', 'lavfi',
      '-i', 'color=c=black:s=1080x1920:d=2.5:r=30',
      '-vf', vf,
      '-c:v', 'libx264',
      '-preset', 'medium',
      '-crf', '16',
      '-pix_fmt', 'yuv420p',
      '-y',
      outputPath
    ]

    await runFFmpegDirect(args)
    console.log(`[FFMPEG] Intro created`)
    return outputPath
  }

  /**
   * Créer une vidéo outro (2 secondes) avec lavfi - Style Neo-Brutalism
   * Utilise execFile directement pour contourner le bug fluent-ffmpeg
   */
  async createOutroClip(username, outputPath) {
    const fontsDir = path.join(__dirname, '../../assets/fonts')
    const fontBold = path.join(fontsDir, 'SpaceGrotesk-Bold.ttf')
    const titleFont = fs.existsSync(fontBold) ? fontBold.replace(/\\/g, '/').replace(/:/g, '\\\\:') : 'Arial'

    const mainText = 'RETROUVE-MOI'
    const subText = 'SUR VINTED!'
    const escapedMain = this.escapeText(mainText)
    const escapedSub = this.escapeText(subText)

    console.log(`[FFMPEG] Creating Neo-Brutalism outro clip`)

    const vf = [
      // Fond principal rose vif
      `drawbox=x=0:y=0:w=1080:h=1920:color=${COLORS.pink}:t=fill`,
      // Bandes décoratives
      `drawbox=x=0:y=0:w=1080:h=150:color=${COLORS.dark}:t=fill`,
      `drawbox=x=0:y=1770:w=1080:h=150:color=${COLORS.dark}:t=fill`,
      // Rectangle principal avec ombre
      'drawbox=x=84:y=764:w=920:h=400:color=black:t=fill',
      `drawbox=x=80:y=760:w=920:h=400:color=${COLORS.white}:t=fill`,
      'drawbox=x=80:y=760:w=920:h=400:color=black:t=6',
      // Texte principal
      `drawtext=text='${escapedMain}':fontfile='${titleFont}':fontsize=64:fontcolor=black:x=(w-text_w)/2+3:y=833`,
      `drawtext=text='${escapedMain}':fontfile='${titleFont}':fontsize=64:fontcolor=${COLORS.dark}:x=(w-text_w)/2:y=830`,
      // Sous-texte avec badge
      `drawtext=text='  ${escapedSub}  ':fontfile='${titleFont}':fontsize=72:fontcolor=white:box=1:boxcolor=black:boxborderw=16:x=(w-text_w)/2+5:y=945`,
      `drawtext=text='  ${escapedSub}  ':fontfile='${titleFont}':fontsize=72:fontcolor=black:box=1:boxcolor=${COLORS.accent}:boxborderw=16:borderw=4:bordercolor=black:x=(w-text_w)/2:y=940`,
      // Décorations
      `drawbox=x=440:y=60:w=200:h=50:color=${COLORS.accent}:t=fill`,
      'drawbox=x=440:y=60:w=200:h=50:color=black:t=3',
      `drawbox=x=440:y=1810:w=200:h=50:color=${COLORS.secondary}:t=fill`,
      'drawbox=x=440:y=1810:w=200:h=50:color=black:t=3',
    ].join(',')

    const args = [
      '-f', 'lavfi',
      '-i', 'color=c=black:s=1080x1920:d=2:r=30',
      '-vf', vf,
      '-c:v', 'libx264',
      '-preset', 'medium',
      '-crf', '16',
      '-pix_fmt', 'yuv420p',
      '-y',
      outputPath
    ]

    await runFFmpegDirect(args)
    console.log(`[FFMPEG] Outro created`)
    return outputPath
  }

  /**
   * Escape texte pour FFmpeg drawtext
   */
  escapeText(text) {
    if (!text) return ''
    return text
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/:/g, '\\:')
      .replace(/\[/g, '\\[')
      .replace(/\]/g, '\\]')
      .replace(/,/g, '\\,')
      .replace(/;/g, '\\;')
  }

  /**
   * Obtenir la durée d'une vidéo
   */
  async getVideoDuration(videoPath) {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(videoPath, (err, metadata) => {
        if (err) {
          reject(err)
        } else {
          resolve(metadata.format.duration)
        }
      })
    })
  }

  /**
   * Générer une thumbnail depuis une vidéo
   */
  async generateThumbnail(videoPath, outputPath, timestamp = '00:00:01') {
    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .screenshots({
          timestamps: [timestamp],
          filename: path.basename(outputPath),
          folder: path.dirname(outputPath),
          size: '1080x1920'
        })
        .on('end', () => {
          console.log(`[FFMPEG] Thumbnail created: ${outputPath}`)
          resolve(outputPath)
        })
        .on('error', (err) => {
          console.error(`[FFMPEG] Error creating thumbnail:`, err.message)
          reject(err)
        })
    })
  }
}

module.exports = new FFmpegUtils()
