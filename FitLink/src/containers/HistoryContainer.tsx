import { useEffect, useState } from "react";
import {
  getAuthUser,
  getUserByAuthId,
} from "../services/repositories/userRepository";
import { getTrainingSessionsByUserId } from "../services/repositories/trainingSessionRepository";

export function useHistoryContainer() {
  const [trainingHistory, setTrainingHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const { user, error: authError } = await getAuthUser();

        if (authError || !user) {
          return;
        }

        const { user: dbUser, error: dbError } = await getUserByAuthId(user.id);

        if (dbError || !dbUser) {
          return;
        }


        const { sessions, error: sessionsError } =
          await getTrainingSessionsByUserId(dbUser.user_id);

        if (sessionsError) {
          console.error(sessionsError);
          return;
        }

        setTrainingHistory(sessions || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  return {
    trainingHistory,
    loading,
  };
}
