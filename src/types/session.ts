/**
 * Meditation session types.
 *
 * A session is a single run of a meditation (or a custom quick-start practice).
 * SessionConfiguration is what the user chooses before starting.
 * SessionState is the live runtime state during a session.
 */

import type { BreathingState } from './breathing';

// ---------------------------------------------------------------------------
// Session Configuration
// ---------------------------------------------------------------------------

/** How the session ends. */
export type EndingType = 'silent' | 'bell';

/**
 * Configuration for a meditation session, set by the user before starting.
 */
export interface SessionConfiguration {
  /** The meditation id to run, or null for a custom quick-start session. */
  meditationId: string | null;

  /** Override duration in seconds (used for quick-start or duration selection). */
  durationSeconds: number;

  /** Whether voice guidance is enabled. */
  voiceEnabled: boolean;

  /** Background sound id, or null for no background. */
  backgroundSoundId: string | null;

  /** Voice volume (0.0 to 1.0). */
  voiceVolume: number;

  /** Background volume (0.0 to 1.0). */
  backgroundVolume: number;

  /** How the session should end. */
  endingType: EndingType;

  /** Breathing pattern id to use, or null. */
  breathingPatternId: string | null;
}

/**
 * Default session configuration.
 */
export const DEFAULT_SESSION_CONFIG: SessionConfiguration = {
  meditationId: null,
  durationSeconds: 600, // 10 minutes
  voiceEnabled: true,
  backgroundSoundId: null,
  voiceVolume: 1.0,
  backgroundVolume: 0.6,
  endingType: 'bell',
  breathingPatternId: null,
};

// ---------------------------------------------------------------------------
// Session Status
// ---------------------------------------------------------------------------

/** Lifecycle status of a meditation session. */
export type SessionStatus =
  | 'idle'          // No session active
  | 'preparing'     // Countdown / settle-in
  | 'active'        // Meditation is running
  | 'paused'        // User paused the session
  | 'completing'    // Fade-out / ending bell
  | 'completed'     // Session finished normally
  | 'cancelled';    // User stopped early

// ---------------------------------------------------------------------------
// Session State (runtime)
// ---------------------------------------------------------------------------

/**
 * The complete runtime state of a meditation session.
 * This is what the UI layer consumes to render the session screen.
 */
export interface SessionState {
  /** Current lifecycle status. */
  status: SessionStatus;

  /** The configuration this session was started with. */
  config: SessionConfiguration;

  /** Elapsed time in seconds. */
  elapsedSeconds: number;

  /** Remaining time in seconds. */
  remainingSeconds: number;

  /** Total session duration in seconds. */
  totalDurationSeconds: number;

  /** Progress from 0 (start) to 1 (end). */
  progress: number;

  /** The current meditation step being executed, or null. */
  currentStepId: string | null;

  /** Text currently shown on screen (from the active step). */
  currentText: string | null;

  /** Current breathing state, if breathing is active. */
  breathingState: BreathingState;

  /** Preparation countdown remaining (seconds), 0 if preparation is done. */
  preparationRemaining: number;
}

/**
 * Initial / idle session state.
 */
export const INITIAL_SESSION_STATE: SessionState = {
  status: 'idle',
  config: DEFAULT_SESSION_CONFIG,
  elapsedSeconds: 0,
  remainingSeconds: 0,
  totalDurationSeconds: 0,
  progress: 0,
  currentStepId: null,
  currentText: null,
  breathingState: {
    isActive: false,
    currentPhase: 'inhale',
    phaseProgress: 0,
    phaseRemaining: 0,
    phaseDuration: 0,
    currentCycle: 0,
    totalCycles: 0,
    pattern: null,
  },
  preparationRemaining: 0,
};
