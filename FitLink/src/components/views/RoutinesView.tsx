import React from "react";
import { useRouter } from "expo-router";
import { useRoutinesContainer } from "../../containers/RoutinesContainer";
import { RoutinesList } from "../lists/RoutinesList";

export const RoutinesView: React.FC = () => {
  const router = useRouter();

  const {
    routines,
    allRoutinesCount,
    loading,
    recommendedRoutine,
    searchQuery,
    setSearchQuery,
    navigateToRoutine,
    navigateToAddRoutine,
    navigateToQuickStart,
  } = useRoutinesContainer();

  const navigateToExplore = () => {
    router.push("/(tabs)/explore");
  };

  return (
    <RoutinesList
      routines={routines}
      allRoutinesCount={allRoutinesCount}
      loading={loading}
      recommendedRoutine={recommendedRoutine}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onRoutinePress={navigateToRoutine}
      onAddRoutine={navigateToAddRoutine}
      onQuickStart={navigateToQuickStart}
      onExplore={navigateToExplore}
    />
  );
};
