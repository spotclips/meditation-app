import { useRef, useEffect, useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing as RNEasing,
  Modal,
  ScrollView,
} from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMeditation } from '../../src/content/meditations';
import { getSelectableSounds, getBackgroundSound } from '../../src/content/background-sounds';
import { useMeditationSession } from '../../src/hooks/use-meditation-session';
import { formatDuration } from '../../src/utils/time';

// Minimalist colors
const COLORS = {
  green: '#8DB776',
  orange: '#F58322',
  twilight: '#1A192D',
  white: '#FFFFFF',
};

// ---------------------------------------------------------------------------
// Dynamic Concentric Rings
// ---------------------------------------------------------------------------
function DynamicRings({ isPaused, phase, duration, isActive }: { isPaused: boolean, phase: string, duration: number, isActive: boolean }) {
  const scale = useRef(new Animated.Value(0.5)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isPaused || !isActive) {
      // Slow idle heartbeat animation
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(scale, {
              toValue: 0.6,
              duration: 2500,
              useNativeDriver: true,
              easing: RNEasing.inOut(RNEasing.ease),
            }),
            Animated.timing(opacity, {
              toValue: 0.3,
              duration: 2500,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(scale, {
              toValue: 0.5,
              duration: 2500,
              useNativeDriver: true,
              easing: RNEasing.inOut(RNEasing.ease),
            }),
            Animated.timing(opacity, {
              toValue: 0.15,
              duration: 2500,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
      return;
    }

    if (phase === 'inhale') {
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 1.5,
          duration: duration * 1000,
          useNativeDriver: true,
          easing: RNEasing.inOut(RNEasing.ease),
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: duration * 1000,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (phase === 'exhale') {
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 0.5,
          duration: duration * 1000,
          useNativeDriver: true,
          easing: RNEasing.inOut(RNEasing.ease),
        }),
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: duration * 1000,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isPaused, phase, duration, isActive, scale, opacity]);

  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={styles.ringsContainer}>
        {/* Far Outer Ring */}
        <Animated.View style={[styles.ring, { transform: [{ scale: Animated.multiply(scale, 1.7) }], opacity: Animated.multiply(opacity, 0.4) }]} />
        {/* Outer Ring */}
        <Animated.View style={[styles.ring, { transform: [{ scale: Animated.multiply(scale, 1.3) }], opacity: Animated.multiply(opacity, 0.7) }]} />
        {/* Middle Ring */}
        <Animated.View style={[styles.ring, { transform: [{ scale: Animated.multiply(scale, 0.9) }], opacity: Animated.multiply(opacity, 1.0) }]} />
        {/* Center Wave Ring */}
        <Animated.View style={[styles.ring, { transform: [{ scale: Animated.multiply(scale, 0.5) }], opacity: Animated.multiply(opacity, 1.5) }]} />
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Waveform Progress
// ---------------------------------------------------------------------------
function WaveformProgress({ progress, darkTheme = false }: { progress: number, darkTheme?: boolean }) {
  // A generic aesthetic waveform pattern
  const bars = [
    12, 20, 15, 25, 35, 20, 15, 30, 45, 35, 25, 20, 18, 25, 35, 
    40, 30, 20, 15, 25, 35, 45, 35, 25, 15, 20, 30, 25, 15, 12
  ];

  const activeColor = darkTheme ? '#333333' : '#FFFFFF';
  const inactiveColor = darkTheme ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.3)';

  return (
    <View style={styles.waveformContainer}>
      {bars.map((height, index) => {
        // Calculate if this bar is filled based on overall progress
        const isActive = (index / bars.length) <= progress;
        return (
          <View 
            key={index} 
            style={[
              styles.waveformBar, 
              { 
                height, 
                backgroundColor: isActive ? activeColor : inactiveColor 
              }
            ]} 
          />
        );
      })}
    </View>
  );
}

const MiniPlayingIndicator = ({ isPlaying }: { isPlaying: boolean }) => {
  const anim1 = useRef(new Animated.Value(0.4)).current;
  const anim2 = useRef(new Animated.Value(0.8)).current;
  const anim3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (!isPlaying) {
      anim1.stopAnimation();
      anim2.stopAnimation();
      anim3.stopAnimation();
      Animated.timing(anim1, { toValue: 0.3, duration: 200, useNativeDriver: true }).start();
      Animated.timing(anim2, { toValue: 0.3, duration: 200, useNativeDriver: true }).start();
      Animated.timing(anim3, { toValue: 0.3, duration: 200, useNativeDriver: true }).start();
      return;
    }

    const createAnimation = (anim: Animated.Value, min: number, max: number, duration: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: max, duration, useNativeDriver: true }),
          Animated.timing(anim, { toValue: min, duration, useNativeDriver: true }),
        ])
      );
    };

    const a1 = createAnimation(anim1, 0.4, 1, 400);
    const a2 = createAnimation(anim2, 0.3, 0.9, 300);
    const a3 = createAnimation(anim3, 0.5, 1, 500);

    a1.start();
    a2.start();
    a3.start();

    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, [isPlaying]);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, height: 16 }}>
      <Animated.View style={{ width: 3, height: 16, backgroundColor: COLORS.green, borderRadius: 2, transform: [{ scaleY: anim1 }] }} />
      <Animated.View style={{ width: 3, height: 16, backgroundColor: COLORS.green, borderRadius: 2, transform: [{ scaleY: anim2 }] }} />
      <Animated.View style={{ width: 3, height: 16, backgroundColor: COLORS.green, borderRadius: 2, transform: [{ scaleY: anim3 }] }} />
    </View>
  );
};

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Session Screen
// ---------------------------------------------------------------------------
export default function SessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const actualId = id ?? useLocalSearchParams().meditationId;
  const router = useRouter();
  const meditation = getMeditation(actualId as string ?? '');

  const {
    sessionState,
    breathingState,
    togglePlayPause,
    endSession,
    changeBackgroundSound,
    seekBy,
    currentBackgroundSoundId,
  } = useMeditationSession(actualId as string ?? '');


  const isPaused = sessionState.status === 'paused' || sessionState.status === 'idle';
  const elapsed = sessionState.elapsedSeconds;
  const duration = meditation ? meditation.durationSeconds : 1;
  const remaining = Math.max(0, duration - elapsed);
  const progress = Math.min(1, elapsed / duration);
  
  // Background Color Transition
  const bgAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let target = 0; // Paused -> Twilight
    if (!isPaused) {
      if (breathingState.currentPhase === 'inhale' || breathingState.currentPhase === 'hold') {
        target = 1; // Green
      } else if (breathingState.currentPhase === 'exhale' || breathingState.currentPhase === 'rest') {
        target = 2; // Orange
      }
    }
    
    Animated.timing(bgAnim, {
      toValue: target,
      duration: 1000,
      useNativeDriver: false, // color interpolation
    }).start();
  }, [isPaused, breathingState.currentPhase, bgAnim]);

  const backgroundColor = bgAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [COLORS.twilight, COLORS.green, COLORS.orange],
  });

  const handleEnd = useCallback(async () => {
    try {
      if (meditation && elapsed > 5) { 
        const historyRaw = await AsyncStorage.getItem('USER_HISTORY');
        const history = historyRaw ? JSON.parse(historyRaw) : [];
        history.unshift({
           id: Date.now().toString(),
           meditationId: meditation.id,
           name: meditation.name,
           duration: elapsed,
           timestamp: new Date().toISOString()
        });
        await AsyncStorage.setItem('USER_HISTORY', JSON.stringify(history));
      }
    } catch (e) {
      console.error('Failed to save session history', e);
    }

    endSession();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }, [router, endSession, meditation, elapsed]);

  if (!meditation) {
    return (
      <View style={[styles.container, { backgroundColor: COLORS.twilight, justifyContent: 'center' }]}>
        <Text style={styles.errorText}>Session not found</Text>
      </View>
    );
  }

  // Dynamic Text
  let centerText = "Paused";
  if (!isPaused && breathingState.isActive) {
    if (breathingState.currentPhase === 'inhale') centerText = "Breathe In...";
    else if (breathingState.currentPhase === 'hold') centerText = "Hold...";
    else if (breathingState.currentPhase === 'exhale') centerText = "Breathe out...";
    else centerText = "Rest...";
  } else if (!isPaused && !breathingState.isActive) {
    centerText = "Focus...";
  }

  // Top Pill Text logic
  let pillText = meditation.name;
  if (currentBackgroundSoundId) {
    const sound = getBackgroundSound(currentBackgroundSoundId);
    if (sound) {
      pillText = sound.name;
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: '#FFF' }]}>
      
      <Animated.View style={[styles.topHalf, { backgroundColor }]}>
        {/* Dynamic Expanding Rings */}
        <DynamicRings 
          isPaused={isPaused} 
          phase={breathingState.currentPhase} 
          duration={breathingState.phaseDuration} 
          isActive={breathingState.isActive}
        />

        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={handleEnd}>
            <Feather name="chevron-left" size={32} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.pillBtn}>
            <Text style={styles.pillText}>{meditation.name}</Text>
          </View>
        </View>

        {/* Center Text */}
        <View style={styles.centerpiece}>
          <Text style={styles.phaseText}>{centerText}</Text>
        </View>

        {/* Playback Controls */}
        <View style={styles.controls}>
          <WaveformProgress progress={progress} />
          <Text style={styles.timerText}>{formatDuration(remaining)}</Text>
          
          <View style={styles.playbackRow}>
            <TouchableOpacity 
              style={[styles.playPauseButton, styles.playPauseBtnWhite]} 
              activeOpacity={0.8}
              onPress={togglePlayPause}
            >
              <FontAwesome 
                name={isPaused ? 'play' : 'pause'} 
                size={24} 
                color={COLORS.twilight} 
                style={isPaused ? { marginLeft: 4 } : {}}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* Right side curve illusion */}
      <Animated.View style={{
        position: 'absolute',
        bottom: 152, // 200 (dock height) - 48 (curve radius)
        right: 0,
        width: 48,
        height: 48,
        backgroundColor,
      }} />

      <View style={styles.bottomDock}>
        <Text style={styles.dockTitle}>Playlist</Text>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          style={styles.verticalMusicScroll}
          contentContainerStyle={styles.verticalMusicScrollContent}
        >
          {getSelectableSounds(meditation?.category).map((sound) => {
            const isSelected = sound.id === currentBackgroundSoundId;
            let iconName: any = 'music';
            if (sound.type === 'rain') iconName = 'cloud-rain';
            else if (sound.type === 'none') iconName = 'volume-x';
            else {
              switch (sound.id) {
                case 'music': iconName = 'headphones'; break;
                case 'music-2': iconName = 'wind'; break;
                case 'music-3': iconName = 'moon'; break;
                case 'music-4': iconName = 'heart'; break;
                case 'music-5': iconName = 'feather'; break;
                case 'music-6': iconName = 'sun'; break;
                case 'music-7': iconName = 'speaker'; break;
                case 'music-8': iconName = 'cloud'; break;
                case 'music-9': iconName = 'wind'; break;
                case 'music-10': iconName = 'bell'; break;
                case 'music-11': iconName = 'target'; break;
                case 'music-12': iconName = 'disc'; break;
                case 'music-13': iconName = 'bell'; break;
                case 'music-14': iconName = 'activity'; break;
                case 'music-15': iconName = 'wind'; break;
                default: iconName = 'music'; break;
              }
            }
            
            return (
              <TouchableOpacity
                key={sound.id}
                style={[styles.dockMusicOption, isSelected && styles.dockMusicOptionSelected]}
                onPress={() => {
                  changeBackgroundSound(sound.id);
                  if (isPaused) {
                    togglePlayPause();
                  }
                }}
              >
                <Feather name={iconName} size={20} color={isSelected ? COLORS.green : '#AAA'} style={{ marginRight: 16, opacity: 0.8 }} />
                <View style={styles.dockMusicInfo}>
                  <Text style={[styles.dockMusicName, isSelected && styles.dockMusicNameSelected]}>
                    {sound.name}
                  </Text>
                </View>
                {isSelected && (
                  <MiniPlayingIndicator isPlaying={!isPaused} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  
  // Rings
  ringsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },

  // Header
  header: {
    paddingTop: 60,
    alignItems: 'center',
    zIndex: 10,
  },
  backBtn: {
    position: 'absolute',
    left: 20,
    top: 60,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  pillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  pillText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },

  // Centerpiece
  centerpiece: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    pointerEvents: 'none',
  },
  phaseText: {
    color: '#FFF',
    fontSize: 36,
    fontWeight: '500',
    letterSpacing: 0.5,
  },

  // Split Layout
  topHalf: {
    flex: 1,
    position: 'relative',
    borderBottomLeftRadius: 48,
    overflow: 'hidden',
  },
  bottomDock: {
    backgroundColor: '#FFFFFF',
    borderTopRightRadius: 48,
    paddingTop: 24,
    height: 200,
    zIndex: 1,
  },
  
  // Controls
  controls: {
    alignItems: 'center',
    paddingBottom: 24,
    zIndex: 10,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginBottom: 20,
    gap: 4,
  },
  waveformBar: {
    width: 4,
    borderRadius: 2,
  },
  timerText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
    marginBottom: 24,
  },
  playbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
  },
  sideButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  playPauseButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  playPauseBtnWhite: {
    backgroundColor: COLORS.white,
  },
  errorText: {
    color: '#FFF',
    fontSize: 18,
    textAlign: 'center',
    opacity: 0.8,
  },
  // Dock Music List
  verticalMusicScroll: {
    width: '100%',
    paddingHorizontal: 24,
  },
  verticalMusicScrollContent: {
    paddingBottom: 40,
    gap: 4,
  },
  dockTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#666',
    marginBottom: 12,
    paddingHorizontal: 24,
    textAlign: 'left',
  },
  dockMusicOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  dockMusicOptionSelected: {
    backgroundColor: '#E8F5E9',
    borderColor: COLORS.green,
  },
  dockMusicInfo: {
    flex: 1,
  },
  dockMusicName: {
    fontSize: 15,
    fontWeight: '400',
    color: '#555',
  },
  dockMusicNameSelected: {
    color: COLORS.green,
  },
  dockMusicDesc: {
    fontSize: 14,
    color: '#666',
  },
});
