/**
 * Root layout — Stack navigator.
 * Tab screens live inside (tabs) group.
 * Meditation detail and session screens are pushed on top.
 */

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../src/utils/theme';

import { LanguageProvider } from '../src/i18n/LanguageContext';

export default function RootLayout() {
  return (
    <LanguageProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg.primary },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="meditation/[id]"
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="meditation/session"
          options={{
            animation: 'fade',
            gestureEnabled: false,
          }}
        />
      </Stack>
    </LanguageProvider>
  );
}
