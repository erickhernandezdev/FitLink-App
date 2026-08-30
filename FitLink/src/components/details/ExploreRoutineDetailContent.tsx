import React from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { RoutineHeader, ExerciseCard, Button } from '../ui';
import { theme } from '../../constants/theme';
import { ExploreRoutineDetail } from '../../containers/ExploreDetailContainer';

interface ExploreRoutineDetailContentProps {
  routine: ExploreRoutineDetail | null;
  loading: boolean;
  isCloned: boolean;
  isCloning: boolean;
  onClone: () => void;
}

export const ExploreRoutineDetailContent: React.FC<ExploreRoutineDetailContentProps> = ({
  routine,
  loading,
  isCloned,
  isCloning,
  onClone,
}) => {
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Cargando detalle de la rutina...</Text>
      </View>
    );
  }

  if (!routine) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No se encontró la rutina pública</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <RoutineHeader name={routine.name} estimatedTime={routine.estimated_time} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Creador</Text>
        <Text style={styles.detailText}>
          {routine.users?.username || 'Usuario de FitLink'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Descripción</Text>
        <Text style={styles.detailText}>
          {routine.description || 'Sin descripción'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estadísticas</Text>
        <Text style={styles.detailText}>
          {routine.downloads ?? 0} {routine.downloads === 1 ? 'descarga' : 'descargas'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Ejercicios ({routine.routine_exercises?.length || 0})
        </Text>
        {routine.routine_exercises && routine.routine_exercises.length > 0 ? (
          routine.routine_exercises.map((exercise, index) => (
            <ExerciseCard
              key={exercise.routine_exercise_id}
              exercise={exercise.exercises}
              sets={exercise.sets}
              index={index}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>No hay ejercicios en esta rutina</Text>
        )}
      </View>

      <View style={styles.buttonsContainer}>
        {isCloned ? (
          <Button
            title="Rutina guardada en tus rutinas"
            onPress={() => {}}
            variant="secondary"
            disabled={true}
          />
        ) : (
          <Button
            title={isCloning ? 'Guardando...' : 'Guardar en mis rutinas'}
            onPress={onClone}
            disabled={isCloning}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    gap: 12,
    marginTop: 20,
    paddingBottom: 20,
  },
  center: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  detailText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 18,
    marginBottom: 20,
  },
  loadingText: {
    color: theme.colors.textSecondary,
    marginTop: 10,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});
