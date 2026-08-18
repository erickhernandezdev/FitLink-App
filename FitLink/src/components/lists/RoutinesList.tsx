import React from "react";
import {
  FlatList,
  ActivityIndicator,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { RoutineCard, SearchInput } from "../ui";
import { Button } from "../ui";
import { theme } from "../../constants/theme";
import { Routine } from "../../containers/RoutinesContainer";

interface RoutinesListProps {
  routines: Routine[];
  recommendedRoutine: Routine | null;
  loading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRoutinePress: (routineId: number) => void;
  onAddRoutine: () => void;
  onQuickStart: (routineId: number) => void;
  onExplore: () => void;
}

export const RoutinesList: React.FC<RoutinesListProps> = ({
  routines,
  recommendedRoutine,
  loading,
  searchQuery,
  onSearchChange,
  onRoutinePress,
  onAddRoutine,
  onQuickStart,
  onExplore,
}) => {
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
        />
      </View>
    );
  }

  if (routines.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>
          No tienes rutinas guardadas
        </Text>

        <Text style={styles.emptyText}>
          Explora las rutinas disponibles o crea una nueva para comenzar.
        </Text>

        <View style={styles.emptyButtons}>
          <Button
            title="Explorar rutinas"
            onPress={onExplore}
          />

          <Button
            title="Crear rutina"
            onPress={onAddRoutine}
            variant="secondary"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={routines}
        keyExtractor={(item) => item.routine_id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.routineItem}>
            <RoutineCard
              name={item.name}
              exerciseCount={item.routine_exercises?.length ?? 0}
              estimatedTime={item.estimated_time}
              onPress={() => onRoutinePress(item.routine_id)}
              onStart={() => onQuickStart(item.routine_id)}
            />
          </View>
        )}
        ListHeaderComponent={
          <>
            {recommendedRoutine && (
              <>
                <Text style={styles.sectionTitle}>
                  Rutina del día
                </Text>

                <RoutineCard
                  name={recommendedRoutine.name}
                  exerciseCount={
                    recommendedRoutine.routine_exercises?.length ?? 0
                  }
                  estimatedTime={recommendedRoutine.estimated_time}
                  onPress={() =>
                    onRoutinePress(recommendedRoutine.routine_id)
                  }
                  onStart={() =>
                    onQuickStart(recommendedRoutine.routine_id)
                  }
                />
              </>
            )}

            <View style={styles.titleRow}>
              <Text style={styles.titleRowText}>
                Tus rutinas
              </Text>

              <TouchableOpacity
                onPress={onAddRoutine}
                style={styles.addButton}
              >
                <FontAwesome
                  name="plus"
                  size={18}
                  color={theme.colors.textPrimary}
                />
              </TouchableOpacity>
            </View>

            <SearchInput
              placeholder="Buscar rutina..."
              value={searchQuery}
              onChangeText={onSearchChange}
            />
          </>
        }
      />
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
    padding: 20,
  },

  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },

  titleRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    marginTop: 20,
  },

  titleRowText: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: "600",
  },

  addButton: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },

  routineItem: {
    marginBottom: 5,
  },

  emptyContainer: {
    alignItems: "center",
    backgroundColor: theme.colors.background,
    flex: 1,
    justifyContent: "center",
    padding: 30,
  },

  emptyTitle: {
    color: theme.colors.textPrimary,
    fontFamily: "Roboto_700Bold",
    fontSize: 22,
    marginBottom: 10,
    textAlign: "center",
  },

  emptyText: {
    color: theme.colors.textSecondary,
    fontFamily: "Roboto_400Regular",
    fontSize: 15,
    marginBottom: 25,
    textAlign: "center",
  },

  emptyButtons: {
    maxWidth: 320,
    width: "100%",
  },
});
