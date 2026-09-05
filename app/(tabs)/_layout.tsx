/**
 * Bottom tab navigation layout.
 *
 * Tabs: Library · Sounds · Settings
 * Styled to match the premium dark purple aesthetic.
 */

import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing } from '../../src/utils/theme';

function TabIcon({ icon, label, focused }: { icon: any; label: string; focused: boolean }) {
  return (
    <View style={styles.tabItem}>
      <Feather 
        name={icon} 
        size={24} 
        color={focused ? colors.accent.secondary : colors.text.tertiary} 
        style={[styles.tabIcon, focused && styles.tabIconActive]}
      />
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
    </View>
  );
}

import { useTranslation } from '../../src/i18n/LanguageContext';

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('home'),
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="layout" label={t('home')} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: t('history'),
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="clock" label={t('history')} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="sounds"
        options={{
          title: t('sounds'),
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="bar-chart-2" label={t('sounds')} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('profile'),
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="user" label={t('profile')} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.bg.secondary,
    borderTopWidth: 0,
    paddingTop: spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? 28 : spacing.lg,
    height: Platform.OS === 'ios' ? 88 : 70,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingTop: 4,
  },
  tabIcon: {
    opacity: 0.8,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    fontWeight: '500',
    fontSize: 10,
    color: colors.text.tertiary,
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    color: colors.accent.secondary,
    fontWeight: '600',
  },
});
