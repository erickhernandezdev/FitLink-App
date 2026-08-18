import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { TrainingHistory } from '../profile/TrainingHistory';
import { theme } from '../../constants/theme';
import { useHistoryContainer } from '@/src/containers/HistoryContainer';

const HistoryView: React.FC = () => {
  const {
    trainingHistory,
    loading,
  } = useHistoryContainer();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <TrainingHistory sessions={trainingHistory} />

    </View>
  );
};

export default HistoryView;

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
    padding: 20,
  },
  title: {
    color: theme.colors.textPrimary,
    fontFamily: 'Roboto_700Bold',
    fontSize: 24,
  },
});