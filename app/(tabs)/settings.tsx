import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Switch, Modal, TouchableOpacity } from 'react-native';
import { useTranslation } from '../../src/i18n/LanguageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, radius, typography, glassShadow } from '../../src/utils/theme';

export default function SettingsScreen() {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('');
  const [askFeeling, setAskFeeling] = useState(true);

  const { t, language, setLanguage } = useTranslation();

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'gender' | 'timezone' | 'language' | null>(null);
  const [moodPromptVisible, setMoodPromptVisible] = useState(false);

  const genderOptions = ['Female', 'Male', 'Non-binary', 'Prefer not to say'];
  const timezoneOptions = ['Pacific Time (PT)', 'Mountain Time (MT)', 'Central Time (CT)', 'Eastern Time (ET)', 'Greenwich Mean Time (GMT)', 'Central European Time (CET)', 'India Standard Time (IST)', 'Japan Standard Time (JST)', 'Australian Eastern Time (AEST)', 'Other'];
  const languageOptions = [
    { label: 'English', code: 'en' },
    { label: 'Español', code: 'es' },
    { label: 'Français', code: 'fr' },
    { label: 'हिन्दी', code: 'hi' },
    { label: '日本語', code: 'ja' }
  ];

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedName = await AsyncStorage.getItem('USER_NAME');
        const storedGender = await AsyncStorage.getItem('USER_GENDER');
        const storedTimezone = await AsyncStorage.getItem('USER_TIMEZONE');
        const storedFeeling = await AsyncStorage.getItem('USER_ASK_FEELING');
        
        if (storedName) setName(storedName);
        if (storedGender) setGender(storedGender);
        if (storedTimezone) setCountry(storedTimezone);
        if (storedFeeling !== null) setAskFeeling(storedFeeling === 'true');
      } catch (e) {
        console.error('Failed to load settings', e);
      }
    };
    loadSettings();
  }, []);

  const saveSetting = async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.error('Failed to save setting', e);
    }
  };

  const handleNameChange = (val: string) => {
    setName(val);
  };
  
  const handleGenderChange = (val: string) => {
    setGender(val);
  };
  
  const handleCountryChange = (val: string) => {
    setCountry(val);
  };

  const handleFeelingChange = (val: boolean) => {
    setAskFeeling(val);
    saveSetting('USER_ASK_FEELING', val.toString());
    if (val) {
      // Immediately show the prompt when enabled to demonstrate what it looks like
      setMoodPromptVisible(true);
    }
  };

  const openModal = (type: 'gender' | 'timezone' | 'language') => {
    setModalType(type);
    setModalVisible(true);
  };

  const selectOption = (val: string) => {
    if (modalType === 'gender') {
      handleGenderChange(val);
      saveSetting('USER_GENDER', val);
    } else if (modalType === 'timezone') {
      handleCountryChange(val);
      saveSetting('USER_TIMEZONE', val);
    } else if (modalType === 'language') {
      const langOption = languageOptions.find(o => o.label === val);
      if (langOption) {
        setLanguage(langOption.code as any);
      }
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{t('settings')}</Text>
          <Text style={styles.subtitle}>Personalize your meditation experience</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('personalization')}</Text>
          <View style={styles.sectionCard}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>{t('name')}</Text>
              <TextInput 
                style={[styles.textInput, { outlineStyle: 'none' } as any]} 
                value={name}
                onChangeText={handleNameChange}
                onEndEditing={(e) => saveSetting('USER_NAME', e.nativeEvent.text)}
                placeholder="e.g. Alex"
                placeholderTextColor={colors.text.tertiary}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.rowLabel}>{t('gender')}</Text>
              <TouchableOpacity onPress={() => openModal('gender')}>
                <Text style={styles.textInput}>{gender || 'Select >'}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.rowLabel}>{t('timezone')}</Text>
              <TouchableOpacity onPress={() => openModal('timezone')} style={{ flex: 1 }}>
                <Text style={styles.textInput} numberOfLines={1} ellipsizeMode="tail">
                  {country ? (country.match(/\(([^)]+)\)/)?.[1] || country) : 'Select >'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.rowLabel}>{t('language')}</Text>
              <TouchableOpacity onPress={() => openModal('language')}>
                <Text style={styles.textInput}>{languageOptions.find(o => o.code === language)?.label || 'English'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('preferences')}</Text>
          <View style={styles.sectionCard}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>{t('askForMood')}</Text>
              <Switch 
                value={askFeeling}
                onValueChange={handleFeelingChange}
                trackColor={{ false: '#E2E8F0', true: '#87BA86' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Select Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {modalType === 'gender' ? t('selectGender') : modalType === 'timezone' ? t('selectTimezone') : t('selectLanguage')}
            </Text>
            {(modalType === 'gender' ? genderOptions : modalType === 'timezone' ? timezoneOptions : languageOptions.map(o => o.label)).map(opt => (
              <TouchableOpacity key={opt} style={styles.modalOption} onPress={() => selectOption(opt)}>
                <Text style={styles.modalOptionText}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Mood Prompt Modal */}
      <Modal visible={moodPromptVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setMoodPromptVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>How are you feeling today?</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 20 }}>
              {['😔', '😐', '🙂', '🤩'].map(emoji => (
                <TouchableOpacity key={emoji} onPress={() => setMoodPromptVisible(false)} style={styles.emojiButton}>
                  <Text style={{ fontSize: 48 }}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA', // Match the clean minimalist aesthetic we set in sounds.tsx
  },
  scrollContent: {
    paddingTop: 80,
  },
  header: {
    paddingHorizontal: spacing['2xl'],
    marginBottom: spacing['3xl'],
  },
  title: {
    ...typography.hero,
    fontWeight: '300',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.tertiary,
  },
  section: {
    paddingHorizontal: spacing['2xl'],
    marginBottom: spacing['2xl'],
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: colors.text.muted,
    marginBottom: spacing.md,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: 18,
  },
  rowLabel: {
    fontSize: 18,
    fontWeight: '400',
    color: colors.text.primary,
    flex: 1,
    paddingRight: 16,
  },
  textInput: {
    fontSize: 18,
    color: '#87BA86', 
    fontWeight: '500',
    textAlign: 'right',
    minWidth: 100,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginHorizontal: spacing.xl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    paddingTop: 24,
    paddingHorizontal: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  modalOptionText: {
    fontSize: 18,
    color: colors.text.primary,
    textAlign: 'center',
  },
  emojiButton: {
    padding: 10,
    transform: [{ scale: 1 }],
  }
});
