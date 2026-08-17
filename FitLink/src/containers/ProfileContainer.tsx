import { useEffect, useState } from "react";
import {
  getAuthUser,
  getUserByAuthId,
} from "../services/repositories/userRepository";
import { getTrainingSessionsByUserId } from "../services/repositories/trainingSessionRepository";
import { logoutUser } from "../services/authService";
import { useRouter } from "expo-router";

export function useProfileContainer() {
  const [username, setUsername] = useState("");
  const [trainingHistory, setTrainingHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

        setUsername(dbUser.username);

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

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.replace("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return {
    username,
    trainingHistory,
    loading,
    handleLogout,
  };
}
