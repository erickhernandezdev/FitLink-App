import { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { supabase } from "../services/supabase";
import {
  getPopularRoutines,
  getRecentRoutines,
  getTeamRoutines,
  getSharedRoutines,
} from "../services/repositories/routineRepository";

interface UserPreview {
  username: string;
}

interface RoutineExercisePreview {
  exercise_id: number;
}

export interface SharedRoutine {
  routine_id: number;
  name: string;
  description: string | null;
  is_shared: boolean;
  downloads: number;
  created_at: string;
  user_id: number;
  estimated_time: number;
  users: UserPreview | null;
  routine_exercises: RoutineExercisePreview[];
}

interface RawSharedRoutine {
  routine_id: number;
  name: string;
  description: string | null;
  is_shared: boolean;
  downloads: number;
  created_at: string;
  user_id: number;
  estimated_time: number;
  users: UserPreview | UserPreview[] | null;
  routine_exercises: RoutineExercisePreview[];
}

export const useExploreContainer = () => {
  const router = useRouter();

  const [popularRoutines, setPopularRoutines] = useState<SharedRoutine[]>([]);
  const [recentRoutines, setRecentRoutines] = useState<SharedRoutine[]>([]);
  const [teamRoutines, setTeamRoutines] = useState<SharedRoutine[]>([]);
  const [searchResults, setSearchResults] = useState<SharedRoutine[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [userId, setUserId] = useState<number | null>(null);

  const processRoutines = (data: RawSharedRoutine[]): SharedRoutine[] => {
    return data.map((item) => ({
      ...item,
      users: Array.isArray(item.users) ? item.users[0] || null : item.users,
      routine_exercises: item.routine_exercises || [],
    }));
  };

  useFocusEffect(
    useCallback(() => {
      loadSectionsData();
    }, []),
  );

  async function loadSectionsData() {
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

      const { data: userData, error: userDataError } = await supabase
        .from("users")
        .select("user_id")
        .eq("auth_id", user.id)
        .single();

      if (userDataError || !userData) {
        setLoading(false);
        return;
      }

      const currentUserId = userData.user_id;
      setUserId(currentUserId);

      const [popularRes, recentRes, teamRes] = await Promise.all([
        getPopularRoutines(10, currentUserId),
        getRecentRoutines(10, currentUserId),
        getTeamRoutines(10),
      ]);

      if (popularRes.routines)
        setPopularRoutines(processRoutines(popularRes.routines));
      if (recentRes.routines)
        setRecentRoutines(processRoutines(recentRes.routines));
      if (teamRes.routines) setTeamRoutines(processRoutines(teamRes.routines));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const handleSearchChange = async (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    if (!userId) {
      setSearchResults([]);
      return;
    }

    const { routines, error } = await getSharedRoutines(userId);

    if (!error && routines) {
      const processed = processRoutines(routines);
      const lowerQuery = query.toLowerCase();

      const filtered = processed.filter(
        (r) =>
          r.name.toLowerCase().includes(lowerQuery) ||
          r.description?.toLowerCase().includes(lowerQuery) ||
          r.users?.username.toLowerCase().includes(lowerQuery),
      );

      setSearchResults(filtered);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    if (searchQuery.trim()) {
      handleSearchChange(searchQuery);
      setRefreshing(false);
    } else {
      loadSectionsData();
    }
  };

  const navigateToDetail = (routineId: number) => {
    router.push({
      pathname: "/(tabs)/explore/[id]",
      params: { id: routineId.toString() },
    });
  };

  return {
    popularRoutines,
    recentRoutines,
    teamRoutines,
    searchResults,
    loading,
    refreshing,
    searchQuery,
    setSearchQuery: handleSearchChange,
    handleRefresh,
    navigateToDetail,
  };
};
