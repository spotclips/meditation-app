/**
 * Application constants.
 */

/** Duration of the preparation countdown in seconds. */
export const PREPARATION_DURATION = 5;

/** Tick interval for the meditation engine (ms). */
export const ENGINE_TICK_INTERVAL_MS = 100;

/** Tick interval for the breathing engine (ms). ~60fps for smooth animation. */
export const BREATHING_TICK_INTERVAL_MS = 16;

/** Default fade-in/fade-out duration for background audio (ms). */
export const AUDIO_FADE_DURATION_MS = 2000;

/** How much to duck the background volume when voice plays (multiplier). */
export const VOICE_DUCK_RATIO = 0.3;

/** Available meditation durations for quick-start (seconds). */
export const QUICK_START_DURATIONS = [
  { label: '5 min', seconds: 300 },
  { label: '10 min', seconds: 600 },
  { label: '15 min', seconds: 900 },
  { label: '20 min', seconds: 1200 },
  { label: '30 min', seconds: 1800 },
];

/** Category display labels. */
export const CATEGORY_LABELS: Record<string, string> = {
  calm: 'Calm',
  'stress-relief': 'Stress Relief',
  sleep: 'Sleep',
  focus: 'Focus',
  mindfulness: 'Mindfulness',
  relaxation: 'Relaxation',
  breathing: 'Breathing',
};

/** Difficulty display labels. */
export const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};
