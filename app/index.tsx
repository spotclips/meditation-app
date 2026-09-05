import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing,
  runOnJS
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  
  const progress = useSharedValue(0);
  const contentOpacity = useSharedValue(0);

  useEffect(() => {
    // Fade in text content
    contentOpacity.value = withTiming(1, { duration: 800 });
    
    // Animate progress bar over 2.5 seconds
    progress.value = withTiming(
      1, 
      { duration: 2500, easing: Easing.inOut(Easing.ease) },
      (finished) => {
        if (finished) {
          runOnJS(navigateToHome)();
        }
      }
    );
  }, []);

  const navigateToHome = () => {
    router.replace('/(tabs)');
  };

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });
  
  const contentStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value,
      alignItems: 'center',
    };
  });

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/images/splash_screen_new.png')}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
        resizeMode="contain"
      />
      
      {/* Bottom Progress Area */}
      <Animated.View style={[styles.bottomArea, contentStyle]}>
        <View style={styles.progressBarContainer}>
          <Animated.View style={[styles.progressBarFill, progressStyle]}>
            <LinearGradient
              colors={['#F6D673', '#EFA48B']} // Warm, glowing sunset/gold colors
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </View>
        <Text style={styles.loadingText}>Preparing your calm...</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181829', // Matching the image's night sky edge
  },
  bottomArea: {
    position: 'absolute',
    bottom: height * 0.12,
    width: '100%',
    alignItems: 'center',
  },
  progressBarContainer: {
    width: width * 0.65,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  loadingText: {
    fontWeight: '500',
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 24,
  },
});
