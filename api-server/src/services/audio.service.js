/**
 * Service d'ajout audio avec FFmpeg
 * Ajoute la musique de fond aux vidéos générées
 */

const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const fileUtils = require('../utils/file.utils');

class AudioService {
  constructor() {
    this.ffmpegAvailable = this.checkFFmpeg();
  }

  /**
   * Vérifier si FFmpeg est disponible
   */
  checkFFmpeg() {
    try {
      execSync('ffmpeg -version', { stdio: 'ignore' });
      console.log('[AUDIO] FFmpeg is available');
      return true;
    } catch {
      console.warn('[AUDIO] FFmpeg not found. Audio features will be disabled.');
      return false;
    }
  }

  /**
   * Ajouter une piste audio à une vidéo
   * @param {string} videoPath - Chemin de la vidéo source
   * @param {string} musicTrackId - ID de la piste musicale
   * @param {string} outputPath - Chemin de sortie (optionnel, remplace l'original si non fourni)
   * @param {number} videoDuration - Durée de la vidéo en secondes
   * @returns {Promise<string>} - Chemin de la vidéo avec audio
   */
  async addAudioToVideo(videoPath, musicTrackId, outputPath, videoDuration) {
    if (!this.ffmpegAvailable) {
      console.warn('[AUDIO] FFmpeg not available, returning original video');
      return videoPath;
    }

    if (!musicTrackId || musicTrackId === '' || musicTrackId === 'none') {
      console.log('[AUDIO] No music track selected, returning original video');
      return videoPath;
    }

    // Obtenir le chemin de la musique
    const musicPath = fileUtils.getMusicPath(musicTrackId);
    if (!musicPath) {
      console.warn(`[AUDIO] Music track not found: ${musicTrackId}`);
      return videoPath;
    }

    // Définir le chemin de sortie
    const finalOutputPath = outputPath || videoPath.replace('.mp4', '-with-audio.mp4');
    const tempOutputPath = videoPath.replace('.mp4', '-temp-audio.mp4');

    console.log(`[AUDIO] Adding music to video...`);
    console.log(`[AUDIO] Video: ${videoPath}`);
    console.log(`[AUDIO] Music: ${musicPath}`);
    console.log(`[AUDIO] Duration: ${videoDuration}s`);

    try {
      // Utiliser FFmpeg pour mixer l'audio
      // -stream_loop -1 : boucle la musique si elle est plus courte
      // -t : limite à la durée de la vidéo
      // -filter_complex : mixe l'audio avec volume ajusté
      // -shortest : arrête quand le flux le plus court se termine
      await this.runFFmpegCommand([
        '-y', // Overwrite output
        '-i', videoPath, // Input video
        '-stream_loop', '-1', // Loop audio if shorter
        '-i', musicPath, // Input audio
        '-t', String(videoDuration), // Limit duration
        '-filter_complex', '[1:a]volume=0.3[a1];[a1]afade=t=out:st=' + (videoDuration - 2) + ':d=2[aout]', // Lower volume + fade out
        '-map', '0:v', // Use video from first input
        '-map', '[aout]', // Use filtered audio
        '-c:v', 'copy', // Copy video without re-encoding
        '-c:a', 'aac', // Encode audio as AAC
        '-b:a', '192k', // Audio bitrate
        '-shortest', // End when shortest stream ends
        tempOutputPath
      ]);

      // Si succès, remplacer ou déplacer le fichier
      if (fs.existsSync(tempOutputPath)) {
        // Si outputPath est le même que videoPath, remplacer
        if (!outputPath || outputPath === videoPath) {
          fs.unlinkSync(videoPath);
          fs.renameSync(tempOutputPath, videoPath);
          console.log(`[AUDIO] Video with audio saved: ${videoPath}`);
          return videoPath;
        } else {
          fs.renameSync(tempOutputPath, finalOutputPath);
          console.log(`[AUDIO] Video with audio saved: ${finalOutputPath}`);
          return finalOutputPath;
        }
      }

      return videoPath;
    } catch (error) {
      console.error('[AUDIO] Error adding audio:', error.message);
      // Nettoyer le fichier temporaire si il existe
      if (fs.existsSync(tempOutputPath)) {
        fs.unlinkSync(tempOutputPath);
      }
      // Retourner la vidéo originale en cas d'erreur
      return videoPath;
    }
  }

  /**
   * Exécuter une commande FFmpeg
   */
  runFFmpegCommand(args) {
    return new Promise((resolve, reject) => {
      console.log(`[AUDIO] Running FFmpeg with args: ${args.join(' ')}`);

      const ffmpeg = spawn('ffmpeg', args, {
        stdio: ['ignore', 'pipe', 'pipe']
      });

      let stderr = '';

      ffmpeg.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      ffmpeg.on('close', (code) => {
        if (code === 0) {
          console.log('[AUDIO] FFmpeg completed successfully');
          resolve();
        } else {
          console.error('[AUDIO] FFmpeg failed with code:', code);
          console.error('[AUDIO] FFmpeg stderr:', stderr.slice(-500)); // Last 500 chars
          reject(new Error(`FFmpeg exited with code ${code}`));
        }
      });

      ffmpeg.on('error', (error) => {
        reject(error);
      });
    });
  }

  /**
   * Obtenir la durée d'un fichier audio
   */
  async getAudioDuration(audioPath) {
    if (!this.ffmpegAvailable) {
      return 0;
    }

    try {
      const output = execSync(
        `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${audioPath}"`,
        { encoding: 'utf8' }
      );
      return parseFloat(output.trim());
    } catch {
      return 0;
    }
  }
}

module.exports = new AudioService();
