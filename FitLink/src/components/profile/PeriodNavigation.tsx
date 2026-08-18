import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../../constants/theme";

interface PeriodNavigationProps {
  periodLabel: string;
  onPrevious: () => void;
  onNext: () => void;
}

export const PeriodNavigation: React.FC<PeriodNavigationProps> = ({
  periodLabel,
  onPrevious,
  onNext,
}) => {
  return (
    <View style={styles.container}>
      <Pressable style={styles.arrowButton} onPress={onPrevious}>
        <Text style={styles.arrow}>‹</Text>
      </Pressable>

      <Text style={styles.label}>{periodLabel}</Text>

      <Pressable style={styles.arrowButton} onPress={onNext}>
        <Text style={styles.arrow}>›</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  arrowButton: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },

  arrow: {
    color: theme.colors.textPrimary,
    fontSize: 30,
    lineHeight: 34,
  },

  label: {
    color: theme.colors.textPrimary,
    fontFamily: "Roboto_500Medium",
    fontSize: 17,
    textTransform: "capitalize",
  },
});