/**
 * Deep Mindfulness Meditation — 20 minute mindfulness meditation.
 */

import type { Meditation } from '../../types/meditation';

const deepMindfulness: Meditation = {
  id: 'deep-mindfulness-20min',
  name: 'Deep Mindfulness',
  description: 'A 20-minute mindfulness practice for present-moment awareness.',
  longDescription:
    'An intermediate mindfulness meditation that guides you through body awareness, ' +
    'breath observation, and open awareness. Designed for those with some meditation experience.',
  category: 'mindfulness',
  difficulty: 'intermediate',
  durationSeconds: 1200,
  defaultBreathingPatternId: 'mindful-wave',
  defaultBackgroundSoundId: 'music',
  requiresVoice: true,
  tags: ['mindfulness', 'awareness', 'intermediate', 'long'],
  posture: {
    type: 'cross-legged',
    label: 'Cross-Legged',
    description: 'Sit cross-legged with your spine tall and eyes gently closed.',
    imageAsset: 'postures/cross-legged.png',
  },
  steps: [
    {
      id: 'prep',
      type: 'preparation',
      startTime: 0,
      duration: 15,
      text: 'Settle into your posture. Let your body find stillness.',
    },
    {
      id: 'intro',
      type: 'voice',
      startTime: 15,
      duration: 15,
      text: 'Welcome. For the next twenty minutes, we\'ll practice simply being present. No striving, no fixing. Just noticing.',
      audioAsset: 'voice/deep-mindfulness/intro.mp3',
    },
    {
      id: 'breathing-settle',
      type: 'breathing',
      startTime: 35,
      duration: 60,
      breathingPatternId: 'mindful-wave',
      text: 'Begin with gentle breathing to settle in.',
    },
    {
      id: 'body-awareness',
      type: 'voice',
      startTime: 100,
      duration: 18,
      text: 'Bring your attention to the sensations in your body. The feeling of contact with the ground. Temperature. Weight.',
      audioAsset: 'voice/deep-mindfulness/body-awareness.mp3',
    },
    {
      id: 'silence-1',
      type: 'pause',
      startTime: 120,
      duration: 120,
    },
    {
      id: 'breath-focus',
      type: 'voice',
      startTime: 240,
      duration: 15,
      text: 'Now, narrow your attention to the breath. Notice where you feel it most. The nostrils, the chest, the belly.',
      audioAsset: 'voice/deep-mindfulness/breath-focus.mp3',
    },
    {
      id: 'silence-2',
      type: 'pause',
      startTime: 260,
      duration: 180,
    },
    {
      id: 'wandering',
      type: 'voice',
      startTime: 440,
      duration: 15,
      text: 'When you notice your mind has wandered, gently note it and return to the breath. This is the practice.',
      audioAsset: 'voice/deep-mindfulness/wandering.mp3',
    },
    {
      id: 'silence-3',
      type: 'pause',
      startTime: 460,
      duration: 200,
    },
    {
      id: 'open-awareness',
      type: 'voice',
      startTime: 660,
      duration: 18,
      text: 'Now, expand your awareness beyond the breath. Notice sounds, sensations, the space around you. Simply be aware.',
      audioAsset: 'voice/deep-mindfulness/open-awareness.mp3',
    },
    {
      id: 'silence-4',
      type: 'pause',
      startTime: 680,
      duration: 300,
    },
    {
      id: 'thoughts',
      type: 'voice',
      startTime: 980,
      duration: 15,
      text: 'If thoughts arise, let them pass like clouds. You are the sky, not the weather.',
      audioAsset: 'voice/deep-mindfulness/thoughts.mp3',
    },
    {
      id: 'silence-5',
      type: 'pause',
      startTime: 1000,
      duration: 140,
    },
    {
      id: 'closing',
      type: 'voice',
      startTime: 1140,
      duration: 15,
      text: 'Begin to bring your awareness back to your body. Feel the ground beneath you. Take a deep breath.',
      audioAsset: 'voice/deep-mindfulness/closing.mp3',
    },
    {
      id: 'pause-final',
      type: 'pause',
      startTime: 1158,
      duration: 30,
    },
    {
      id: 'final',
      type: 'voice',
      startTime: 1188,
      duration: 8,
      text: 'Open your eyes gently. Thank you for practicing.',
      audioAsset: 'voice/deep-mindfulness/final.mp3',
    },
    {
      id: 'end-bell',
      type: 'bell',
      startTime: 1197,
      duration: 0,
      audioAsset: 'bells/gentle-bell.mp3',
    },
    {
      id: 'complete',
      type: 'completion',
      startTime: 1200,
      duration: 0,
    },
  ],
};

export default deepMindfulness;
