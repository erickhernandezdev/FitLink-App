import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../../constants/theme";

type Period = "week" | "month" | "year" | "total";

interface PeriodSelectorProps {
  period: Period;
  onPeriodChange: (period: Period) => void;
}

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  period,
  onPeriodChange,
}) => {
  const periods = [
    { key: "week" as const, label: "Semana" },
    { key: "month" as const, label: "Mes" },
    { key: "year" as const, label: "Año" },
    { key: "total" as const, label: "Total" },
  ];

  return (
    <View style={styles.container}>
      {periods.map((item) => (
        <Pressable
          key={item.key}
          style={[
            styles.button,
            period === item.key && styles.buttonActive,
          ]}
          onPress={() => onPeriodChange(item.key)}
        >
          <Text
            style={[
              styles.text,
              period === item.key && styles.textActive,
            ]}
          >
            {item.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    flexDirection: "row",
    marginBottom: 20,
    padding: 5,
  },

  button: {
    alignItems: "center",
    borderRadius: 7,
    flex: 1,
    paddingVertical: 10,
  },

  buttonActive: {
    backgroundColor: theme.colors.primary,
  },

  text: {
    color: theme.colors.textSecondary,
    fontFamily: "Roboto_500Medium",
    fontSize: 14,
  },

  textActive: {
    color: theme.colors.textPrimary,
  },
});