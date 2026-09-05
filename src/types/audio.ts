/**
 * Audio system types.
 *
 * Separates the concept of audio content (what to play) from audio state
 * (playback status, volume). The audio manager implementation consumes these.
 */

// Background Sound

/** Available background sound categories. */
export type BackgroundSoundType =
  | 'rain'
  | 'ocean'
  | 'forest'
  | 'wind'
  | 'ambient'
  | 'music'
  | 'none';

/**
 * A background sound definition.
 */
export interface BackgroundSound {
  /** Unique identifier. */
  id: string;

  /** Display name. */
  name: string;

  /** Sound category. */
  type: BackgroundSoundType;

  /** Description shown to the user. */
  description: string;

  /**
   * Asset path or require() reference for the audio file.
   * Using string for content definitions; resolved at runtime.
   */
  audioAsset?: string;

  /** Whether this sound loops seamlessly. */
  isLoopable: boolean;

  /** Categories this sound belongs to. */
  categories?: string[];
}

// Voice

/**
 * A voice configuration for guided meditations.
 */
export interface VoiceConfig {
  /** Unique identifier. */
  id: string;

  /** Display name (e.g. "Serene", "Calm Male"). */
  name: string;

  /** Description. */
  description: string;

  /** Base path/prefix for this voice's audio assets. */
  assetPrefix: string;
}

// Audio State (runtime)

/** Playback status of a single audio channel. */
export type PlaybackStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

/**
 * Runtime state of the audio system, consumed by the UI.
 */
export interface AudioState {
  /** Voice channel status. */
  voiceStatus: PlaybackStatus;

  /** Background channel status. */
  backgroundStatus: PlaybackStatus;

  /** Voice volume (0.0 to 1.0). */
  voiceVolume: number;

  /** Background volume (0.0 to 1.0). */
  backgroundVolume: number;

  /** Whether voice ducking is currently active. */
  isDucking: boolean;

  /** Currently playing background sound id, or null. */
  currentBackgroundSoundId: string | null;
}

/**
 * Initial / idle audio state.
 */
export const INITIAL_AUDIO_STATE: AudioState = {
  voiceStatus: 'idle',
  backgroundStatus: 'idle',
  voiceVolume: 1.0,
  backgroundVolume: 0.6,
  isDucking: false,
  currentBackgroundSoundId: null,
};

// Audio Manager Events

/**
 * Events emitted by the audio manager.
 */
export interface AudioManagerEvents {
  onVoiceStart: () => void;
  onVoiceEnd: () => void;
  onVoiceError: (error: Error) => void;
  onBackgroundStart: () => void;
  onBackgroundError: (error: Error) => void;
  onStateChange: (state: AudioState) => void;
}
