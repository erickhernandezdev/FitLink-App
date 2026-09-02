import { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { getRoutineById } from "../services/repositories/routineRepository";
import { deleteRoutine } from "../services/delete-routine";

interface Exercise {
  exercise_id: number;
  name: string;
  description: string | null;
}

interface RoutineExercise {
  routine_exercise_id: number;
  order: number;
  sets: number;
  exercises: Exercise | null;
}

export interface RoutineDetail {
  routine_id: number;
  name: string;
  description: string;
  estimated_time: number;
  created_at: string;
  is_shared: boolean;
  routine_exercises: RoutineExercise[];
}

interface RawRoutineExercise {
  routine_exercise_id: number;
  order: number;
  sets: number;
  exercises: Exercise;
}

export const useRoutineDetailContainer = (routineId: string | undefined) => {
  const router = useRouter();

  const [routine, setRoutine] = useState<RoutineDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertTitle, setAlertTitle] = useState("Error");
  const [alertType, setAlertType] = useState<
    "success" | "error" | "warning" | "info"
  >("error");

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (routineId) loadRoutineDetail();
    }, [routineId]),
  );

  async function loadRoutineDetail() {
    try {
      setLoading(true);

      if (!routineId) {
        setAlertTitle("Error");
        setAlertType("error");
        setAlertMessage("ID de rutina no válido");
        return;
      }

      const { routine, error } = await getRoutineById(routineId);

      if (error || !routine) {
        setAlertTitle("Error");
        setAlertType("error");
        setAlertMessage("No se pudo cargar la rutina");
        return;
      }

      if (routine.routine_exercises) {
        (routine.routine_exercises as unknown as RawRoutineExercise[]).sort(
          (a, b) => a.order - b.order,
        );
      }

      const processedData: RoutineDetail = {
        ...routine,
        routine_exercises:
          (routine.routine_exercises as unknown as RawRoutineExercise[])?.map(
            (re) => ({
              routine_exercise_id: re.routine_exercise_id,
              order: re.order,
              sets: re.sets,
              exercises: re.exercises || null,
            }),
          ) || [],
      };

      setRoutine(processedData);
    } catch {
      setAlertTitle("Error");
      setAlertType("error");
      setAlertMessage("Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = () => {
    router.push(`/(tabs)/routines/edit-routine/${routineId}`);
  };

  const handleDelete = () => {
    setShowDeleteConfirmation(true);
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const confirmDelete = async () => {
    setShowDeleteConfirmation(false);

    if (!routineId) {
      setAlertTitle("Error");
      setAlertType("error");
      setAlertMessage("ID de rutina no válido");
      return;
    }

    const result = await deleteRoutine(routineId);

    if (!result.success) {
      setAlertTitle("Error");
      setAlertType("error");
      setAlertMessage(result.error ?? "No se pudo eliminar la rutina");
      return;
    }

    setAlertTitle("Éxito");
    setAlertType("success");
    setAlertMessage("La rutina se eliminó correctamente");
  };

  const clearAlert = () => {
    setAlertMessage(null);
  };

  const handleSuccessAlertClose = () => {
    setAlertMessage(null);
    router.back();
  };

  return {
    routine,
    loading,
    handleEdit,
    handleDelete,
    showDeleteConfirmation,
    cancelDelete,
    confirmDelete,
    alertMessage,
    alertTitle,
    alertType,
    clearAlert,
    handleSuccessAlertClose,
  };
};
