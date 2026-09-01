import React, { useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { theme } from "../../constants/theme";
import { ExerciseBlock } from "../training/ExerciseBlock";
import { CustomAlert } from "../ui/CustomAlert";
import { useExerciseState } from "../../hooks/useExerciseState";
import { useTimer } from "../../hooks/useTimer";
import { buildFinalizedSets } from "../../utils/trainingSessionUtils";

export interface FinalizedSet {
  routineExerciseId: string | number;
  serieIndex: number;
  reps?: number;
  weight?: number;
  previous: boolean;
}

interface RoutineExercise {
  routine_exercise_id: number;
  order: number;
  sets: number;
  exercise_id: number;
  exercises: { name: string };
}

export interface Routine {
  name: string;
  routine_exercises: RoutineExercise[];
}

interface TrainingSessionViewProps {
  routine: Routine;
  onEnd: (payload: FinalizedSet[], duration: number) => Promise<boolean>;
}

export function TrainingSessionView({
  routine,
  onEnd,
}: TrainingSessionViewProps) {
  const router = useRouter();

  const { elapsedSeconds, formatTime } = useTimer();

  const {
    perExerciseState,
    serieStateGetter,
    updateSerieField,
    toggleSerieDone,
  } = useExerciseState();

  const [isEnding, setIsEnding] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  const handleEnd = async () => {
    if (isEnding) return;

    setIsEnding(true);

    const allSets = buildFinalizedSets(routine, perExerciseState);

    const success = await onEnd(allSets, elapsedSeconds);

    setAlertType(success ? "success" : "error");
    setShowAlert(true);

    setIsEnding(false);
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>{routine.name}</Text>

        <Text style={styles.timer}>Tiempo: {formatTime(elapsedSeconds)}</Text>

        <FlatList
          data={routine.routine_exercises}
          keyExtractor={(item) => item.routine_exercise_id.toString()}
          renderItem={({ item }) => (
            <ExerciseBlock
              item={item}
              serieStateGetter={serieStateGetter}
              updateSerieField={updateSerieField}
              toggleSerieDone={toggleSerieDone}
            />
          )}
        />

        <Pressable
          style={[styles.endButton, isEnding && styles.endButtonDisabled]}
          onPress={handleEnd}
          disabled={isEnding}
        >
          <Text style={styles.endButtonText}>
            {isEnding ? "Guardando..." : "Finalizar entrenamiento"}
          </Text>
        </Pressable>
      </View>

      <CustomAlert
        visible={showAlert}
        title={alertType === "success" ? "Éxito" : "Error"}
        message={
          alertType === "success"
            ? "Entrenamiento guardado con éxito"
            : "No se pudo guardar el entrenamiento"
        }
        type={alertType}
        buttons={[
          {
            text: "OK",
            variant: "primary",
            onPress: () => {
              if (alertType === "success") {
                router.replace("/(tabs)/routines");
              }
            },
          },
        ]}
        onClose={() => setShowAlert(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
    padding: 16,
  },

  endButton: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    width: "100%",
  },

  endButtonDisabled: {
    opacity: 0.6,
  },

  endButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },

  timer: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    marginBottom: 16,
  },

  title: {
    color: theme.colors.textPrimary,
    fontFamily: "Roboto_500Medium",
    fontSize: 22,
    marginBottom: 8,
  },
});
