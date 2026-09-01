import { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { Alert } from "react-native";
import { CustomAlert } from "../components/ui/CustomAlert";
import { supabase } from "../services/supabase";
import {
  getSharedRoutineById,
  isRoutineAlreadyCloned,
  clonePublicRoutine,
} from "../services/repositories/routineRepository";

interface UserPreview {
  username: string;
}

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

export interface ExploreRoutineDetail {
  routine_id: number;
  name: string;
  description: string | null;
  created_at: string;
  estimated_time: number;
  downloads: number;
  users: UserPreview | null;
  routine_exercises: RoutineExercise[];
}

interface RawRoutineExercise {
  routine_exercise_id: number;
  order: number;
  sets: number;
  exercises: Exercise;
}

interface RawExploreRoutineDetail {
  routine_id: number;
  name: string;
  description: string | null;
  created_at: string;
  estimated_time: number;
  downloads: number;
  users: UserPreview | UserPreview[] | null;
  routine_exercises: RawRoutineExercise[];
}

export const useExploreDetailContainer = (routineId: string | undefined) => {
  const router = useRouter();

  const [routine, setRoutine] = useState<ExploreRoutineDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCloned, setIsCloned] = useState(false);
  const [isCloning, setIsCloning] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (routineId) loadExploreDetail();
    }, [routineId]),
  );

  async function loadExploreDetail() {
    try {
      setLoading(true);

      if (!routineId) {
        Alert.alert("Error", "ID de rutina no válido");
        router.back();
        return;
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      let userId: number | null = null;

      if (!userError && user) {
        const { data: userData } = await supabase
          .from("users")
          .select("user_id")
          .eq("auth_id", user.id)
          .single();

        if (userData) {
          userId = userData.user_id;
          setCurrentUserId(userData.user_id);
        }
      }

      const { routine: data, error } = await getSharedRoutineById(routineId);

      if (error || !data) {
        Alert.alert("Error", "No se pudo cargar la rutina pública");
        router.back();
        return;
      }

      const rawData = data as unknown as RawExploreRoutineDetail;

      if (rawData.routine_exercises) {
        rawData.routine_exercises.sort((a, b) => a.order - b.order);
      }

      const processedData: ExploreRoutineDetail = {
        ...rawData,
        users: Array.isArray(rawData.users)
          ? rawData.users[0] || null
          : rawData.users,
        routine_exercises:
          rawData.routine_exercises?.map((re) => ({
            routine_exercise_id: re.routine_exercise_id,
            order: re.order,
            sets: re.sets,
            exercises: re.exercises || null,
          })) || [],
      };

      setRoutine(processedData);

      if (userId) {
        const { isCloned: cloned } = await isRoutineAlreadyCloned(
          routineId,
          userId,
        );
        setIsCloned(cloned);
      }
    } catch {
      Alert.alert("Error", "Ocurrió un error inesperado");
      router.back();
    } finally {
      setLoading(false);
    }
  }

  const handleClone = async () => {
    if (!routineId || !currentUserId) {
      Alert.alert("Error", "Debes iniciar sesión para guardar esta rutina");
      return;
    }
    try {
      setIsCloning(true);
      const { error } = await clonePublicRoutine(routineId, currentUserId);
      if (error) {
        Alert.alert("Error", "No se pudo guardar la rutina.");
        return;
      }
      setIsCloned(true);
      setShowSuccessAlert(true);
    } catch {
      Alert.alert("Error", "Ocurrió un error inesperado al guardar");
    } finally {
      setIsCloning(false);
    }
  };

  return {
    routine,
    loading,
    isCloned,
    isCloning,
    handleClone,
    showSuccessAlert,
    setShowSuccessAlert,
  };
};
