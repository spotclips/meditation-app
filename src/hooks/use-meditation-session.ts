/**
 * Hook to manage a meditation session lifecycle and state.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { SessionManager } from '../engine/SessionManager';
import { getMeditation } from '../content/meditations';
import type { SessionConfiguration, SessionState } from '../types/session';
import type { BreathingState } from '../types/breathing';
import type { AudioState } from '../types/audio';
import { INITIAL_SESSION_STATE } from '../types/session';
import { INITIAL_BREATHING_STATE } from '../types/breathing';
import { INITIAL_AUDIO_STATE } from '../types/audio';

export function useMeditationSession(
  meditationId: string, 
  config?: Partial<SessionConfiguration>
) {
  const [sessionState, setSessionState] = useState<SessionState>(INITIAL_SESSION_STATE);
  const [breathingState, setBreathingState] = useState<BreathingState>(INITIAL_BREATHING_STATE);
  const [audioState, setAudioState] = useState<AudioState>(INITIAL_AUDIO_STATE);
  
  const managerRef = useRef<SessionManager | null>(null);
  const isInitialized = useRef(false);
  
  // Track the current background sound for the UI
  const [currentBackgroundSoundId, setCurrentBackgroundSoundId] = useState<string | null>(
    config?.backgroundSoundId ?? null
  );

  // Initialize
  useEffect(() => {
    const meditation = getMeditation(meditationId);
    if (!meditation || isInitialized.current) return;
    
    // Merge config with defaults
    const fullConfig: SessionConfiguration = {
      meditationId,
      durationSeconds: config?.durationSeconds ?? meditation.durationSeconds,
      backgroundSoundId: config?.backgroundSoundId ?? meditation.defaultBackgroundSoundId ?? null,
      voiceVolume: config?.voiceVolume ?? 1.0,
      backgroundVolume: config?.backgroundVolume ?? 0.6,
      endingType: config?.endingType ?? 'bell',
      voiceEnabled: config?.voiceEnabled ?? true,
      breathingPatternId: config?.breathingPatternId ?? meditation.defaultBreathingPatternId ?? null
    };
    
    const manager = new SessionManager(meditation, fullConfig);
    managerRef.current = manager;
    isInitialized.current = true;
    
    // Set initial sound ID if it was picked from default
    setCurrentBackgroundSoundId(fullConfig.backgroundSoundId);
    
    // Subscribe to meditation engine
    const unsubMeditation = manager.meditationEngine.addEventListener((event) => {
      if (event.type === 'state_changed') {
        setSessionState(event.state);
      }
    });
    
    // Subscribe to breathing engine if exists
    let unsubBreathing: (() => void) | undefined;
    if (manager.breathingEngine) {
      unsubBreathing = manager.breathingEngine.addEventListener((event) => {
        if (event.type === 'state_changed') {
          setBreathingState(event.state);
        }
      });
    }

    const unsubAudio = manager.audioManager.addEventListener((state) => {
      setAudioState(state);
    });
    
    manager.prepare().then(() => {
      // Auto-start could go here, or let UI handle it
    });
    
    return () => {
      unsubMeditation();
      if (unsubBreathing) unsubBreathing();
      unsubAudio();
      manager.destroy();
      isInitialized.current = false;
    };
  }, [meditationId, config]);

  const togglePlayPause = useCallback(() => {
    const manager = managerRef.current;
    if (!manager) return;
    
    if (sessionState.status === 'active') {
      manager.pause();
    } else {
      manager.start(); // Works as resume too
    }
  }, [sessionState.status]);

  const endSession = useCallback(() => {
    managerRef.current?.stop();
  }, []);

  const changeBackgroundSound = useCallback(async (soundId: string) => {
    if (managerRef.current) {
      setCurrentBackgroundSoundId(soundId);
      await managerRef.current.changeBackgroundSound(soundId);
    }
  }, []);

  const seekBy = useCallback((seconds: number) => {
    managerRef.current?.seekBy(seconds);
  }, []);

  return {
    sessionState,
    breathingState,
    audioState,
    togglePlayPause,
    endSession,
    changeBackgroundSound,
    seekBy,
    currentBackgroundSoundId,
    isReady: isInitialized.current,
  };
}
