import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ExploreDetailView } from '../../../components/views/ExploreDetailView';

export default function ExploreDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <ExploreDetailView routineId={id} />;
}
