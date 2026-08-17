import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../constants/theme';

interface TrainingSession {
  training_session_id: number;
  duration: number;
  date: string;
  time: string;
  routines: {
    name: string;
  } | null;
}

interface TrainingHistoryProps {
  sessions: TrainingSession[];
}

export const TrainingHistory: React.FC<TrainingHistoryProps> = ({
  sessions,
}) => {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes} minutos con ${remainingSeconds} segundos`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de entrenamientos</Text>

      <FlatList
        data={sessions}
        keyExtractor={(item) => item.training_session_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.routineName}>
              {item.routines?.name ?? 'Rutina desconocida'}
            </Text>

            <Text style={styles.info}>
              Tiempo: {formatDuration(item.duration)}
            </Text>

            <Text style={styles.info}>
              Fecha: {item.date}
            </Text>

            <Text style={styles.info}>
              Hora: {item.time}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No tienes entrenamientos registrados.
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 25,
  },
  title: {
    color: theme.colors.textPrimary,
    fontFamily: 'Roboto_700Bold',
    fontSize: 20,
    marginBottom: 15,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.divider,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
    padding: 15,
  },
  routineName: {
    color: theme.colors.textPrimary,
    fontFamily: 'Roboto_700Bold',
    fontSize: 17,
    marginBottom: 8,
  },
  info: {
    color: theme.colors.textSecondary,
    fontFamily: 'Roboto_400Regular',
    fontSize: 15,
    marginBottom: 3,
  },
  empty: {
    color: theme.colors.textSecondary,
    fontFamily: 'Roboto_400Regular',
    fontSize: 15,
  },
});