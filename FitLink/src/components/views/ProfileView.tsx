import React from "react";
import { ActivityIndicator, StyleSheet, View, ScrollView } from "react-native";
import { useProfileContainer } from "../../containers/ProfileContainer";
import { Button } from "../ui/Button";
import { theme } from "../../constants/theme";
import { ProfileHeader } from "../profile/ProfileHeader";
import { PeriodSelector } from "../profile/PeriodSelector";
import { PeriodNavigation } from "../profile/PeriodNavigation";
import { ProfileStats } from "../profile/ProfileStats";

const ProfileView: React.FC = () => {
  const {
    username,
    loading,
    period,
    periodLabel,
    handlePeriodChange,
    previousPeriod,
    nextPeriod,
    stats,
    handleLogout,
  } = useProfileContainer();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ProfileHeader username={username} />

      <PeriodSelector period={period} onPeriodChange={handlePeriodChange} />

      {period !== "total" && (
        <PeriodNavigation
          periodLabel={periodLabel}
          onPrevious={previousPeriod}
          onNext={nextPeriod}
        />
      )}

      <ProfileStats stats={stats} />

      <View style={styles.logoutContainer}>
        <Button title="Cerrar sesión" onPress={handleLogout} variant="danger" />
      </View>
    </ScrollView>
  );
};

export default ProfileView;

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    backgroundColor: theme.colors.background,
    flex: 1,
    justifyContent: "center",
  },

  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  logoutContainer: {
    marginTop: 30,
  },
});
