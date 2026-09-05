/**
 * Design system / theme.
 *
 * Inspired by premium meditation app aesthetics:
 * - Deep purple/navy gradient palette
 * - Lavender and soft purple accents
 * - Glassmorphism cards
 * - Warm, calming color temperature
 */

export const colors = {
  // Light mode background
  bg: {
    primary: '#F2F3FB',      // Main background
    secondary: '#FFFFFF',    // Pure white for cards/tabbar
    tertiary: '#EBEBFE',     // Light purple for pills
    surface: '#8993E8',      // Top card purple
    darkCard: '#474E79',     // Sleep card dark blue
    yellowCard: '#FBC576',   // Music card yellow
  },

  accent: {
    primary: '#8B95EE',      // Soft purple
    secondary: '#474E79',    
    tertiary: '#FBC576',
    warm: '#FBC576',         
    glow: '#8B95EE',         
    glowLight: '#EBEBFE',    
  },

  text: {
    primary: '#343B57',      // Very dark blue/grey
    secondary: '#8D92B3',    // Muted grey text
    tertiary: '#B0B4CE',     // Even lighter grey
    muted: '#C1C4DB',        // Extremely light grey
    inverse: '#FFFFFF',      // White text on dark cards
  },

  glass: {
    bg: 'rgba(255, 255, 255, 0.4)',
    bgHover: 'rgba(255, 255, 255, 0.6)',
    bgLight: 'rgba(255, 255, 255, 0.8)',
    border: 'rgba(255, 255, 255, 0.3)',
    borderLight: 'rgba(255, 255, 255, 0.5)',
  },

  gradients: {
    calm: ['#8993E8', '#9DA6F5'] as const,
    stress: ['#8993E8', '#9DA6F5'] as const,
    sleep: ['#474E79', '#383D62'] as const,
    focus: ['#FBC576', '#FCD79B'] as const,
    mindfulness: ['#8993E8', '#9DA6F5'] as const,
    relaxation: ['#8993E8', '#9DA6F5'] as const,
    breathing: ['#8993E8', '#9DA6F5'] as const,
    featured: ['#8993E8', '#9DA6F5'] as const,
    player: ['#F2F3FB', '#EBEBFE'] as const,
  },

  success: '#00B894',
  warning: '#FBC576',
  error: '#E17055',
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.2)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
} as const;

export const typography = {
  hero: {
    fontWeight: '800' as const,
    fontSize: 36,
    letterSpacing: -0.5,
    lineHeight: 42,
  },
  title: {
    fontWeight: '700' as const,
    fontSize: 28,
    letterSpacing: -0.3,
    lineHeight: 34,
  },
  heading: {
    fontWeight: '600' as const,
    fontSize: 22,
    letterSpacing: -0.2,
    lineHeight: 28,
  },
  subtitle: {
    fontWeight: '600' as const,
    fontSize: 18,
    letterSpacing: 0,
    lineHeight: 24,
  },
  body: {
    fontWeight: '400' as const,
    fontSize: 15,
    letterSpacing: 0.1,
    lineHeight: 22,
  },
  bodySmall: {
    fontWeight: '400' as const,
    fontSize: 13,
    letterSpacing: 0.1,
    lineHeight: 18,
  },
  label: {
    fontWeight: '700' as const,
    fontSize: 11,
    letterSpacing: 1.5,
    lineHeight: 14,
  },
  timer: {
    fontWeight: '200' as const,
    fontSize: 72,
    letterSpacing: -2,
    lineHeight: 80,
  },
  phase: {
    fontWeight: '600' as const,
    fontSize: 24,
    letterSpacing: 2,
    lineHeight: 30,
  },
} as const;

export const glassShadow = {
  shadowColor: '#343B57',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.05,
  shadowRadius: 12,
  elevation: 4,
} as const;

export const glowShadow = {
  shadowColor: colors.accent.glow,
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.2,
  shadowRadius: 20,
  elevation: 10,
} as const;

export function getCategoryGradient(category: string): readonly [string, string] {
  const map: Record<string, readonly [string, string]> = {
    calm: colors.gradients.calm,
    'stress-relief': colors.gradients.stress,
    sleep: colors.gradients.sleep,
    focus: colors.gradients.focus,
    mindfulness: colors.gradients.mindfulness,
    relaxation: colors.gradients.relaxation,
    breathing: colors.gradients.breathing,
  };
  return map[category] ?? colors.gradients.featured;
}

/** Category icon mapping using Feather icon names instead of Emojis */
export function getCategoryIconName(category: string): any {
  const map: Record<string, any> = {
    calm: 'wind',
    'stress-relief': 'sun',
    sleep: 'moon',
    focus: 'target',
    mindfulness: 'user',
    relaxation: 'cloud',
    breathing: 'wind',
    yoga: 'activity',
    spiritual: 'star',
    peaceful: 'feather',
    spa: 'droplet',
    soft: 'heart',
  };
  return map[category] ?? 'star';
}
