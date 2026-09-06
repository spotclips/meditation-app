import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { getSelectableSounds } from '../../src/content/background-sounds';
import { colors } from '../../src/utils/theme';
import { globalAudioManager } from '../../src/audio/AudioManager';
import { useTranslation } from '../../src/i18n/LanguageContext';

const getIconForSound = (sound: any): keyof typeof Ionicons.glyphMap => {
  if (sound.type === 'rain') return 'rainy-outline';
  
  const name = sound.name.toLowerCase();
  if (name.includes('serenity') || name.includes('sleep') || sound.categories?.includes('sleep')) return 'moon-outline';
  if (name.includes('tranquil') || name.includes('space') || name.includes('ambient') || sound.categories?.includes('relaxation')) return 'cloud-outline';
  if (name.includes('ocean') || name.includes('wave') || name.includes('water')) return 'water-outline';
  if (name.includes('forest') || name.includes('wind') || name.includes('breath')) return 'leaf-outline';
  
  return 'musical-notes-outline';
};

export default function SoundsScreen() {
  const sounds = getSelectableSounds();
  const [playingId, setPlayingId] = useState<string | null>(null);
  const { t } = useTranslation();

  useFocusEffect(
    useCallback(() => {
      // Nothing on focus
      return () => {
        // Cleanup audio when leaving the tab
        globalAudioManager.stopBackground();
        setPlayingId(null);
      };
    }, [])
  );

  const togglePlay = async (id: string) => {
    if (playingId === id) {
      globalAudioManager.pauseBackground();
      setPlayingId(null);
    } else {
      const sound = sounds.find(s => s.id === id);
      if (sound && sound.audioAsset) {
        await globalAudioManager.loadBackground(sound.audioAsset);
        globalAudioManager.playBackground();
        setPlayingId(id);
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>{t('playlist')}</Text>

        <View style={styles.list}>
          {sounds.map((sound) => {
            const iconName = getIconForSound(sound);
            const isPlaying = playingId === sound.id;

            return (
              <TouchableOpacity
                key={sound.id}
                style={[
                  styles.soundRow,
                  isPlaying && styles.soundRowActive
                ]}
                activeOpacity={0.7}
                onPress={() => togglePlay(sound.id)}
              >
                <Ionicons 
                  name={iconName} 
                  size={24} 
                  color={isPlaying ? '#87BA86' : '#9AA0B1'} 
                  style={styles.icon}
                />
                
                <Text style={[
                  styles.soundName,
                  isPlaying ? styles.soundNameActive : styles.soundNameInactive
                ]}>
                  {sound.name}
                </Text>

                {isPlaying && (
                  <FontAwesome 
                    name="pause" 
                    size={14} 
                    color="#87BA86" 
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingTop: 80,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#656A7A',
    marginBottom: 20,
    marginLeft: 4,
  },
  list: {
    gap: 2,
  },
  soundRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  soundRowActive: {
    backgroundColor: '#EDF5EC',
  },
  icon: {
    marginRight: 16,
  },
  soundName: {
    flex: 1,
    fontSize: 18,
    fontWeight: '400',
  },
  soundNameActive: {
    color: '#87BA86',
  },
  soundNameInactive: {
    color: '#343B57',
  },
});


