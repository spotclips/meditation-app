/**
 * Audio Manager
 * 
 * Orchestrates voice and background audio playback using expo-audio.
 * Features:
 * - Simultaneous dual-channel playback (voice + background)
 * - Auto-ducking (lowers background volume when voice speaks)
 * - Cross-fading and smooth volume transitions
 */

import { createAudioPlayer, AudioPlayer, AudioSource, setAudioModeAsync, AudioStatus } from 'expo-audio';
import type { AudioState, VoiceConfig, BackgroundSound } from '../types/audio';

export type AudioEventListener = (state: AudioState) => void;

export class AudioManager {
  private voicePlayer: AudioPlayer | null = null;
  private bgPlayer: AudioPlayer | null = null;
  
  private listeners: Set<AudioEventListener> = new Set();
  
  private state: AudioState = {
    voiceStatus: 'idle',
    backgroundStatus: 'idle',
    voiceVolume: 1.0,
    backgroundVolume: 0.6,
    isDucking: false,
    currentBackgroundSoundId: null,
  };
  
  private fadeInterval: ReturnType<typeof setInterval> | null = null;
  
  constructor() {
    this.setupAudioMode();
  }
  
  private async setupAudioMode() {
    try {
      await setAudioModeAsync({
        playsInSilentMode: true,
        shouldPlayInBackground: true,
        interruptionMode: 'duckOthers'
      });
    } catch (e) {
      console.warn('[AudioManager] Failed to set audio mode:', e);
    }
  }
  
    // Background Audio
    
  public async loadBackground(source: AudioSource, defaultVolume: number = 0.6) {
    this.state.backgroundVolume = defaultVolume;
    
    if (this.bgPlayer) {
      this.bgPlayer.pause(); // Instantly kill old audio (Spotify UX)
      this.bgPlayer.replace(source);
    } else {
      this.bgPlayer = createAudioPlayer(source, { updateInterval: 500 });
      this.bgPlayer.loop = true;
      this.bgPlayer.addListener('playbackStatusUpdate', (status: AudioStatus) => {
        if (!status.isLoaded || status.isBuffering) {
          if (this.state.backgroundStatus !== 'loading') {
            this.state.backgroundStatus = 'loading';
            this.emitState();
          }
        } else if (status.playing) {
          if (this.state.backgroundStatus !== 'playing') {
            this.state.backgroundStatus = 'playing';
            this.emitState();
          }
        }
      });
    }
    this.bgPlayer.volume = defaultVolume;
    
    this.state.backgroundStatus = 'loading';
    this.emitState();
  }
  
  public playBackground() {
    if (!this.bgPlayer) return;
    this.bgPlayer.play();
    this.state.backgroundStatus = 'playing';
    this.emitState();
  }
  
  public pauseBackground() {
    if (!this.bgPlayer) return;
    this.bgPlayer.pause();
    this.state.backgroundStatus = 'paused';
    this.emitState();
  }
  
  public stopBackground() {
    if (!this.bgPlayer) return;
    this.bgPlayer.pause();
    this.bgPlayer.seekTo(0);
    this.state.backgroundStatus = 'idle';
    this.emitState();
  }
  
  public setBackgroundVolume(volume: number, fadeDurationMs: number = 0) {
    if (!this.bgPlayer) return;
    
    this.state.backgroundVolume = volume;
    this.emitState();
    
    if (fadeDurationMs > 0) {
      this.fadeVolume(this.bgPlayer, volume, fadeDurationMs);
    } else {
      this.bgPlayer.volume = volume;
    }
  }
  
    // Voice Audio
    
  public async loadVoice(source: AudioSource, defaultVolume: number = 1.0) {
    this.state.voiceVolume = defaultVolume;
    
    if (this.voicePlayer) {
      this.voicePlayer.pause();
      this.voicePlayer.replace(source);
    } else {
      this.voicePlayer = createAudioPlayer(source, { updateInterval: 200 });
      this.voicePlayer.loop = false;
    }
    this.voicePlayer.volume = defaultVolume;
    
    // Add status listener to detect when voice finishes
    this.voicePlayer.addListener('playbackStatusUpdate', (status: AudioStatus) => {
      // In a real app we'd check if status.currentTime >= status.duration or similar
      // expo-audio handles this via checking if playing became false and we reached the end
      if (!status.playing && status.currentTime > 0 && Math.abs(status.currentTime - status.duration) < 0.5) {
        if (this.state.voiceStatus === 'playing') {
          this.state.voiceStatus = 'idle';
          this.unduckBackground();
          this.emitState();
        }
      }
    });
    
    this.state.voiceStatus = 'loading';
    this.emitState();
    
    this.state.voiceStatus = 'idle';
    this.emitState();
  }
  
