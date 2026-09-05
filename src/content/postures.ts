/**
 * Posture definitions.
 *
 * Meditation content references postures by type. Each posture has
 * a label, description, and optional illustration asset.
 */

import type { Posture, PostureType } from '../types/meditation';

// ---------------------------------------------------------------------------
// Posture Definitions
// ---------------------------------------------------------------------------

export const POSTURES: Record<PostureType, Posture> = {
  seated: {
    type: 'seated',
    label: 'Seated',
    description:
      'Sit comfortably on a cushion or mat with your back straight and hands resting on your knees.',
    imageAsset: 'postures/seated.png',
  },
  'cross-legged': {
    type: 'cross-legged',
    label: 'Cross-Legged',
    description:
      'Sit cross-legged on the floor with your spine tall and shoulders relaxed.',
    imageAsset: 'postures/cross-legged.png',
  },
  chair: {
    type: 'chair',
    label: 'Chair',
    description:
      'Sit in a chair with your feet flat on the floor and your hands resting on your thighs.',
    imageAsset: 'postures/chair.png',
  },
  lying: {
    type: 'lying',
    label: 'Lying Down',
    description:
      'Lie on your back with your arms at your sides and your palms facing up.',
    imageAsset: 'postures/lying.png',
  },
  standing: {
    type: 'standing',
    label: 'Standing',
    description:
      'Stand with your feet shoulder-width apart, arms relaxed at your sides.',
    imageAsset: 'postures/standing.png',
  },
};

/** Get a posture by type. */
export function getPosture(type: PostureType): Posture {
  return POSTURES[type];
}
