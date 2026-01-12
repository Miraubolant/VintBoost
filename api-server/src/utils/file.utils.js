/**
 * Utilitaires de gestion de fichiers
 */

const fs = require('fs')
const path = require('path')
const axios = require('axios')
const { promisify } = require('util')

const mkdir = promisify(fs.mkdir)
const unlink = promisify(fs.unlink)
const rmdir = promisify(fs.rmdir)

class FileUtils {
  /**
   * Télécharger une image depuis une URL
   */
  async downloadImage(url, outputPath) {
    try {
      console.log(`[FILE] Downloading image from ${url}`)

      const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
        timeout: 30000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })

      // Créer le dossier parent si nécessaire
      const dir = path.dirname(outputPath)
      if (!fs.existsSync(dir)) {
        await mkdir(dir, { recursive: true })
      }

      // Écrire le fichier
      const writer = fs.createWriteStream(outputPath)
      response.data.pipe(writer)

      return new Promise((resolve, reject) => {
        writer.on('finish', () => {
          console.log(`[FILE] Image downloaded: ${outputPath}`)
          resolve(outputPath)
        })
        writer.on('error', reject)
      })
    } catch (error) {
      console.error(`[FILE] Error downloading image:`, error.message)
      throw new Error(`Failed to download image from ${url}`)
    }
  }

  /**
   * Télécharger plusieurs images en parallèle
   */
  async downloadImages(articles, tempDir) {
    const downloads = articles.map(async (article, index) => {
      const ext = this.getImageExtension(article.imageUrl)
      const filename = `article-${index}-${article.id}.${ext}`
      const outputPath = path.join(tempDir, 'images', filename)

      try {
        await this.downloadImage(article.imageUrl, outputPath)
        return { article, imagePath: outputPath }
      } catch (error) {
        console.error(`[FILE] Failed to download image for article ${article.id}`)
        // Retourner null si le téléchargement échoue
        return null
      }
    })

    const results = await Promise.all(downloads)
    // Filtrer les échecs
    return results.filter(r => r !== null)
  }

  /**
   * Créer un dossier temporaire unique
   */
  async createTempDir(jobId) {
    const tempDir = path.join(__dirname, '../../temp', jobId)
    const imagesDir = path.join(tempDir, 'images')
    const videosDir = path.join(tempDir, 'videos')

    await mkdir(tempDir, { recursive: true })
    await mkdir(imagesDir, { recursive: true })
    await mkdir(videosDir, { recursive: true })

    console.log(`[FILE] Temp directory created: ${tempDir}`)

    return {
      tempDir,
      imagesDir,
      videosDir
    }
  }

  /**
   * Nettoyer un dossier temporaire
   */
  async cleanup(tempDir) {
    if (!tempDir || !tempDir.includes('temp')) {
      console.warn('[FILE] Invalid temp directory, skipping cleanup')
      return
    }

    try {
      console.log(`[FILE] Cleaning up: ${tempDir}`)

      // Supprimer tous les fichiers récursivement
      await this.deleteRecursive(tempDir)

      console.log(`[FILE] Cleanup complete`)
    } catch (error) {
      console.error(`[FILE] Cleanup error:`, error.message)
      // Ne pas throw, juste logger
    }
  }

  /**
   * Supprimer un dossier et son contenu récursivement
   */
  async deleteRecursive(dirPath) {
    if (!fs.existsSync(dirPath)) {
      return
    }

    const files = fs.readdirSync(dirPath)

    for (const file of files) {
      const filePath = path.join(dirPath, file)
      const stat = fs.statSync(filePath)

      if (stat.isDirectory()) {
        await this.deleteRecursive(filePath)
      } else {
        await unlink(filePath)
      }
    }

    await rmdir(dirPath)
  }

  /**
   * Obtenir l'extension d'une image depuis son URL
   */
  getImageExtension(url) {
    const match = url.match(/\.(jpg|jpeg|png|webp|gif)(\?|$)/i)
    if (match) {
      return match[1].toLowerCase()
    }
    return 'jpg' // Fallback
  }

  /**
   * Vérifier si un fichier existe
   */
  fileExists(filePath) {
    return fs.existsSync(filePath)
  }

  /**
   * Obtenir la taille d'un fichier en MB
   */
  getFileSizeMB(filePath) {
    if (!fs.existsSync(filePath)) {
      return 0
    }
    const stats = fs.statSync(filePath)
    return (stats.size / (1024 * 1024)).toFixed(2)
  }

  /**
   * Obtenir la liste des musiques disponibles
   */
  getMusicTracks() {
    const musicDir = path.join(__dirname, '../../assets/music')

    if (!fs.existsSync(musicDir)) {
      console.warn('[FILE] Music directory does not exist')
      return []
    }

    const files = fs.readdirSync(musicDir)
    const tracks = files
      .filter(f => f.endsWith('.mp3'))
      .map(f => ({
        id: f.replace('.mp3', ''),
        filename: f,
        path: path.join(musicDir, f),
        name: this.formatTrackName(f)
      }))

    console.log(`[FILE] Found ${tracks.length} music tracks`)
    return tracks
  }

  /**
   * Formater un nom de fichier musique en nom lisible
   */
  formatTrackName(filename) {
    return filename
      .replace('.mp3', '')
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  /**
   * Obtenir le chemin d'une musique
   */
  getMusicPath(trackId) {
    const musicDir = path.join(__dirname, '../../assets/music')
    const trackPath = path.join(musicDir, `${trackId}.mp3`)

    if (fs.existsSync(trackPath)) {
      return trackPath
    }

    console.warn(`[FILE] Music track not found: ${trackId}`)
    return null
  }

  /**
   * Copier un fichier
   */
  async copyFile(source, destination) {
    return new Promise((resolve, reject) => {
      const readStream = fs.createReadStream(source)
      const writeStream = fs.createWriteStream(destination)

      readStream.on('error', reject)
      writeStream.on('error', reject)
      writeStream.on('finish', () => resolve(destination))

      readStream.pipe(writeStream)
    })
  }
}

module.exports = new FileUtils()
