/**
 * Morning Focus Meditation — 10 minute focus meditation.
 */

import type { Meditation } from '../../types/meditation';

const morningFocus: Meditation = {
  id: 'morning-focus-10min',
  name: 'Morning Focus',
  description: 'Start your day with clarity and intention in this 10-minute session.',
  longDescription:
    'A mindfulness meditation designed for the morning. Uses energizing breathing and ' +
    'intention-setting to prepare your mind for the day ahead.',
  category: 'focus',
  difficulty: 'beginner',
  durationSeconds: 600,
  defaultBreathingPatternId: 'energizing',
  defaultBackgroundSoundId: 'music-5',
  requiresVoice: true,
  tags: ['morning', 'focus', 'mindfulness', 'intention'],
  posture: {
    type: 'seated',
    label: 'Seated',
    description: 'Sit upright with your spine tall and your eyes gently closed.',
    imageAsset: 'postures/seated.png',
  },
  steps: [
    {
      id: 'prep',
      type: 'preparation',
      startTime: 0,
      duration: 10,
      text: 'Sit tall. Take a moment to arrive.',
    },
    {
      id: 'intro',
      type: 'voice',
      startTime: 10,
      duration: 12,
      text: 'Good morning. Let\'s begin by taking three deep breaths together.',
      audioAsset: 'voice/morning-focus/intro.mp3',
    },
    {
      id: 'breathing-1',
      type: 'breathing',
      startTime: 22,
      duration: 18, // 3 cycles × 6s
      breathingPatternId: 'box-breathing',
      text: 'Follow the box breathing pattern.',
    },
    {
      id: 'awareness',
      type: 'voice',
      startTime: 40,
      duration: 15,
      text: 'Notice how you feel this morning. Not judging, just observing. What do you notice?',
      audioAsset: 'voice/morning-focus/awareness.mp3',
    },
    {
      id: 'pause-1',
      type: 'pause',
      startTime: 55,
      duration: 20,
    },
    {
      id: 'intention',
      type: 'voice',
      startTime: 75,
      duration: 15,
      text: 'Now, set a simple intention for your day. Just one word or phrase. Hold it gently in your mind.',
      audioAsset: 'voice/morning-focus/intention.mp3',
    },
    {
      id: 'pause-2',
      type: 'pause',
      startTime: 90,
      duration: 30,
    },
    {
      id: 'breathing-2',
      type: 'breathing',
      startTime: 120,
      duration: 180, // extended breathing
      breathingPatternId: 'box-breathing',
      text: 'Settle into a steady, grounding breath.',
    },
    {
      id: 'mid-check',
      type: 'voice',
      startTime: 300,
      duration: 12,
      text: 'You\'re doing well. Stay with the breath. Let thoughts pass like clouds.',
      audioAsset: 'voice/morning-focus/mid-check.mp3',
    },
    {
      id: 'breathing-3',
      type: 'breathing',
      startTime: 315,
      duration: 200,
      breathingPatternId: 'box-breathing',
      text: 'Continue box breathing to sharpen focus.',
    },
    {
      id: 'closing-guidance',
      type: 'voice',
      startTime: 520,
      duration: 15,
      text: 'Begin to deepen your breath. Recall your intention. Carry it with you today.',
      audioAsset: 'voice/morning-focus/closing.mp3',
    },
    {
      id: 'pause-3',
      type: 'pause',
      startTime: 535,
      duration: 55,
    },
    {
      id: 'final',
      type: 'voice',
      startTime: 590,
      duration: 6,
      text: 'Open your eyes when ready. Have a wonderful day.',
      audioAsset: 'voice/morning-focus/final.mp3',
    },
    {
      id: 'end-bell',
      type: 'bell',
      startTime: 597,
      duration: 0,
      audioAsset: 'bells/gentle-bell.mp3',
    },
    {
      id: 'complete',
      type: 'completion',
      startTime: 600,
      duration: 0,
    },
  ],
};

export default morningFocus;
