import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { ExploreCarouselCard } from './ExploreCarouselCard';
import { SharedRoutine } from '../../containers/ExploreContainer';
import { theme } from '../../constants/theme';

interface ExploreSectionCarouselProps {
  title: string;
  routines: SharedRoutine[];
  onRoutinePress: (routineId: number) => void;
}

export const ExploreSectionCarousel: React.FC<ExploreSectionCarouselProps> = ({
  title,
  routines,
  onRoutinePress,
}) => {
  if (routines.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        horizontal
        data={routines}
        keyExtractor={(item) => item.routine_id.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ExploreCarouselCard
            name={item.name}
            author={item.users?.username || 'FitLink User'}
            exerciseCount={item.routine_exercises?.length ?? 0}
            estimatedTime={item.estimated_time}
            downloads={item.downloads ?? 0}
            onPress={() => onRoutinePress(item.routine_id)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  listContent: {
    paddingHorizontal: 20,
  },
  title: {
    color: theme.colors.textPrimary,
    fontFamily: 'Roboto_700Bold',
    fontSize: 18,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
});
