import React from "react";
import { useExploreContainer } from "../../containers/ExploreContainer";
import { ExploreRoutinesList } from "../lists/ExploreRoutinesList";

export const ExploreView: React.FC = () => {
  const {
    popularRoutines,
    recentRoutines,
    teamRoutines,
    searchResults,
    loading,
    refreshing,
    searchQuery,
    setSearchQuery,
    handleRefresh,
    navigateToDetail,
  } = useExploreContainer();

  return (
    <ExploreRoutinesList
      popularRoutines={popularRoutines}
      recentRoutines={recentRoutines}
      teamRoutines={teamRoutines}
      searchResults={searchResults}
      loading={loading}
      refreshing={refreshing}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onRefresh={handleRefresh}
      onRoutinePress={navigateToDetail}
    />
  );
};