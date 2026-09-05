/**
 * Core meditation types.
 *
 * These types define the content model for meditations.
 * New meditations are added by creating content that conforms to these types —
 * no application logic changes required.
 */

// Enums / Union Types

/** High-level meditation categories for library organization. */
export type MeditationCategory =
  | 'calm'
  | 'stress-relief'
  | 'sleep'
  | 'focus'
  | 'mindfulness'
  | 'relaxation'
  | 'breathing';

/** Difficulty / experience level. */
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

/** Recommended physical posture for the meditation. */
export type PostureType =
  | 'seated'
  | 'cross-legged'
  | 'chair'
  | 'lying'
  | 'standing';

/** What kind of action a single meditation step represents. */
export type MeditationStepType =
  | 'preparation'    // Countdown / settle-in period
  | 'voice'          // Play a voice guidance audio clip
  | 'breathing'      // Trigger the breathing engine
  | 'pause'          // Silent pause (no voice, no breathing cue)
  | 'bell'           // Play a bell / chime
  | 'instruction'    // On-screen text instruction (no audio)
  | 'completion';    // Session is ending

// Meditation Step (timeline event)

/**
 * A single event on the meditation timeline.
 *
 * `startTime` is in seconds from the beginning of the session.
 * `duration` is how long this step lasts (seconds). Optional for instant events
 * like bells.
 */
export interface MeditationStep {
  /** Unique id within the meditation (for keying in lists, debugging). */
  id: string;

  /** What kind of step this is. */
  type: MeditationStepType;

  /** Seconds from session start when this step begins. */
  startTime: number;

  /** Duration in seconds. 0 or undefined for instant events. */
  duration?: number;

  /**
   * Text shown on screen during this step.
   * For 'voice' steps this is the transcript of what is spoken.
   * For 'instruction' steps this is the on-screen label.
   */
  text?: string;

  /**
   * Path or identifier for an audio asset.
   * For 'voice' steps: the voice clip asset key.
   * For 'bell' steps: the bell sound asset key.
   */
  audioAsset?: string;

  /**
   * If this step triggers the breathing engine, which pattern to use.
   * References a BreathingPattern id.
   */
  breathingPatternId?: string;
}

// Posture

export interface Posture {
  type: PostureType;
  label: string;
  description: string;
  /** Asset key for the posture illustration image. */
  imageAsset?: string;
}

// Meditation (the full content definition)

/**
 * A complete meditation definition.
 *
 * This is the primary content type. To add a new meditation to the app,
 * create an object conforming to this interface and register it in the
 * content index.
 */
export interface Meditation {
  /** Unique identifier (slug-style, e.g. "calm-breathing-5min"). */
  id: string;

  /** Display name. */
  name: string;

  /** Short description shown in the library. */
  description: string;

  /** Longer description shown on the detail screen. */
  longDescription?: string;

  /** Category for filtering / grouping. */
  category: MeditationCategory;

  /** Difficulty level. */
  difficulty: DifficultyLevel;

  /** Total duration in seconds. */
  durationSeconds: number;

  /** Ordered timeline of steps. Must be sorted by `startTime`. */
  steps: MeditationStep[];

  /** Default breathing pattern id (if the meditation uses breathing). */
  defaultBreathingPatternId?: string;

  /** Recommended posture. */
  posture?: Posture;

  /** Recommended background sound id. */
  defaultBackgroundSoundId?: string;

  /** Tags for search / discovery. */
  tags?: string[];

  /**
   * Whether voice guidance is essential to this meditation.
   * If false, the meditation works fine without audio (e.g. pure breathing timer).
   */
  requiresVoice?: boolean;
}
