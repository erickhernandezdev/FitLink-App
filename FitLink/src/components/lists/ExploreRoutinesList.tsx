import React from "react";
import {
  FlatList,
  ScrollView,
  ActivityIndicator,
  View,
  StyleSheet,
  Text,
  RefreshControl,
} from "react-native";
import { ExploreRoutineCard } from "../explore/ExploreRoutineCard";
import { ExploreSectionCarousel } from "../explore/ExploreSectionCarousel";
import { SearchInput } from "../ui";
import { theme } from "../../constants/theme";
import { SharedRoutine } from "../../containers/ExploreContainer";

interface ExploreRoutinesListProps {
  popularRoutines: SharedRoutine[];
  recentRoutines: SharedRoutine[];
  teamRoutines: SharedRoutine[];
  searchResults: SharedRoutine[];
  loading: boolean;
  refreshing: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRefresh: () => void;
  onRoutinePress: (routineId: number) => void;
}

export const ExploreRoutinesList: React.FC<ExploreRoutinesListProps> = ({
  popularRoutines,
  recentRoutines,
  teamRoutines,
  searchResults,
  loading,
  refreshing,
  searchQuery,
  onSearchChange,
  onRefresh,
  onRoutinePress,
}) => {
  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const isSearching = searchQuery.trim().length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.titleRowText}>Explorar comunidad</Text>
        <SearchInput
          placeholder="Buscar por rutina, creador o descripción..."
          value={searchQuery}
          onChangeText={onSearchChange}
        />
      </View>

      {isSearching ? (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.routine_id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.searchResultsContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
            />
          }
          renderItem={({ item }) => (
            <View style={styles.routineItem}>
              <ExploreRoutineCard
                name={item.name}
                author={item.users?.username || "Usuario FitLink"}
                exerciseCount={item.routine_exercises?.length ?? 0}
                estimatedTime={item.estimated_time}
                downloads={item.downloads ?? 0}
                onPress={() => onRoutinePress(item.routine_id)}
              />
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.searchEmptyContainer}>
              <Text style={styles.emptyText}>
                No se encontraron rutinas para "{searchQuery}"
              </Text>
            </View>
          }
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollSectionsContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
            />
          }
        >
          <ExploreSectionCarousel
            title="Creadas por FitLink Team"
            routines={teamRoutines}
            onRoutinePress={onRoutinePress}
          />

          <ExploreSectionCarousel
            title="Más Populares"
            routines={popularRoutines}
            onRoutinePress={onRoutinePress}
          />

          <ExploreSectionCarousel
            title="Más Recientes"
            routines={recentRoutines}
            onRoutinePress={onRoutinePress}
          />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontFamily: "Roboto_400Regular",
    fontSize: 15,
    textAlign: "center",
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  routineItem: {
    marginBottom: 5,
  },
  searchResultsContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  searchEmptyContainer: {
    alignItems: "center",
    paddingVertical: 30,
  },
  scrollSectionsContent: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  titleRowText: {
    color: theme.colors.textPrimary,
    fontSize: 22,
    fontFamily: "Roboto_700Bold",
    marginBottom: 10,
  },
});
