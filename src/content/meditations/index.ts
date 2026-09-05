/**
 * Meditation content registry.
 *
 * All meditations are imported and registered here. To add a new meditation:
 * 1. Create a file in this directory following the Meditation interface
 * 2. Import and add it to the MEDITATIONS array below
 *
 * The rest of the app discovers meditations through this registry.
 */

import type { Meditation, MeditationCategory } from '../../types/meditation';

import calmBreathing from './calm-breathing';
import stressRelief from './stress-relief';
import morningFocus from './morning-focus';
import sleepMeditation from './sleep';
import deepMindfulness from './deep-mindfulness';

// Registry

/** All available meditations, ordered for library display. */
export const MEDITATIONS: Meditation[] = [
  calmBreathing,
  stressRelief,
  morningFocus,
  sleepMeditation,
  deepMindfulness,
];

// Lookup Helpers

/** Find a meditation by its id. */
export function getMeditation(id: string): Meditation | undefined {
  return MEDITATIONS.find((m) => m.id === id);
}

/** Get all meditations in a specific category. */
export function getMeditationsByCategory(
  category: MeditationCategory,
): Meditation[] {
  return MEDITATIONS.filter((m) => m.category === category);
}

/** Get all unique categories that have at least one meditation. */
export function getAvailableCategories(): MeditationCategory[] {
  const categories = new Set(MEDITATIONS.map((m) => m.category));
  return Array.from(categories);
}

/** Get meditations matching a search term (name, description, tags). */
export function searchMeditations(query: string): Meditation[] {
  const lower = query.toLowerCase().trim();
  if (!lower) return MEDITATIONS;

  return MEDITATIONS.filter(
    (m) =>
      m.name.toLowerCase().includes(lower) ||
      m.description.toLowerCase().includes(lower) ||
      m.tags?.some((t) => t.toLowerCase().includes(lower)),
  );
}
