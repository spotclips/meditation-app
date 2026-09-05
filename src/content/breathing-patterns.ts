/**
 * Predefined breathing patterns.
 *
 * To add a new pattern, create a BreathingPattern object and add it to the
 * BREATHING_PATTERNS array. No code changes needed elsewhere.
 */

import type { BreathingPattern } from '../types/breathing';

// ---------------------------------------------------------------------------
// Pattern Definitions
// ---------------------------------------------------------------------------

export const BOX_BREATHING: BreathingPattern = {
  id: 'box-breathing',
  name: 'Box Breathing',
  description:
    'Equal inhale, hold, exhale, and hold. Used by Navy SEALs for calm under pressure.',
  inhaleDuration: 4,
  holdDuration: 4,
  exhaleDuration: 4,
  restDuration: 4,
  cycles: 8,
};

export const RELAXING_BREATH: BreathingPattern = {
  id: '4-7-8',
  name: '4-7-8 Relaxing Breath',
  description:
    'A natural tranquilizer for the nervous system. Inhale 4, hold 7, exhale 8.',
  inhaleDuration: 4,
  holdDuration: 7,
  exhaleDuration: 8,
  restDuration: 0,
  cycles: 4,
};

export const SIMPLE_BREATH: BreathingPattern = {
  id: 'simple-breath',
  name: 'Simple Breathing',
  description: 'A gentle, natural breathing rhythm. Inhale 4, exhale 6.',
  inhaleDuration: 4,
  holdDuration: 0,
  exhaleDuration: 6,
  restDuration: 0,
  cycles: 10,
};

export const DEEP_RELEASE: BreathingPattern = {
  id: 'deep-release',
  name: 'Deep Release',
  description:
    'Extended exhale for deep relaxation. Inhale 4, hold 2, exhale 8, rest 2.',
  inhaleDuration: 4,
  holdDuration: 2,
  exhaleDuration: 8,
  restDuration: 2,
  cycles: 6,
};

export const EQUAL_BREATHING: BreathingPattern = {
  id: 'equal-breath',
  name: 'Equal Breathing',
  description: 'A balanced and rhythmic breath. Inhale 5, exhale 5.',
  inhaleDuration: 5,
  holdDuration: 0,
  exhaleDuration: 5,
  restDuration: 0,
  cycles: 10,
};

export const MINDFUL_WAVE: BreathingPattern = {
  id: 'mindful-wave',
  name: 'Mindful Wave',
  description: 'A slow, wavy breathing pattern. Inhale 6, exhale 6, rest 2.',
  inhaleDuration: 6,
  holdDuration: 0,
  exhaleDuration: 6,
  restDuration: 2,
  cycles: 6,
};

export const ENERGIZING_BREATH: BreathingPattern = {
  id: 'energizing',
  name: 'Energizing Breath',
  description: 'Shorter cycles to increase alertness. Inhale 3, exhale 3.',
  inhaleDuration: 3,
  holdDuration: 0,
  exhaleDuration: 3,
  restDuration: 0,
  cycles: 12,
};

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

/** All available breathing patterns. */
export const BREATHING_PATTERNS: BreathingPattern[] = [
  BOX_BREATHING,
  RELAXING_BREATH,
  SIMPLE_BREATH,
  DEEP_RELEASE,
  ENERGIZING_BREATH,
  EQUAL_BREATHING,
  MINDFUL_WAVE,
];

/** Look up a breathing pattern by id. Returns undefined if not found. */
export function getBreathingPattern(id: string): BreathingPattern | undefined {
  return BREATHING_PATTERNS.find((p) => p.id === id);
}
