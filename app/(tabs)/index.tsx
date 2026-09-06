import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography, radius, getCategoryGradient, getCategoryIconName } from '../../src/utils/theme';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

const { width } = Dimensions.get('window');

import { useRouter, useFocusEffect } from 'expo-router';
import { getSelectableSounds } from '../../src/content/background-sounds';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from '../../src/i18n/LanguageContext';

const categories = [
  { id: 'calm', label: 'Calm', meditationId: 'calm-breathing-5min' },
  { id: 'stress-relief', label: 'Stress Relief', meditationId: 'stress-relief-10min' },
  { id: 'sleep', label: 'Sleep', meditationId: 'sleep-15min' },
  { id: 'focus', label: 'Focus', meditationId: 'morning-focus-10min' },
  { id: 'mindfulness', label: 'Mindfulness', meditationId: 'deep-mindfulness-20min' },
  { id: 'relaxation', label: 'Relaxation', meditationId: 'calm-breathing-5min' },
  { id: 'breathing', label: 'Breathing', meditationId: 'calm-breathing-5min' },
  { id: 'yoga', label: 'Yoga', meditationId: 'deep-mindfulness-20min' },
  { id: 'spiritual', label: 'Spiritual', meditationId: 'deep-mindfulness-20min' },
  { id: 'peaceful', label: 'Peaceful', meditationId: 'calm-breathing-5min' },
  { id: 'spa', label: 'Spa', meditationId: 'sleep-15min' },
  { id: 'soft', label: 'Soft', meditationId: 'calm-breathing-5min' },
];

function getCategoryCardColor(id: string) {
  const map: Record<string, string> = {
    'calm': '#82C3D1',
    'stress-relief': '#8993E8',
    'sleep': colors.bg.darkCard,
    'focus': '#FBC576',
    'mindfulness': '#EFA48B',
    'relaxation': '#B69DD2',
    'breathing': '#99D0A8',
    'yoga': '#FFFFFF',
    'spiritual': '#252D47',
    'peaceful': '#B79BD0',
    'spa': '#E5B1CF',
    'soft': '#99CFA2',
  };
  return map[id] || colors.bg.surface;
}

const ILLUSTRATIONS: Record<string, any> = {
  'calm': require('../../assets/images/calm_illustration.png'),
  'stress-relief': require('../../assets/images/stress_relief_illustration.png'),
  'focus': require('../../assets/images/focus_illustration.png'),
  'sleep': require('../../assets/images/sleep_illustration.png'),
  'mindfulness': require('../../assets/images/mindfulness_illustration.png'),
  'relaxation': require('../../assets/images/relaxation_illustration.png'),
  'breathing': require('../../assets/images/breathing_illustration.png'),
  'yoga': require('../../assets/images/new_yoga_illustration.png'),
  'spiritual': require('../../assets/images/spiritual_illustration.png'),
  'peaceful': require('../../assets/images/peaceful_illustration.png'),
  'spa': require('../../assets/images/soft_illustration.png'),
  'soft': require('../../assets/images/yoga_illustration.png'),
};

const TOP_CARD_WIDTH = width * 0.86;
const BOTTOM_CARD_WIDTH = width * 0.86;

