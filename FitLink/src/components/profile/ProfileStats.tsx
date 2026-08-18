import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../../constants/theme";

interface ProfileStatsData {
  trainingCount: number;
  trainingTime: string;
  exercisesCount: number;
}

interface ProfileStatsProps {
  stats: ProfileStatsData;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({ stats }) => {
  return (
    <View style={styles.container}>
      <StatCard
        value={stats.trainingCount.toString()}
        label="Entrenamientos"
      />

      <StatCard
        value={stats.trainingTime}
        label="Tiempo entrenado"
      />

      <StatCard
        value={stats.exercisesCount.toString()}
        label="Ejercicios realizados"
      />
    </View>
  );
};

interface StatCardProps {
  value: string;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ value, label }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 15,
  },

  card: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.divider,
    borderRadius: 10,
    borderWidth: 1,
    padding: 20,
  },

  value: {
    color: theme.colors.primary,
    fontFamily: "Roboto_700Bold",
    fontSize: 32,
  },

  label: {
    color: theme.colors.textSecondary,
    fontFamily: "Roboto_400Regular",
    fontSize: 15,
    marginTop: 5,
  },
});