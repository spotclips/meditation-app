/**
 * Calm Breathing Meditation — 5 minute beginner meditation.
 *
 * A gentle introduction to breathing meditation. Uses simple breathing
 * pattern with voice guidance prompts.
 */

import type { Meditation } from '../../types/meditation';

const calmBreathing: Meditation = {
  id: 'calm-breathing-5min',
  name: 'Calm Breathing',
  description: 'A gentle 5-minute breathing meditation to find your center.',
  longDescription:
    'This short meditation guides you through a series of slow, calming breaths. ' +
    'Perfect for beginners or anyone needing a quick moment of peace during a busy day.',
  category: 'calm',
  difficulty: 'beginner',
  durationSeconds: 300, // 5 minutes
  defaultBreathingPatternId: 'equal-breath',
  defaultBackgroundSoundId: 'rain',
  requiresVoice: false,
  tags: ['breathing', 'beginner', 'short', 'calm'],
  posture: {
    type: 'seated',
    label: 'Seated',
    description: 'Sit comfortably with your back straight and hands on your knees.',
    imageAsset: 'postures/seated.png',
  },
  steps: [
    {
      id: 'prep',
      type: 'preparation',
      startTime: 0,
      duration: 10,
      text: 'Find a comfortable position and close your eyes.',
    },
    {
      id: 'intro',
      type: 'voice',
      startTime: 10,
      duration: 8,
      text: 'Welcome. Let\'s take a few moments to settle in.',
      audioAsset: 'voice/calm-breathing/intro.mp3',
    },
    {
      id: 'settle',
      type: 'pause',
      startTime: 18,
      duration: 5,
    },
    {
      id: 'body-scan',
      type: 'voice',
      startTime: 23,
      duration: 12,
      text: 'Notice the weight of your body. Let your shoulders drop. Release any tension in your jaw.',
      audioAsset: 'voice/calm-breathing/body-scan.mp3',
    },
    {
      id: 'pause-1',
      type: 'pause',
      startTime: 35,
      duration: 5,
    },
    {
      id: 'breath-intro',
      type: 'voice',
      startTime: 40,
      duration: 10,
      text: 'Now, let\'s begin with a gentle breathing rhythm. Breathe in slowly through your nose, and out through your mouth.',
      audioAsset: 'voice/calm-breathing/breath-intro.mp3',
    },
    {
      id: 'breathing-1',
      type: 'breathing',
      startTime: 50,
      duration: 100, // 10 cycles × 10 seconds per cycle
      breathingPatternId: 'equal-breath',
      text: 'Follow the breathing rhythm.',
    },
    {
      id: 'mid-guidance',
      type: 'voice',
      startTime: 150,
      duration: 10,
      text: 'You\'re doing beautifully. Let each breath carry away a little more tension.',
      audioAsset: 'voice/calm-breathing/mid-guidance.mp3',
    },
    {
      id: 'breathing-2',
      type: 'breathing',
      startTime: 160,
      duration: 100,
      breathingPatternId: 'equal-breath',
      text: 'Continue breathing gently.',
    },
    {
      id: 'wind-down',
      type: 'voice',
      startTime: 260,
      duration: 10,
      text: 'Now, let your breath return to its natural rhythm. There\'s nothing to control.',
      audioAsset: 'voice/calm-breathing/wind-down.mp3',
    },
    {
      id: 'silence',
      type: 'pause',
      startTime: 270,
      duration: 15,
    },
    {
      id: 'closing',
      type: 'voice',
      startTime: 285,
      duration: 10,
      text: 'When you\'re ready, gently open your eyes. Carry this calmness with you.',
      audioAsset: 'voice/calm-breathing/closing.mp3',
    },
    {
      id: 'end-bell',
      type: 'bell',
      startTime: 296,
      duration: 0,
      audioAsset: 'bells/gentle-bell.mp3',
    },
    {
      id: 'complete',
      type: 'completion',
      startTime: 300,
      duration: 0,
    },
  ],
};

export default calmBreathing;
