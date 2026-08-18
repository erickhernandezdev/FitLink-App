import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../../constants/theme";

interface ProfileHeaderProps {
  username: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  username,
}) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Hola, {username}</Text>
      <Text style={styles.subtitle}>Tu resumen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginBottom: 25,
  },

  title: {
    color: theme.colors.textPrimary,
    fontFamily: "Roboto_700Bold",
    fontSize: 24,
  },

  subtitle: {
    color: theme.colors.textSecondary,
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    marginTop: 5,
  },
});
