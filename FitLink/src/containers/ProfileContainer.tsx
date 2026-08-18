import { useEffect, useMemo, useState } from "react";
import {
  getAuthUser,
  getUserByAuthId,
} from "../services/repositories/userRepository";
import { getTrainingSessionsByUserId } from "../services/repositories/trainingSessionRepository";
import { logoutUser } from "../services/authService";
import { useRouter } from "expo-router";
import { formatDuration } from "../utils/trainingSessionUtils";

type Period = "total" | "week" | "month" | "year";

export function useProfileContainer() {
  const [username, setUsername] = useState("");
  const [trainingHistory, setTrainingHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [period, setPeriod] = useState<Period>("week");
  const [periodOffset, setPeriodOffset] = useState(0);

  const router = useRouter();

  useEffect(() => {
    async function loadProfile() {
      try {
        const { user, error: authError } = await getAuthUser();

        if (authError || !user) return;

        const { user: dbUser, error: dbError } = await getUserByAuthId(user.id);

        if (dbError || !dbUser) return;

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

  const filteredSessions = useMemo(() => {
    if (period === "total") {
      return trainingHistory;
    }

    const now = new Date();

    let start: Date;
    let end: Date;

    if (period === "week") {
      const currentDay = now.getDay();
      const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1;

      start = new Date(now);
      start.setDate(now.getDate() - daysFromMonday + periodOffset * 7);
      start.setHours(0, 0, 0, 0);

      end = new Date(start);
      end.setDate(start.getDate() + 7);
    } else if (period === "month") {
      start = new Date(now.getFullYear(), now.getMonth() + periodOffset, 1);

      end = new Date(now.getFullYear(), now.getMonth() + periodOffset + 1, 1);
    } else {
      start = new Date(now.getFullYear() + periodOffset, 0, 1);

      end = new Date(now.getFullYear() + periodOffset + 1, 0, 1);
    }

    return trainingHistory.filter((session) => {
      const sessionDate = new Date(
        `${session.date}T${session.time || "00:00:00"}`,
      );

      return sessionDate >= start && sessionDate < end;
    });
  }, [trainingHistory, period, periodOffset]);

  const stats = useMemo(() => {
    const trainingCount = filteredSessions.length;

    const totalDuration = filteredSessions.reduce(
      (total, session) => total + (session.duration || 0),
      0,
    );

    const exercisesCount = filteredSessions.reduce((total, session) => {
      const exercises = session.routines?.routine_exercises || [];

      return total + exercises.length;
    }, 0);

    return {
      trainingCount,
      trainingTime: formatDuration(totalDuration),
      exercisesCount,
    };
  }, [filteredSessions]);

  const previousPeriod = () => {
    if (period !== "total") {
      setPeriodOffset((current) => current - 1);
    }
  };

  const nextPeriod = () => {
    if (period !== "total") {
      setPeriodOffset((current) => current + 1);
    }
  };

  const handlePeriodChange = (newPeriod: Period) => {
    setPeriod(newPeriod);
    setPeriodOffset(0);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.replace("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const periodLabel = useMemo(() => {
    if (period === "total") return "";

    const now = new Date();

    if (period === "week") {
      const currentDay = now.getDay();
      const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1;

      const start = new Date(now);
      start.setDate(now.getDate() - daysFromMonday + periodOffset * 7);

      const end = new Date(start);
      end.setDate(start.getDate() + 6);

      const formatDate = (date: Date) =>
        date.toLocaleDateString("es-CR", {
          day: "numeric",
          month: "short",
        });

      return `${formatDate(start)} - ${formatDate(end)}`;
    }

    if (period === "month") {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() + periodOffset,
        1,
      );

      return date.toLocaleDateString("es-CR", {
        month: "long",
        year: "numeric",
      });
    }

    return String(now.getFullYear() + periodOffset);
  }, [period, periodOffset]);

  return {
    username,
    loading,

    period,
    handlePeriodChange,
    
    periodOffset,
    previousPeriod,
    nextPeriod,
    periodLabel,

    stats,

    handleLogout,
  };
}
