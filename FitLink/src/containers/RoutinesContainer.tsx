import { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { supabase } from "../services/supabase";
import { getRoutinesByUserId } from "../services/repositories/routineRepository";
import { getTrainingSessionsByUserId } from "../services/repositories/trainingSessionRepository";

interface RoutineExercisePreview {
  exercise_id: number;
}

export interface Routine {
  routine_id: number;
  name: string;
  description: string;
  is_shared: boolean;
  created_at: string;
  user_id: string;
  estimated_time: number;
  routine_exercises: RoutineExercisePreview[];
}

export const useRoutinesContainer = () => {
  const router = useRouter();

  const [routines, setRoutines] = useState<Routine[]>([]);
  const [recommendedRoutine, setRecommendedRoutine] =
    useState<Routine | null>(null);

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Filtrado de rutinas
  const filteredRoutines = routines.filter((routine) =>
    routine.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Cargar rutinas cuando la pantalla está en foco
  useFocusEffect(
    useCallback(() => {
      loadRoutines();
    }, [])
  );

  // Cargar rutinas del usuario actual
  async function loadRoutines() {
    try {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setLoading(false);
        return;
      }

      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("user_id")
        .eq("auth_id", user.id)
        .single();

      if (usersError || !users) {
        setLoading(false);
        return;
      }

      const { routines: data, error } = await getRoutinesByUserId(
        users.user_id
      );

      if (error) {
        console.error(error);
        setRoutines([]);
        setRecommendedRoutine(null);
        return;
      }

      const loadedRoutines = data || [];
      setRoutines(loadedRoutines);

      // Obtener historial de entrenamientos
      const {
        sessions,
        error: sessionsError,
      } = await getTrainingSessionsByUserId(users.user_id);

      if (sessionsError) {
        console.error(sessionsError);
      }

      // Como las sesiones ya vienen ordenadas de más reciente
      // a más antigua, guardamos la primera sesión encontrada
      // para cada rutina.
      const lastTrainingByRoutine = new Map<number, string>();

      (sessions || []).forEach((session) => {
        if (!lastTrainingByRoutine.has(session.routine_id)) {
          lastTrainingByRoutine.set(
            session.routine_id,
            `${session.date}T${session.time || "00:00:00"}`
          );
        }
      });

      // Elegir rutina recomendada
      const recommendation = loadedRoutines.reduce<Routine | null>(
        (recommended, routine) => {
          if (!recommended) {
            return routine;
          }

          const routineLastTraining = lastTrainingByRoutine.get(
            routine.routine_id
          );

          const recommendedLastTraining = lastTrainingByRoutine.get(
            recommended.routine_id
          );

          // Priorizar rutinas que nunca se han entrenado
          if (!routineLastTraining && recommendedLastTraining) {
            return routine;
          }

          if (routineLastTraining && !recommendedLastTraining) {
            return recommended;
          }

          // Si ninguna se ha entrenado, elegir la de menor duración
          if (!routineLastTraining && !recommendedLastTraining) {
            return routine.estimated_time < recommended.estimated_time
              ? routine
              : recommended;
          }

          // Si ambas se han entrenado, elegir la que lleva más
          // tiempo sin entrenarse
          if (
            routineLastTraining &&
            recommendedLastTraining &&
            routineLastTraining < recommendedLastTraining
          ) {
            return routine;
          }

          // Si empatan, elegir la de menor duración
          if (
            routineLastTraining === recommendedLastTraining &&
            routine.estimated_time < recommended.estimated_time
          ) {
            return routine;
          }

          return recommended;
        },
        null
      );

      setRecommendedRoutine(recommendation);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Navegar a detalle de rutina
  const navigateToRoutine = (routineId: number) => {
    router.push(`/(tabs)/routines/${routineId}`);
  };

  // Navegar a agregar rutina
  const navigateToAddRoutine = () => {
    router.push("/routines/add-routine");
  };

  // Iniciar entrenamiento
  const navigateToQuickStart = (routineId: number) => {
    router.push({
      pathname: "/training/[id]",
      params: { id: routineId.toString() },
    });
  };

  return {
    routines: filteredRoutines,
    recommendedRoutine,
    loading,
    searchQuery,
    setSearchQuery,
    navigateToRoutine,
    navigateToAddRoutine,
    navigateToQuickStart,
  };
};
