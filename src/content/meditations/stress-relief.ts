/**
 * Stress Relief Meditation — 10 minute intermediate meditation.
 */

import type { Meditation } from '../../types/meditation';

const stressRelief: Meditation = {
  id: 'stress-relief-10min',
  name: 'Stress Relief',
  description: 'Release tension and find calm with this 10-minute guided meditation.',
  longDescription:
    'A step-by-step body scan paired with deep breathing to melt away stress. ' +
    'Suitable for anyone feeling overwhelmed or tense.',
  category: 'stress-relief',
  difficulty: 'intermediate',
  durationSeconds: 600, // 10 minutes
  defaultBreathingPatternId: '4-7-8',
  defaultBackgroundSoundId: 'music-3',
  requiresVoice: true,
  tags: ['stress', 'body-scan', 'relaxation'],
  posture: {
    type: 'lying',
    label: 'Lying Down',
    description: 'Lie on your back with your arms at your sides.',
    imageAsset: 'postures/lying.png',
  },
  steps: [
    {
      id: 'prep',
      type: 'preparation',
      startTime: 0,
      duration: 15,
      text: 'Lie down comfortably. Let your body sink into the surface beneath you.',
    },
    {
      id: 'intro',
      type: 'voice',
      startTime: 15,
      duration: 12,
      text: 'Welcome to this stress relief session. For the next few minutes, there is nothing you need to do.',
      audioAsset: 'voice/stress-relief/intro.mp3',
    },
    {
      id: 'pause-1',
      type: 'pause',
      startTime: 27,
      duration: 8,
    },
    {
      id: 'feet-scan',
      type: 'voice',
      startTime: 35,
      duration: 15,
      text: 'Bring your attention to your feet. Notice any sensations. Let them relax completely.',
      audioAsset: 'voice/stress-relief/feet-scan.mp3',
    },
    {
      id: 'legs-scan',
      type: 'voice',
      startTime: 55,
      duration: 15,
      text: 'Move your awareness up to your legs. Feel the weight of them. Let any tightness dissolve.',
      audioAsset: 'voice/stress-relief/legs-scan.mp3',
    },
    {
      id: 'breathing-1',
      type: 'breathing',
      startTime: 75,
      duration: 76, // 4 cycles of 4-7-8 (19s each)
      breathingPatternId: '4-7-8',
      text: 'Breathe deeply. In through your nose, hold gently, exhale slowly.',
    },
    {
      id: 'torso-scan',
      type: 'voice',
      startTime: 155,
      duration: 15,
      text: 'Now bring attention to your belly and chest. Feel them rise and fall naturally.',
      audioAsset: 'voice/stress-relief/torso-scan.mp3',
    },
    {
      id: 'pause-2',
      type: 'pause',
      startTime: 170,
      duration: 10,
    },
    {
      id: 'shoulders-scan',
      type: 'voice',
      startTime: 180,
      duration: 15,
      text: 'Notice your shoulders. Let them drop away from your ears. Release.',
      audioAsset: 'voice/stress-relief/shoulders-scan.mp3',
    },
    {
      id: 'breathing-2',
      type: 'breathing',
      startTime: 200,
      duration: 76,
      breathingPatternId: '4-7-8',
      text: 'Continue the calming breath.',
    },
    {
      id: 'face-scan',
      type: 'voice',
      startTime: 280,
      duration: 15,
      text: 'Soften the muscles around your eyes. Unclench your jaw. Let your face be completely at ease.',
      audioAsset: 'voice/stress-relief/face-scan.mp3',
    },
    {
      id: 'whole-body',
      type: 'voice',
      startTime: 300,
      duration: 15,
      text: 'Now feel your entire body as one. Relaxed. Heavy. Safe.',
      audioAsset: 'voice/stress-relief/whole-body.mp3',
    },
    {
      id: 'breathing-3',
      type: 'breathing',
      startTime: 320,
      duration: 120,
      breathingPatternId: '4-7-8',
      text: 'Rest here with deep, relaxing breathing.',
    },
    {
      id: 'return',
      type: 'voice',
      startTime: 450,
      duration: 15,
      text: 'Begin to bring your awareness back. Wiggle your fingers and toes.',
      audioAsset: 'voice/stress-relief/return.mp3',
    },
    {
      id: 'pause-3',
      type: 'pause',
      startTime: 465,
      duration: 120,
    },
    {
      id: 'closing',
      type: 'voice',
      startTime: 585,
      duration: 10,
      text: 'When you feel ready, gently open your eyes. Take this calm with you.',
      audioAsset: 'voice/stress-relief/closing.mp3',
    },
    {
      id: 'end-bell',
      type: 'bell',
      startTime: 596,
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

export default stressRelief;
