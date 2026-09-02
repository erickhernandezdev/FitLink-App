import React, { useMemo } from 'react';
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

type HistoryItem =
  | {
      type: 'year';
      value: number;
    }
  | {
      type: 'month';
      value: number;
    }
  | {
      type: 'session';
      value: TrainingSession;
    };

export const TrainingHistory: React.FC<TrainingHistoryProps> = ({
  sessions,
}) => {
  const historyItems = useMemo<HistoryItem[]>(() => {
    const items: HistoryItem[] = [];

    let currentYear: number | null = null;
    let currentMonth: number | null = null;

    sessions.forEach((session) => {
      const [year, month] = session.date.split('-').map(Number);
      const monthIndex = month - 1;

      if (year !== currentYear) {
        currentYear = year;
        currentMonth = null;

        items.push({
          type: 'year',
          value: year,
        });
      }

      if (monthIndex !== currentMonth) {
        currentMonth = monthIndex;

        items.push({
          type: 'month',
          value: monthIndex,
        });
      }

      items.push({
        type: 'session',
        value: session,
      });
    });

    return items;
  }, [sessions]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes} minutos con ${remainingSeconds} segundos`;
  };

  const formatMonth = (month: number) => {
    return new Date(2000, month, 1).toLocaleDateString('es-CR', {
      month: 'long',
    });
  };

  const renderItem = ({ item }: { item: HistoryItem }) => {
    if (item.type === 'year') {
      return <Text style={styles.year}>{item.value}</Text>;
    }

    if (item.type === 'month') {
      return (
        <Text style={styles.month}>
          {formatMonth(item.value)}
        </Text>
      );
    }

    const session = item.value;

    return (
      <View style={styles.card}>
        <Text style={styles.routineName}>
          {session.routines?.name ?? 'Rutina desconocida'}
        </Text>

        <Text style={styles.info}>
          Tiempo: {formatDuration(session.duration)}
        </Text>

        <Text style={styles.info}>
          Fecha: {session.date}
        </Text>

        <Text style={styles.info}>
          Hora: {session.time}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de entrenamientos</Text>

      <FlatList
        data={historyItems}
        keyExtractor={(item, index) =>
          item.type === 'session'
            ? item.value.training_session_id.toString()
            : `${item.type}-${item.value}-${index}`
        }
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
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

  year: {
    color: theme.colors.textPrimary,
    fontFamily: 'Roboto_700Bold',
    fontSize: 24,
    marginBottom: 8,
    marginTop: 10,
  },

  month: {
    color: theme.colors.textSecondary,
    fontFamily: 'Roboto_700Bold',
    fontSize: 18,
    marginBottom: 10,
    textTransform: 'capitalize',
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