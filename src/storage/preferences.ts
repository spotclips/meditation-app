/**
 * Local storage for user preferences.
 *
 * Uses AsyncStorage for simple key-value persistence.
 * No database — just preferences.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { EndingType } from '../types/session';

// ---------------------------------------------------------------------------
// Keys
// ---------------------------------------------------------------------------

const KEYS = {
  VOICE_VOLUME: '@stillness/voice_volume',
  BACKGROUND_VOLUME: '@stillness/background_volume',
  DEFAULT_DURATION: '@stillness/default_duration',
  DEFAULT_BACKGROUND: '@stillness/default_background',
  DEFAULT_ENDING: '@stillness/default_ending',
  VOICE_ENABLED: '@stillness/voice_enabled',
} as const;

// ---------------------------------------------------------------------------
// Preferences Interface
// ---------------------------------------------------------------------------

export interface UserPreferences {
  voiceVolume: number;
  backgroundVolume: number;
  defaultDurationSeconds: number;
  defaultBackgroundSoundId: string | null;
  defaultEndingType: EndingType;
  voiceEnabled: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  voiceVolume: 1.0,
  backgroundVolume: 0.6,
  defaultDurationSeconds: 600,
  defaultBackgroundSoundId: null,
  defaultEndingType: 'bell',
  voiceEnabled: true,
};

// ---------------------------------------------------------------------------
// Read / Write
// ---------------------------------------------------------------------------

/**
 * Load all user preferences. Returns defaults for any missing values.
 */
export async function loadPreferences(): Promise<UserPreferences> {
  try {
    const keys = Object.values(KEYS);
    const stored = await AsyncStorage.getMany(keys);

    return {
      voiceVolume: stored[KEYS.VOICE_VOLUME]
        ? parseFloat(stored[KEYS.VOICE_VOLUME]!)
        : DEFAULT_PREFERENCES.voiceVolume,
      backgroundVolume: stored[KEYS.BACKGROUND_VOLUME]
        ? parseFloat(stored[KEYS.BACKGROUND_VOLUME]!)
        : DEFAULT_PREFERENCES.backgroundVolume,
      defaultDurationSeconds: stored[KEYS.DEFAULT_DURATION]
        ? parseInt(stored[KEYS.DEFAULT_DURATION]!, 10)
        : DEFAULT_PREFERENCES.defaultDurationSeconds,
      defaultBackgroundSoundId:
        stored[KEYS.DEFAULT_BACKGROUND] ?? DEFAULT_PREFERENCES.defaultBackgroundSoundId,
      defaultEndingType:
        (stored[KEYS.DEFAULT_ENDING] as EndingType) ??
        DEFAULT_PREFERENCES.defaultEndingType,
      voiceEnabled: stored[KEYS.VOICE_ENABLED]
        ? stored[KEYS.VOICE_ENABLED] === 'true'
        : DEFAULT_PREFERENCES.voiceEnabled,
    };
  } catch (error) {
    console.warn('[Preferences] Failed to load, using defaults:', error);
    return DEFAULT_PREFERENCES;
  }
}

/**
 * Save a partial set of preferences (only the provided keys are updated).
 */
export async function savePreferences(
  partial: Partial<UserPreferences>,
): Promise<void> {
  try {
    const entries: Record<string, string> = {};

    if (partial.voiceVolume !== undefined) {
      entries[KEYS.VOICE_VOLUME] = String(partial.voiceVolume);
    }
    if (partial.backgroundVolume !== undefined) {
      entries[KEYS.BACKGROUND_VOLUME] = String(partial.backgroundVolume);
    }
    if (partial.defaultDurationSeconds !== undefined) {
      entries[KEYS.DEFAULT_DURATION] = String(partial.defaultDurationSeconds);
    }
    if (partial.defaultBackgroundSoundId !== undefined) {
      entries[KEYS.DEFAULT_BACKGROUND] = partial.defaultBackgroundSoundId ?? '';
    }
    if (partial.defaultEndingType !== undefined) {
      entries[KEYS.DEFAULT_ENDING] = partial.defaultEndingType;
    }
    if (partial.voiceEnabled !== undefined) {
      entries[KEYS.VOICE_ENABLED] = String(partial.voiceEnabled);
    }

    if (Object.keys(entries).length > 0) {
      await AsyncStorage.setMany(entries);
    }
  } catch (error) {
    console.warn('[Preferences] Failed to save:', error);
  }
}

/**
 * Reset all preferences to defaults.
 */
export async function resetPreferences(): Promise<void> {
  try {
    const keys = Object.values(KEYS);
    await AsyncStorage.removeMany(keys);
  } catch (error) {
    console.warn('[Preferences] Failed to reset:', error);
  }
}