  public playVoice(onComplete?: () => void) {
    if (!this.voicePlayer) return;
    
    this.voicePlayer.seekTo(0);
    this.voicePlayer.play();
    this.state.voiceStatus = 'playing';
    
    this.duckBackground();
    this.emitState();
    
    // Fallback completion check in case the listener misses it
    const checkCompletion = setInterval(() => {
      if (this.voicePlayer && !this.voicePlayer.playing && this.state.voiceStatus === 'playing') {
        clearInterval(checkCompletion);
        this.state.voiceStatus = 'idle';
        this.unduckBackground();
        this.emitState();
        if (onComplete) onComplete();
      }
    }, 500);
  }
  
  public pauseVoice() {
    if (!this.voicePlayer) return;
    this.voicePlayer.pause();
    this.state.voiceStatus = 'paused';
    this.unduckBackground();
    this.emitState();
  }
  
  public resumeVoice() {
    if (!this.voicePlayer) return;
    this.voicePlayer.play();
    this.state.voiceStatus = 'playing';
    this.duckBackground();
    this.emitState();
  }
  
  public stopVoice() {
    if (!this.voicePlayer) return;
    this.voicePlayer.pause();
    this.voicePlayer.seekTo(0);
    this.state.voiceStatus = 'idle';
    this.unduckBackground();
    this.emitState();
  }
  
  public setVoiceVolume(volume: number) {
    this.state.voiceVolume = volume;
    if (this.voicePlayer) {
      this.voicePlayer.volume = volume;
    }
    this.emitState();
  }
  
    // Ducking & Fading
    
  private duckBackground() {
    if (!this.bgPlayer || this.state.backgroundStatus !== 'playing') return;
    // Duck to 30% of target volume
    const duckedVolume = this.state.backgroundVolume * 0.3;
    this.fadeVolume(this.bgPlayer, duckedVolume, 1000);
  }
  
  private unduckBackground() {
    if (!this.bgPlayer || this.state.backgroundStatus !== 'playing') return;
    // Restore to target volume
    this.fadeVolume(this.bgPlayer, this.state.backgroundVolume, 2000);
  }
  
  private fadeVolume(player: AudioPlayer, targetVolume: number, durationMs: number) {
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }
    
    if (durationMs <= 0) {
      player.volume = targetVolume;
      return;
    }
    
    const startVolume = player.volume;
    const volumeDiff = targetVolume - startVolume;
    const steps = durationMs / 50; // Update every 50ms
    const stepVolume = volumeDiff / steps;
    let currentStep = 0;
    
    this.fadeInterval = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        player.volume = targetVolume;
        if (this.fadeInterval) clearInterval(this.fadeInterval);
        this.fadeInterval = null;
      } else {
        player.volume = startVolume + (stepVolume * currentStep);
      }
    }, 50);
  }
  
    // Global Controls
    
  public pauseAll() {
    this.pauseVoice();
    this.pauseBackground();
  }
  
  public destroy() {
    if (this.fadeInterval) clearInterval(this.fadeInterval);
    if (this.voicePlayer) {
      this.voicePlayer.pause();
      this.voicePlayer.remove();
    }
    if (this.bgPlayer) {
      this.bgPlayer.pause();
      this.bgPlayer.remove();
    }
    this.listeners.clear();
  }
  
    // Events
    
  public addEventListener(listener: AudioEventListener) {
    this.listeners.add(listener);
    listener({ ...this.state });
    return () => this.listeners.delete(listener);
  }
  
  private emitState() {
    const stateCopy = { ...this.state };
    for (const listener of this.listeners) {
      listener(stateCopy);
    }
  }
}

// Export a singleton instance for global use if needed, 
// though session manager will likely instantiate its own.
export const globalAudioManager = new AudioManager();
