/**
 * Sleep Meditation — 15 minute sleep meditation.
 */

import type { Meditation } from '../../types/meditation';

const sleepMeditation: Meditation = {
  id: 'sleep-15min',
  name: 'Drift to Sleep',
  description: 'A soothing 15-minute meditation to guide you into peaceful sleep.',
  longDescription:
    'Progressive relaxation with extended exhale breathing designed to activate ' +
    'your parasympathetic nervous system and prepare your body for deep, restful sleep.',
  category: 'sleep',
  difficulty: 'beginner',
  durationSeconds: 900,
  defaultBreathingPatternId: 'deep-release',
  defaultBackgroundSoundId: 'rain',
  requiresVoice: true,
  tags: ['sleep', 'evening', 'relaxation', 'long'],
  posture: {
    type: 'lying',
    label: 'Lying Down',
    description: 'Lie comfortably in bed with your eyes closed.',
    imageAsset: 'postures/lying.png',
  },
  steps: [
    {
      id: 'prep',
      type: 'preparation',
      startTime: 0,
      duration: 15,
      text: 'Settle into bed. Let your body become heavy.',
    },
    {
      id: 'intro',
      type: 'voice',
      startTime: 15,
      duration: 15,
      text: 'Welcome to this sleep meditation. Let the day fall away. There is nothing left to do.',
      audioAsset: 'voice/sleep/intro.mp3',
    },
    {
      id: 'pause-1',
      type: 'pause',
      startTime: 30,
      duration: 10,
    },
    {
      id: 'body-heavy',
      type: 'voice',
      startTime: 40,
      duration: 20,
      text: 'Feel the weight of your body sinking into the mattress. Your feet are heavy. Your legs are heavy. Your entire body is supported.',
      audioAsset: 'voice/sleep/body-heavy.mp3',
    },
    {
      id: 'breathing-1',
      type: 'breathing',
      startTime: 65,
      duration: 96, // 6 cycles of deep-calm (16s each)
      breathingPatternId: 'deep-release',
      text: 'Slow, deep breaths. Let each exhale be longer than the inhale.',
    },
    {
      id: 'muscle-relax',
      type: 'voice',
      startTime: 165,
      duration: 20,
      text: 'Starting from your toes, gently tense and release each muscle group. Toes... feet... calves... let go.',
      audioAsset: 'voice/sleep/muscle-relax.mp3',
    },
    {
      id: 'pause-2',
      type: 'pause',
      startTime: 185,
      duration: 30,
    },
    {
      id: 'upper-body',
      type: 'voice',
      startTime: 215,
      duration: 20,
      text: 'Now your hands... arms... shoulders. Tense gently... and release. Feel the warmth spreading through you.',
      audioAsset: 'voice/sleep/upper-body.mp3',
    },
    {
      id: 'breathing-2',
      type: 'breathing',
      startTime: 240,
      duration: 96,
      breathingPatternId: 'deep-release',
      text: 'Continue breathing deeply.',
    },
    {
      id: 'visualization',
      type: 'voice',
      startTime: 340,
      duration: 20,
      text: 'Imagine yourself in a safe, warm place. Perhaps a quiet room with soft light. Everything is peaceful.',
      audioAsset: 'voice/sleep/visualization.mp3',
    },
    {
      id: 'long-silence',
      type: 'pause',
      startTime: 360,
      duration: 120,
    },
    {
      id: 'gentle-reminder',
      type: 'voice',
      startTime: 480,
      duration: 12,
      text: 'If your mind wanders, that\'s okay. Gently return to the breath.',
      audioAsset: 'voice/sleep/gentle-reminder.mp3',
    },
    {
      id: 'breathing-3',
      type: 'breathing',
      startTime: 495,
      duration: 300,
      breathingPatternId: 'deep-release',
      text: 'Let your breath become slow and heavy.',
    },
    {
      id: 'final-words',
      type: 'voice',
      startTime: 800,
      duration: 12,
      text: 'You are safe. You are calm. Let sleep come naturally.',
      audioAsset: 'voice/sleep/final-words.mp3',
    },
    {
      id: 'fade-out',
      type: 'pause',
      startTime: 815,
      duration: 85,
    },
    {
      id: 'complete',
      type: 'completion',
      startTime: 900,
      duration: 0,
    },
  ],
};

export default sleepMeditation;
