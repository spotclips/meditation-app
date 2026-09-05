/**
 * Session Manager
 * 
 * Orchestrates the meditation engine, breathing engine, and audio manager.
 * Provides a unified API for the UI to interact with the active session.
 */

import { MeditationEngine, BreathingEngine } from '../engine';
import { AudioManager } from '../audio/AudioManager';
import type { Meditation, MeditationStep } from '../types/meditation';
import type { SessionConfiguration, SessionState } from '../types/session';
import type { BreathingState } from '../types/breathing';
import { getBreathingPattern } from '../content/breathing-patterns';
import { getBackgroundSound } from '../content/background-sounds';

export class SessionManager {
  public meditationEngine: MeditationEngine;
  public breathingEngine: BreathingEngine | null = null;
  public audioManager: AudioManager;
  
  private meditation: Meditation;
  private config: SessionConfiguration;
  
  constructor(meditation: Meditation, config: SessionConfiguration) {
    this.meditation = meditation;
    this.config = config;
    
    // 1. Initialize Engines
    this.meditationEngine = new MeditationEngine(meditation, config);
    
    // Initialize Breathing Engine if pattern is specified
    const patternId = config.breathingPatternId ?? meditation.defaultBreathingPatternId;
    if (patternId) {
      const pattern = getBreathingPattern(patternId);
      if (pattern) {
        this.breathingEngine = new BreathingEngine(pattern, config.durationSeconds ?? meditation.durationSeconds);
      }
    }
    
    // 2. Initialize Audio Manager
    this.audioManager = new AudioManager();
    
    // Set initial volumes
    this.audioManager.setVoiceVolume(config.voiceVolume ?? 1.0);
    this.audioManager.setBackgroundVolume(config.backgroundVolume ?? 0.6);
    
    // 3. Wire them together
    this.wireEvents();
  }
  
  public async prepare() {
    // Load background sound if configured
    if (this.config.backgroundSoundId) {
      await this.loadBackgroundSound(this.config.backgroundSoundId);
    }
    
    // Load first voice prompt if exists at 0s
    if (this.meditation.steps.length > 0 && this.meditation.steps[0].startTime === 0 && this.meditation.steps[0].type === 'voice') {
      const asset = this.meditation.steps[0].audioAsset;
      if (asset) {
        // await this.audioManager.loadVoice(asset);
        console.log(`[SessionManager] Preparing initial voice: ${asset}`);
      }
    }
  }
  
  private async loadBackgroundSound(soundId: string) {
    const sound = getBackgroundSound(soundId);
    if (sound && sound.audioAsset) {
      await this.audioManager.loadBackground(sound.audioAsset);
      console.log(`[SessionManager] Preparing background: ${soundId}`);
    }
  }

  public async changeBackgroundSound(soundId: string) {
    this.config.backgroundSoundId = soundId;
    const sound = getBackgroundSound(soundId);
    
    if (sound && sound.audioAsset) {
      await this.loadBackgroundSound(soundId);
      // If session is already playing, play the new background sound immediately
      if (this.meditationEngine.getState().status === 'active') {
        this.audioManager.playBackground();
      }
    } else {
      this.audioManager.stopBackground();
    }
  }
  
  private wireEvents() {
    // Listen to Meditation Engine
    this.meditationEngine.addEventListener((event) => {
      switch (event.type) {
        case 'state_changed':
          if (event.state.status === 'completed') {
            this.handleSessionComplete();
          }
          break;
        case 'step_started':
          this.handleStepStarted(event.step);
          break;
        case 'session_completed':
          this.handleSessionComplete();
          break;
      }
    });
  }
  
  private handleStepStarted(step: MeditationStep) {
    console.log(`[SessionManager] Step started: ${step.type}`);
    
    if (step.type === 'voice' && this.config.voiceEnabled !== false) {
      if (step.audioAsset) {
        console.log(`[SessionManager] Playing voice: ${step.audioAsset}`);
        setTimeout(() => {
          this.meditationEngine.markVoiceComplete();
        }, 3000); 
      }
    } else if (step.type === 'breathing') {
      // Start or stop breathing engine based on step config
      // Usually, a breathing step implies starting it or changing pattern
      if (this.breathingEngine) {
        this.breathingEngine.start();
      }
    }
  }
  
  private handleSessionComplete() {
    console.log('[SessionManager] Session complete');
    this.audioManager.stopBackground();
    if (this.breathingEngine) {
      this.breathingEngine.stop();
    }
    
    // Play ending bell if configured
    if (this.config.endingType === 'bell') {
      console.log('[SessionManager] Playing ending bell');
    }
  }
  
    // Public Controls
    
  public start() {
    this.meditationEngine.start();
    if (this.config.backgroundSoundId) {
      this.audioManager.playBackground();
    }
  }
  
  public pause() {
    this.meditationEngine.pause();
    if (this.breathingEngine) {
      this.breathingEngine.pause();
    }
    this.audioManager.pauseAll();
  }
  
  public resume() {
    this.meditationEngine.start(); // start handles resume logic too
    if (this.breathingEngine) {
      this.breathingEngine.resume();
    }
    if (this.config.backgroundSoundId) {
      // Re-enable background if it was ducked/paused
      // this.audioManager.playBackground();
    }
  }
  
  public stop() {
    this.meditationEngine.stop();
    if (this.breathingEngine) {
      this.breathingEngine.stop();
    }
    this.audioManager.stopBackground();
    this.audioManager.stopVoice();
  }
  
  public seekBy(seconds: number) {
    this.meditationEngine.seekBy(seconds);
  }
  
  public destroy() {
    this.meditationEngine.destroy();
    if (this.breathingEngine) {
      this.breathingEngine.destroy();
    }
    this.audioManager.destroy();
  }
}
