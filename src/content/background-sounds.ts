/**
 * Background sound definitions.
 *
 * Each entry describes an available background sound. Audio assets are
 * referenced by key and resolved at runtime by the audio manager.
 *
 * To add a new sound:
 * 1. Place the audio file in assets/audio/backgrounds/
 * 2. Add a BackgroundSound entry here
 * 3. The sound automatically appears in the UI
 */

import type { BackgroundSound } from '../types/audio';

// Sound Definitions

export const BACKGROUND_SOUNDS: BackgroundSound[] = [
  {
    id: 'rain',
    name: 'Rain',
    type: 'rain',
    description: 'Gentle rain falling on leaves',
    audioAsset: 'https://ik.imagekit.io/c10ypyqiwl/meditation-music/andriig-rain-rain-meditation-music-581020.mp3?updatedAt=1788547042913',
    isLoopable: true,
    categories: ['sleep', 'relaxation', 'calm', 'peaceful', 'spa'],
  },
  {
    id: 'music',
    name: 'Meditation Music',
    type: 'music',
    description: 'Peaceful meditation music',
    audioAsset: 'https://ik.imagekit.io/c10ypyqiwl/meditation-music/starostin-meditation-meditation-music-515629.mp3?updatedAt=1788547066768',
    isLoopable: true,
    categories: ['calm', 'mindfulness', 'yoga', 'spiritual', 'peaceful'],
  },
  {
    id: 'music-2',
    name: 'Ambient Flow',
    type: 'music',
    description: 'A gentle, flowing ambient track',
    audioAsset: 'https://ik.imagekit.io/c10ypyqiwl/meditation-music/verclub_music-meditation-music-550885.mp3?updatedAt=1788547066295',
    isLoopable: true,
    categories: ['focus', 'yoga', 'spa', 'soft'],
  },
  {
    id: 'music-3',
    name: 'Deep Serenity',
    type: 'music',
    description: 'Deep and calming meditation music',
    audioAsset: 'https://ik.imagekit.io/c10ypyqiwl/meditation-music/atlasaudio-meditation-music-594882.mp3?updatedAt=1788547065818',
    isLoopable: true,
    categories: ['sleep', 'stress-relief', 'relaxation', 'spiritual'],
  },
  {
    id: 'music-4',
    name: 'Inner Peace',
    type: 'music',
    description: 'Soft tones for inner reflection',
    audioAsset: 'https://ik.imagekit.io/c10ypyqiwl/meditation-music/leberch-meditation-578429.mp3?updatedAt=1788547067342',
    isLoopable: true,
    categories: ['calm', 'stress-relief', 'peaceful', 'soft'],
  },
  {
    id: 'music-5',
    name: 'Quiet Mind',
    type: 'music',
    description: 'Minimalist sounds for a quiet mind',
    audioAsset: 'https://ik.imagekit.io/c10ypyqiwl/meditation-music/atlasaudio-meditation-583096.mp3?updatedAt=1788547062498',
    isLoopable: true,
    categories: ['focus', 'mindfulness', 'breathing'],
  },
  {
    id: 'music-6',
    name: 'Gentle Awakening',
    type: 'music',
    description: 'Bright and gentle morning tones',
    audioAsset: 'https://ik.imagekit.io/c10ypyqiwl/meditation-music/leberch-meditation-meditation-music-580539.mp3?updatedAt=1788547061417',
    isLoopable: true,
    categories: ['yoga', 'soft', 'calm'],
  },
  {
    id: 'music-7',
    name: 'Soft Harmony',
    type: 'music',
    description: 'Harmonious and relaxing frequencies',
    audioAsset: 'https://ik.imagekit.io/c10ypyqiwl/meditation-music/marlowemusic-meditation-music-585967.mp3?updatedAt=1788547055053',
    isLoopable: true,
    categories: ['relaxation', 'spa', 'peaceful', 'soft'],
  },
  {
    id: 'music-8',
    name: 'Tranquil Space',
    type: 'music',
    description: 'Expansive and tranquil sounds',
    audioAsset: 'https://ik.imagekit.io/c10ypyqiwl/meditation-music/monume-meditation-meditation-music-577986.mp3?updatedAt=1788547050238',
    isLoopable: true,
    categories: ['sleep', 'stress-relief', 'spiritual'],
  },
  {
    id: 'music-9',
    name: 'Eternal Exhale',
    type: 'music',
    description: 'A smooth, endless exhale track',
    audioAsset: 'https://ik.imagekit.io/c10ypyqiwl/meditation-music/elijah_k-eternal-exhale-509587.mp3',
    isLoopable: true,
    categories: ['breathing', 'mindfulness', 'calm'],
  },
  {
    id: 'music-10',
    name: 'Buddhist Meditation',
    type: 'music',
    description: 'Traditional and serene buddhist meditation sounds',
    audioAsset: 'https://ik.imagekit.io/c10ypyqiwl/meditation-music/atlasaudio-buddhist-meditation-588150.mp3',
    isLoopable: true,
    categories: ['spiritual', 'mindfulness', 'yoga'],
  },
  {
    id: 'music-11',
    name: 'Deep Focus',
    type: 'music',
    description: 'Deep and immersive frequencies',
    audioAsset: 'https://ik.imagekit.io/c10ypyqiwl/meditation-music/atlasaudio-deep-meditation-588149.mp3',
    isLoopable: true,
    categories: ['focus', 'breathing'],
  },
  {
    id: 'music-12',
    name: 'Zen Garden',
    type: 'music',
    description: 'A quiet zen garden atmosphere',
    audioAsset: 'https://ik.imagekit.io/c10ypyqiwl/meditation-music/leberch-meditation-509071.mp3',
    isLoopable: true,
    categories: ['peaceful', 'spa', 'relaxation'],
  },
  {
    id: 'music-13',
    name: 'Breathing Bowl',
    type: 'music',
    description: 'Mindful breathing guided by a singing bowl',
    audioAsset: 'https://ik.imagekit.io/c10ypyqiwl/meditation-music/meditativetiger-mindful-breathing-bowl-guidance-388628.mp3',
    isLoopable: true,
    categories: ['breathing', 'mindfulness', 'spiritual'],
  },
  {
    id: 'music-14',
    name: 'Mindful Waves',
    type: 'music',
    description: 'Deep mindful breathing with soft waves',
    audioAsset: 'https://ik.imagekit.io/c10ypyqiwl/meditation-music/meditativetiger-deep-mindful-breathing-waves-511815.mp3',
    isLoopable: true,
    categories: ['sleep', 'stress-relief', 'calm'],
  },
  {
    id: 'music-15',
    name: 'Calm Breath',
    type: 'music',
    description: 'Gentle track focused on calming the breath',
    audioAsset: 'https://ik.imagekit.io/c10ypyqiwl/meditation-music/331music-calming-breathing-595468.mp3',
    isLoopable: true,
    categories: ['breathing', 'calm', 'relaxation', 'soft'],
  },
  {
    id: 'none',
    name: 'None',
    type: 'none',
    description: 'No background sound',
    audioAsset: undefined,
    isLoopable: false,
  },
];

/** Look up a background sound by id. */
export function getBackgroundSound(id: string): BackgroundSound | undefined {
  return BACKGROUND_SOUNDS.find((s) => s.id === id);
}

/** All selectable sounds (excludes 'none'). Can filter by category. */
export function getSelectableSounds(categoryId?: string): BackgroundSound[] {
  let sounds = BACKGROUND_SOUNDS.filter((s) => s.type !== 'none');
  if (categoryId) {
    sounds = sounds.filter(s => !s.categories || s.categories.includes(categoryId));
  }
  return sounds;
}
