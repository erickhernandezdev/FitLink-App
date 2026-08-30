import React from 'react';
import { useExploreDetailContainer } from '../../containers/ExploreDetailContainer';
import { ExploreRoutineDetailContent } from '../details/ExploreRoutineDetailContent';

interface ExploreDetailViewProps {
  routineId: string | undefined;
}

export const ExploreDetailView: React.FC<ExploreDetailViewProps> = ({ routineId }) => {
  const { 
    routine, 
    loading, 
    isCloned, 
    isCloning, 
    handleClone 
  } = useExploreDetailContainer(routineId);

  return (
    <ExploreRoutineDetailContent
      routine={routine}
      loading={loading}
      isCloned={isCloned}
      isCloning={isCloning}
      onClone={handleClone}
    />
  );
};