export default function MyPlanScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [favouriteIds, setFavouriteIds] = useState<string[]>([]);
  const [userName, setUserName] = useState<string>('');
  const [mood, setMood] = useState<string | null>(null);
  const [moodModalVisible, setMoodModalVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        try {
          const storedFavs = await AsyncStorage.getItem('FAVOURITES');
          if (storedFavs) {
            setFavouriteIds(JSON.parse(storedFavs));
          }
          const storedName = await AsyncStorage.getItem('USER_NAME');
          if (storedName) {
            setUserName(storedName);
          } else {
            setUserName('');
          }
        } catch (e) {
          console.error('Failed to load data', e);
        }
        
        try {
          const storedMoodStr = await AsyncStorage.getItem('USER_MOOD');
          if (storedMoodStr) {
            const storedMood = JSON.parse(storedMoodStr);
            const today = new Date().toDateString();
            if (storedMood.date === today) {
              setMood(storedMood.mood);
            } else {
              setMood(null); // Reset mood on a new day
            }
          }
        } catch (e) {
          console.error('Failed to load mood', e);
        }
      };
      loadData();
    }, [])
  );

  const toggleFavourite = async (catId: string) => {
    try {
      const isFav = favouriteIds.includes(catId);
      let newFavs;
      if (isFav) {
        newFavs = favouriteIds.filter(id => id !== catId);
      } else {
        newFavs = [catId, ...favouriteIds];
      }
      setFavouriteIds(newFavs);
      await AsyncStorage.setItem('FAVOURITES', JSON.stringify(newFavs));
    } catch (e) {
      console.error('Failed to save favourite', e);
    }
  };
  
  const handleMoodSelect = async (selectedMood: string) => {
    setMood(selectedMood);
    setMoodModalVisible(false);
    try {
      await AsyncStorage.setItem('USER_MOOD', JSON.stringify({
        mood: selectedMood,
        date: new Date().toDateString()
      }));
    } catch (e) {
      console.error('Failed to save mood', e);
    }
  };

  const MOOD_MAP: Record<string, { icon: any, color: string, label: string }> = {
    'great': { icon: 'smile', color: '#8DB776', label: 'Great' },
    'neutral': { icon: 'meh', color: '#FBC576', label: 'Okay' },
    'stressed': { icon: 'frown', color: '#FF5252', label: 'Stressed' },
    'tired': { icon: 'tired', color: '#8993E8', label: 'Tired' },
  };
  
  const currentHour = new Date().getHours();
  const isDay = currentHour >= 6 && currentHour < 18;
  const logoIcon = isDay ? 'sun' : 'moon';
  const logoColor = isDay ? colors.accent.warm : colors.accent.primary;

  let recommendationId = 'calm';
  let greetingKey: any = 'goodMorning';
  if (currentHour >= 5 && currentHour < 12) {
    recommendationId = 'focus';
    greetingKey = 'goodMorning';
  } else if (currentHour >= 12 && currentHour < 17) {
    recommendationId = 'calm';
    greetingKey = 'goodAfternoon';
  } else if (currentHour >= 17 && currentHour < 21) {
    recommendationId = 'stress-relief';
    greetingKey = 'goodEvening';
  } else {
    recommendationId = 'sleep';
    greetingKey = 'goodNight';
  }

  let greeting = t(greetingKey);

  if (userName.trim().length > 0) {
    greeting += `, ${userName.trim()}`;
  }

  // Mood-based Recommendation Override
  if (mood === 'great') {
    recommendationId = 'mindfulness';
  } else if (mood === 'stressed') {
    recommendationId = 'stress-relief';
  } else if (mood === 'tired') {
    recommendationId = 'sleep';
  }

  const recommendedCategory = categories.find(c => c.id === recommendationId);

  const renderTopCard = (category: any, cardWidth: number) => {
    if (!category) return null;
    const durationMatch = category.meditationId.match(/(\d+)min$/);
    const duration = durationMatch ? durationMatch[1] : '10';
    const titleLines = category.label.split(' ');
    const formattedTitle = titleLines.length > 1 ? `${titleLines[0]}\n${titleLines.slice(1).join(' ')}` : titleLines[0];

    const cardBg = getCategoryCardColor(category.id);
    const isDarkBg = category.id === 'sleep' || category.id === 'stress-relief' || category.id === 'relaxation' || category.id === 'spiritual';
    const textColor = isDarkBg ? colors.text.inverse : colors.text.primary;
    const iconName = getCategoryIconName(category.id);

    return (
      <TouchableOpacity 
        key={category.id}
        style={[
          styles.topCard, 
          { width: cardWidth, backgroundColor: cardBg },
          category.isLast ? {} : { marginRight: spacing.md }
        ]} 
        activeOpacity={0.9}
        onPress={() => router.push(`/meditation/session?id=${category.meditationId}`)}
      >
        {ILLUSTRATIONS[category.id] ? (
          <Image 
            source={ILLUSTRATIONS[category.id]} 
            style={[styles.topCardIllustration, category.id === 'yoga' ? { right: 0, bottom: 0, resizeMode: 'cover' } : {}]}
            resizeMode="contain"
          />
        ) : (
          <Feather 
            name={iconName} 
            size={120} 
            color={isDarkBg ? "#FFFFFF" : "#000000"} 
            style={{ position: 'absolute', right: -20, bottom: -20, opacity: 0.1 }} 
          />
        )}
        
        <View style={styles.topCardContent}>
          <Text style={[styles.topCardTitle, { color: textColor }]}>{formattedTitle}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <View style={styles.playButtonSmall}>
              <FontAwesome name="play" size={14} color={cardBg === '#FFFFFF' ? '#F3C583' : cardBg} style={styles.playIconSmall} />
            </View>
            <View style={[styles.durationRow, { marginLeft: 12 }]}>
              <Feather name="clock" size={14} color={textColor} />
              <Text style={[styles.durationText, { color: textColor }]}>{duration} min</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header with Logo and Date */}
        <View style={styles.header}>
          <View style={styles.headerLogoPlaceholder}>
            <Feather name={logoIcon} size={24} color={logoColor} />
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <TouchableOpacity style={styles.moodIconBtn} onPress={() => setMoodModalVisible(true)}>
              {mood ? (
                <FontAwesome5 name={MOOD_MAP[mood].icon} size={24} color={MOOD_MAP[mood].color} solid={false} />
              ) : (
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                  <FontAwesome5 name="smile" size={24} color={colors.text.secondary} style={{opacity: 0.7}} solid={false} />
                  <Text style={[styles.dateText, {fontSize: 15, opacity: 0.7}]}>Set Mood</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.dateChip}>
              <Text style={styles.dateText}>Monday, Jan 29</Text>
            </View>
          </View>
        </View>

        {/* Recommendation Section */}
        <View style={styles.recommendationHeader}>
          <Text style={styles.greetingText}>{greeting}</Text>
        </View>
        <Text style={styles.sectionTitle}>{t('recommendedForYou')}</Text>
        <View style={styles.recommendationContainer}>
          {renderTopCard({...recommendedCategory, isLast: true}, TOP_CARD_WIDTH)}
        </View>

        {/* Favourite Section */}
        {favouriteIds.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>{t('favourite')}</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[styles.topCardScroll, { paddingHorizontal: (width - TOP_CARD_WIDTH) / 2 }]}
              decelerationRate="fast"
              snapToInterval={TOP_CARD_WIDTH + spacing.md}
              snapToAlignment="start"
            >
              {favouriteIds.map((favId, index) => {
                const favCategory = categories.find(c => c.id === favId);
                return renderTopCard({...favCategory, isLast: index === favouriteIds.length - 1}, TOP_CARD_WIDTH);
              })}
            </ScrollView>
          </>
        )}

        {/* Categories Section */}
        <Text style={styles.sectionTitle}>{t('categories')}</Text>

        {/* Bottom Horizontal ScrollView */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.horizontalScroll, { paddingHorizontal: (width - BOTTOM_CARD_WIDTH) / 2 }]}
          decelerationRate="fast"
          snapToInterval={BOTTOM_CARD_WIDTH + spacing.md}
          snapToAlignment="start"
        >
          {categories.map((cat, index) => {
            const cardBg = getCategoryCardColor(cat.id);
            const iconName = getCategoryIconName(cat.id);
            const isDarkBg = cat.id === 'sleep' || cat.id === 'stress-relief' || cat.id === 'relaxation' || cat.id === 'spiritual';
            const trackCount = getSelectableSounds(cat.id).length;
            const isFav = favouriteIds.includes(cat.id);

            return (
              <TouchableOpacity 
                key={cat.id} 
                style={[
                  styles.bottomCard, 
                  { backgroundColor: cardBg },
                  index === categories.length - 1 ? {} : { marginRight: spacing.md }
                ]} 
                activeOpacity={0.9}
                onPress={() => router.push(`/meditation/session?id=${cat.meditationId}`)}
              >
                <TouchableOpacity
                  style={[styles.heartButton, { backgroundColor: isDarkBg ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.06)' }]}
                  onPress={() => toggleFavourite(cat.id)}
                  hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                >
                  <FontAwesome 
                    name={isFav ? "heart" : "heart-o"} 
                    size={16} 
                    color={isFav ? "#FF5252" : (isDarkBg ? "#FFFFFF" : "#000000")} 
                    style={{ opacity: isFav ? 1 : 0.4 }} 
                  />
                </TouchableOpacity>

                {ILLUSTRATIONS[cat.id] ? (
                  <View style={styles.illustrationWrapper}>
                    <Image 
                      source={ILLUSTRATIONS[cat.id]} 
                      style={styles.illustrationBottom}
                      resizeMode="contain"
                    />
                  </View>
                ) : (
                  <Feather 
                    name={iconName} 
                    size={160} 
                    color={isDarkBg ? "#FFFFFF" : "#000000"} 
                    style={{ position: 'absolute', top: 40, right: -30, opacity: 0.1 }} 
                  />
                )}

                <View style={[styles.cardFooterLight, { borderTopLeftRadius: 0 }]}>
                  {/* Inverted Corner Mask for Top-Left */}
                  <View style={[styles.invertedCornerContainer, { backgroundColor: 'transparent' }]}>
                    <Svg width={24} height={24} viewBox="0 0 24 24">
                      <Path d="M 0 24 L 24 24 A 24 24 0 0 1 0 0 Z" fill="#F8F9FE" />
                    </Svg>
                  </View>

                  <View style={[styles.footerRow, { alignItems: 'center' }]}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cardTitleDark}>{cat.label}</Text>
                      <Text style={{ fontSize: 13, color: 'rgba(0,0,0,0.5)', marginTop: 2, fontWeight: '500' }}>
                        {trackCount} {t('playlistTracks')}
                      </Text>
                    </View>
                    <View style={styles.playButtonSmall}>
                      <FontAwesome name="play" size={14} color={cardBg === '#FFFFFF' ? '#F3C583' : cardBg} style={styles.playIconSmall} />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </ScrollView>

      {/* Mood Selection Modal */}
      <Modal visible={moodModalVisible} transparent animationType="fade">
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setMoodModalVisible(false)}
        >
          <TouchableOpacity 
            activeOpacity={1} 
            style={styles.modalContent}
            onPress={() => {}} // Block tap-through
          >
            <Text style={styles.modalTitle}>How are you feeling?</Text>
            <View style={styles.moodOptionsRow}>
              {Object.entries(MOOD_MAP).map(([key, data]) => {
                const isActive = mood === key;
                return (
                  <TouchableOpacity 
                    key={key} 
                    style={styles.moodOptionItem}
                    onPress={() => handleMoodSelect(key)}
                  >
                    <FontAwesome5 
                      name={data.icon} 
                      size={28} 
                      color={isActive ? data.color : '#C4C4C4'} 
                      style={{marginBottom: 10}} 
                      solid={false}
                    />
                    <Text 
                      style={[
                        styles.moodOptionLabel, 
                        { color: isActive ? data.color : '#999999', fontWeight: isActive ? '600' : '400' }
                      ]}
                      numberOfLines={1}
                    >
                      {data.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  scrollContent: {
    paddingTop: spacing.lg,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontWeight: '400',
    fontSize: 22,
    color: colors.text.primary,
    paddingHorizontal: width * 0.07,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.07,
    marginBottom: spacing.lg,
  },
  recommendationHeader: {
    paddingHorizontal: width * 0.07,
    marginBottom: spacing.lg,
  },
  greetingText: {
    fontWeight: '700',
    fontSize: 28,
    color: colors.text.primary,
    marginBottom: 4,
  },
  subGreetingText: {
    fontWeight: '400',
    fontSize: 16,
    color: colors.text.secondary,
  },
  recommendationContainer: {
            alignItems: 'center',
            marginBottom: spacing['2xl'],
          },
  headerLogoPlaceholder: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  dateChip: {
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  dateText: {
    color: colors.text.secondary,
    fontWeight: '500',
    fontSize: 15,
  },
  moodIconBtn: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.85,
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: spacing.xl,
    paddingVertical: spacing['2xl'],
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xl,
    marginTop: spacing.sm,
  },
  moodOptionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  moodOptionItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  moodOptionLabel: {
    fontSize: 13,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  pageTitle: {
    fontWeight: '700',
    fontSize: 32,
    color: colors.text.primary,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  chipScrollWrapper: {
    marginBottom: spacing.xl,
  },
  chipScroll: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  chip: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipLabel: {
    fontWeight: '500',
    fontSize: 14,
    color: '#555555',
  },
  topCardScroll: {
    marginBottom: spacing['2xl'],
  },
  topCard: {
    backgroundColor: colors.bg.surface,
    borderRadius: 28,
    padding: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    height: 160,
    overflow: 'hidden',
  },
  topCardContent: {
    flex: 1,
    zIndex: 2,
  },
  topCardTitle: {
    fontWeight: '400',
    fontSize: 22,
    color: colors.text.inverse,
    marginBottom: 12,
    lineHeight: 28,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  durationText: {
    color: colors.text.inverse,
    fontWeight: '500',
    fontSize: 13,
    opacity: 0.9,
  },
  topCardIllustration: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    width: 180,
    height: 180,
    zIndex: 1,
  },
  illustration: {
    position: 'absolute',
    bottom: -10,
    left: '35%',
    width: 170,
    height: 170,
    zIndex: 1,
  },
  playButtonWrapper: {
    position: 'absolute',
    right: spacing.xl,
    top: '50%',
    marginTop: -26,
    zIndex: 2,
  },
  playButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  playIcon: {
    marginLeft: 4, 
  },
  playIconSmall: {
    marginLeft: 3,
  },
  horizontalScroll: {
    // defined inline
  },
  bottomCard: {
    width: BOTTOM_CARD_WIDTH,
    height: 320,
    borderRadius: 32,
    overflow: 'hidden',
  },
  sleepCard: {
    backgroundColor: colors.bg.darkCard,
  },
  musicCard: {
    backgroundColor: colors.bg.yellowCard,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    zIndex: 2,
  },
  progressTextBig: {
    fontWeight: '600',
    fontSize: 36,
    color: colors.text.inverse,
  },
  progressTextSmall: {
    fontWeight: '500',
    fontSize: 18,
    color: colors.text.inverse,
    opacity: 0.7,
  },
  progressTextBigDark: {
    fontWeight: '600',
    fontSize: 36,
    color: colors.text.primary,
  },
  progressTextSmallDark: {
    fontWeight: '500',
    fontSize: 18,
    color: colors.text.primary,
    opacity: 0.7,
  },
  illustrationWrapper: {
    position: 'absolute',
    top: -30,
    left: -20,
    right: 0,
    bottom: 40,
    overflow: 'hidden',
    zIndex: 1,
  },
  illustrationBottom: {
    width: '125%',
    height: 350,
  },
  cardFooterLight: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F8F9FE',
    borderTopRightRadius: 32,
    padding: spacing.xl,
    paddingBottom: spacing.xl + 4,
    zIndex: 3,
  },
  invertedCornerContainer: {
    position: 'absolute',
    top: -24,
    left: 0,
    width: 24,
    height: 24,
    backgroundColor: '#F8F9FE',
  },
  invertedCornerMask: {
    flex: 1,
    borderBottomLeftRadius: 24,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  tagText: {
    fontWeight: '500',
    fontSize: 12,
    color: colors.text.secondary,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardTitleDark: {
    fontWeight: '400',
    fontSize: 18,
    color: colors.text.primary,
    lineHeight: 24,
  },
  playButtonSmall: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  bottomSpacer: {
    height: spacing['4xl'],
  },
  heartButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
