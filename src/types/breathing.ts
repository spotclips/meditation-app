/**
 * Breathing system types.
 *
 * The breathing engine is a state machine that cycles through phases.
 * Patterns are configurable and reusable across meditations.
 */

// Breathing Phase

/** The four possible phases of a breathing cycle. */
export type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

// Breathing Pattern (content definition)

/**
 * A configurable breathing pattern.
 *
 * Durations are in seconds. Set a duration to 0 to skip that phase.
 * For example, a simple breath with no hold:
 *   { inhale: 4, hold: 0, exhale: 6, rest: 0, cycles: 10 }
 */
export interface BreathingPattern {
  /** Unique identifier (e.g. "box-breathing", "4-7-8"). */
  id: string;

  /** Display name. */
  name: string;

  /** Short description. */
  description: string;

  /** Inhale duration in seconds. */
  inhaleDuration: number;

  /** Hold (after inhale) duration in seconds. 0 to skip. */
  holdDuration: number;

  /** Exhale duration in seconds. */
  exhaleDuration: number;

  /** Rest (after exhale) duration in seconds. 0 to skip. */
  restDuration: number;

  /**
   * Number of complete breathing cycles.
   * Set to Infinity or a very large number for continuous breathing.
   */
  cycles: number;
}

// Breathing State (runtime state exposed by the engine)

/**
 * The current state of the breathing engine, consumed by the UI.
 */
export interface BreathingState {
  /** Whether the breathing engine is currently running. */
  isActive: boolean;

  /** Current phase of the breathing cycle. */
  currentPhase: BreathingPhase;

  /**
   * Progress through the current phase, from 0 (start) to 1 (end).
   * Useful for driving smooth animations (e.g. expanding/contracting circle).
   */
  phaseProgress: number;

  /** Seconds remaining in the current phase. */
  phaseRemaining: number;

  /** Total duration of the current phase in seconds. */
  phaseDuration: number;

  /** Current cycle number (1-indexed). */
  currentCycle: number;

  /** Total number of cycles configured. */
  totalCycles: number;

  /** The pattern currently being executed. */
  pattern: BreathingPattern | null;
}

/**
 * Initial / idle breathing state.
 */
export const INITIAL_BREATHING_STATE: BreathingState = {
  isActive: false,
  currentPhase: 'inhale',
  phaseProgress: 0,
  phaseRemaining: 0,
  phaseDuration: 0,
  currentCycle: 0,
  totalCycles: 0,
  pattern: null,
};
