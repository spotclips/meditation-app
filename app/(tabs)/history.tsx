import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from '../../src/i18n/LanguageContext';
import { colors, spacing } from '../../src/utils/theme';
import { useFocusEffect, useRouter } from 'expo-router';

type HistoryItem = {
  id: string;
  meditationId: string;
  name: string;
  duration: number;
  timestamp: string;
};

export default function HistoryScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  const loadHistory = async () => {
    try {
      const data = await AsyncStorage.getItem('USER_HISTORY');
      if (data) {
        setHistory(JSON.parse(data));
      }
    } catch (e) {
      console.error('Failed to load history', e);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadHistory();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  // Group by date
  const groupedHistory = history.reduce((acc: Record<string, HistoryItem[]>, item) => {
    const date = new Date(item.timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let dateKey = '';
    if (date.toDateString() === today.toDateString()) {
      dateKey = t('today') || 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateKey = t('yesterday') || 'Yesterday';
    } else {
      dateKey = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }

    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(item);
    return acc;
  }, {});

  const formatDurationText = (seconds: number) => {
    const totalSecs = Math.round(seconds);
    const min = Math.floor(totalSecs / 60);
    const sec = totalSecs % 60;
    
    if (min > 0) {
      if (sec > 0) return `${min} ${t('min')} ${sec} ${t('sec')}`;
      return `${min} ${t('min')}`;
    }
    return `${sec} ${t('sec')}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.pageTitle}>{t('history') || 'History'}</Text>

        {Object.keys(groupedHistory).length === 0 ? (
          <View style={styles.emptyContainer}>
            <Feather name="clock" size={48} color={colors.text.tertiary} style={{ marginBottom: 16 }} />
            <Text style={styles.emptyText}>No history yet.</Text>
            <Text style={styles.emptySubtext}>Start a meditation session to see it here.</Text>
          </View>
        ) : (
          Object.keys(groupedHistory).map(dateKey => (
            <View key={dateKey} style={styles.section}>
              <Text style={styles.sectionHeader}>{dateKey}</Text>
              
              <View style={styles.cardContainer}>
                {groupedHistory[dateKey].map((item, index) => (
                  <View key={item.id}>
                    <TouchableOpacity style={styles.historyCard} onPress={() => setSelectedItem(item)}>
                      <View style={styles.iconContainer}>
                        <Feather name="headphones" size={20} color="#87BA86" />
                      </View>
                      <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>{item.name}</Text>
                        <View style={styles.cardSubRow}>
                          <Feather name="clock" size={12} color={colors.text.secondary} />
                          <Text style={styles.cardDuration}>{formatDurationText(item.duration)}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    {index < groupedHistory[dateKey].length - 1 && <View style={styles.divider} />}
                  </View>
                ))}
              </View>
            </View>
          ))
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Action Sheet Modal */}
      <Modal visible={!!selectedItem} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setSelectedItem(null)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedItem?.name}</Text>
            
            <TouchableOpacity 
              style={styles.modalOption} 
              onPress={() => {
                if (selectedItem) {
                  router.push(`/meditation/session?id=${selectedItem.meditationId}`);
                }
                setSelectedItem(null);
              }}
            >
              <Feather name="play-circle" size={20} color={colors.text.primary} style={{ marginRight: 12 }} />
              <Text style={styles.modalOptionText}>{t('takeSessionAgain' as any) || 'Take Session Again'}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.modalOption, { borderBottomWidth: 0 }]} 
              onPress={() => {
                if (selectedItem) {
                  const newHistory = history.filter(h => h.id !== selectedItem.id);
                  setHistory(newHistory);
                  AsyncStorage.setItem('USER_HISTORY', JSON.stringify(newHistory));
                }
                setSelectedItem(null);
              }}
            >
              <Feather name="trash-2" size={20} color="#FF5252" style={{ marginRight: 12 }} />
              <Text style={[styles.modalOptionText, { color: '#FF5252' }]}>{t('deleteSession' as any) || 'Delete Session'}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FE',
  },
  scrollContent: {
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  pageTitle: {
    fontWeight: '700',
    fontSize: 32,
    color: colors.text.primary,
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: spacing.md,
    marginLeft: 4,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EDF5EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 4,
  },
  cardSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardDuration: {
    fontSize: 13,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginHorizontal: spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 15,
    color: colors.text.tertiary,
    textAlign: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  modalOptionText: {
    fontSize: 18,
    color: colors.text.primary,
  }
});
