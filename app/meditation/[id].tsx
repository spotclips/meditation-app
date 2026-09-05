/**
 * Meditation detail screen.
 *
 * Premium design with gradient header, posture card, and
 * glassmorphism sections. Matches the deep purple aesthetic.
 */

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getMeditation } from '../../src/content/meditations';
import { getBreathingPattern } from '../../src/content/breathing-patterns';
import { formatDurationLabel } from '../../src/utils/time';
import {
  colors,
  spacing,
  radius,
  typography,
  glassShadow,
  getCategoryGradient,
  getCategoryIconName,
} from '../../src/utils/theme';
import { CATEGORY_LABELS, DIFFICULTY_LABELS } from '../../src/utils/constants';

export default function MeditationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const meditation = getMeditation(id ?? '');

  if (!meditation) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[colors.bg.primary, colors.bg.secondary]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.centered}>
          <Text style={styles.errorIcon}>🔍</Text>
          <Text style={styles.errorText}>Meditation not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => { if (router.canGoBack()) router.back(); else router.replace('/'); }}
          >
            <Text style={styles.backButtonText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const gradient = getCategoryGradient(meditation.category);
  const breathingPattern = meditation.defaultBreathingPatternId
    ? getBreathingPattern(meditation.defaultBreathingPatternId)
    : null;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.bg.primary, colors.bg.secondary, colors.bg.primary]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top navigation */}
        <View style={styles.nav}>
          <TouchableOpacity
            onPress={() => { if (router.canGoBack()) router.back(); else router.replace('/'); }}
            style={styles.navButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.navButtonText}>←</Text>
          </TouchableOpacity>
        </View>

        {/* Hero gradient header */}
        <LinearGradient
          colors={[gradient[0], gradient[1]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          {/* Decorative orbs */}
          <View style={styles.heroOrbLarge} />
          <View style={styles.heroOrbSmall} />
          <View style={styles.imageOverlay}>
            <Feather name={getCategoryIconName(meditation.category)} size={60} color="#FFFFFF" style={{ opacity: 0.9 }} />
          </View>

          <Text style={styles.heroCategory}>
            {CATEGORY_LABELS[meditation.category] ?? meditation.category}
          </Text>
          <Text style={styles.heroTitle}>{meditation.name}</Text>

          <View style={styles.heroMeta}>
            <View style={styles.heroPill}>
              <Text style={styles.heroPillText}>
                ⏱ {formatDurationLabel(meditation.durationSeconds)}
              </Text>
            </View>
            <View style={styles.heroPill}>
              <Text style={styles.heroPillText}>
                {DIFFICULTY_LABELS[meditation.difficulty]}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.description}>
            {meditation.longDescription ?? meditation.description}
          </Text>
        </View>

        {/* Posture card */}
        {meditation.posture && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>RECOMMENDED POSTURE</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoCardIcon}>
                <Text style={styles.infoCardEmoji}>🧘</Text>
              </View>
              <View style={styles.infoCardContent}>
                <Text style={styles.infoCardTitle}>
                  {meditation.posture.label}
                </Text>
                <Text style={styles.infoCardDesc}>
                  {meditation.posture.description}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Breathing pattern card */}
        {breathingPattern && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>BREATHING PATTERN</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoCardIcon}>
                <Text style={styles.infoCardEmoji}>💨</Text>
              </View>
              <View style={styles.infoCardContent}>
                <Text style={styles.infoCardTitle}>
                  {breathingPattern.name}
                </Text>
                <Text style={styles.infoCardDesc}>
                  {breathingPattern.description}
                </Text>
                <View style={styles.breathingMeta}>
                  <View style={styles.breathingPill}>
                    <Text style={styles.breathingPillText}>
                      In {breathingPattern.inhaleDuration}s
                    </Text>
                  </View>
                  {breathingPattern.holdDuration > 0 && (
                    <View style={styles.breathingPill}>
                      <Text style={styles.breathingPillText}>
                        Hold {breathingPattern.holdDuration}s
                      </Text>
                    </View>
                  )}
                  <View style={styles.breathingPill}>
                    <Text style={styles.breathingPillText}>
                      Out {breathingPattern.exhaleDuration}s
                    </Text>
                  </View>
                  {breathingPattern.restDuration > 0 && (
                    <View style={styles.breathingPill}>
                      <Text style={styles.breathingPillText}>
                        Rest {breathingPattern.restDuration}s
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Start button */}
        <View style={styles.startSection}>
          <TouchableOpacity
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={`Begin ${meditation.name}`}
            onPress={() =>
              router.push({
                pathname: '/meditation/session',
                params: { meditationId: meditation.id },
              })
            }
          >
            <LinearGradient
              colors={[colors.accent.primary, colors.accent.glow]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.startButton}
            >
              <Text style={styles.startButtonText}>Begin Meditation</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['3xl'],
  },
  scrollContent: {
    paddingTop: 56,
  },

  // Navigation
  nav: {
    flexDirection: 'row',
    paddingHorizontal: spacing['2xl'],
    marginBottom: spacing.lg,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.glass.bg,
    borderWidth: 1,
    borderColor: colors.glass.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonText: {
    fontSize: 22,
    color: colors.text.primary,
  },

  // Hero
  hero: {
    marginHorizontal: spacing['2xl'],
    borderRadius: radius['2xl'],
    padding: spacing['3xl'],
    overflow: 'hidden',
    position: 'relative',
    ...glassShadow,
  },
  heroOrbLarge: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  heroOrbSmall: {
    position: 'absolute',
    bottom: -20,
    right: 40,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    opacity: 0.05,
    transform: [{ scale: 1.5 }],
  },
  imageOverlay: {
    marginBottom: spacing.xl,
    alignSelf: 'center',
  },
  heroCategory: {
    ...typography.bodySmall,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: spacing.md,
  },
  heroTitle: {
    ...typography.hero,
    color: '#FFFFFF',
    marginBottom: spacing.lg,
  },
  heroMeta: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  heroPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  heroPillText: {
    ...typography.bodySmall,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Sections
  section: {
    paddingHorizontal: spacing['2xl'],
    marginTop: spacing['2xl'],
  },
  sectionLabel: {
    ...typography.label,
    color: colors.text.muted,
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 24,
  },

  // Info card
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.glass.bg,
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.glass.border,
    gap: spacing.lg,
    ...glassShadow,
  },
  infoCardIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: colors.glass.bgLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCardEmoji: {
    fontSize: 24,
  },
  infoCardContent: {
    flex: 1,
  },
  infoCardTitle: {
    ...typography.subtitle,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  infoCardDesc: {
    ...typography.bodySmall,
    color: colors.text.tertiary,
    lineHeight: 18,
  },

  // Breathing meta
  breathingMeta: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    flexWrap: 'wrap',
  },
  breathingPill: {
    backgroundColor: colors.glass.bg,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  breathingPillText: {
    ...typography.bodySmall,
    color: colors.accent.tertiary,
    fontWeight: '600',
    fontSize: 11,
  },

  // Start button
  startSection: {
    paddingHorizontal: spacing['2xl'],
    marginTop: spacing['3xl'],
  },
  startButton: {
    borderRadius: radius.xl,
    paddingVertical: spacing.xl,
    alignItems: 'center',
    ...glassShadow,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  // Error
  errorIcon: {
    fontSize: 48,
    marginBottom: spacing.lg,
  },
  errorText: {
    ...typography.subtitle,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
  },
  backButton: {
    backgroundColor: colors.glass.bg,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing['2xl'],
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  backButtonText: {
    ...typography.body,
    color: colors.accent.primary,
    fontWeight: '600',
  },
});
