import React from "react";
import { useExploreDetailContainer } from "../../containers/ExploreDetailContainer";
import { ExploreRoutineDetailContent } from "../details/ExploreRoutineDetailContent";
import { CustomAlert } from "../ui/CustomAlert";

interface ExploreDetailViewProps {
  routineId: string | undefined;
}

export const ExploreDetailView: React.FC<ExploreDetailViewProps> = ({
  routineId,
}) => {
  const {
    routine,
    loading,
    isCloned,
    isCloning,
    handleClone,
    showSuccessAlert,
    setShowSuccessAlert,
    alertMessage,
    clearAlert,
  } = useExploreDetailContainer(routineId);

  return (
    <>
      <ExploreRoutineDetailContent
        routine={routine}
        loading={loading}
        isCloned={isCloned}
        isCloning={isCloning}
        onClone={handleClone}
        showSuccessAlert={showSuccessAlert}
        onCloseSuccessAlert={() => setShowSuccessAlert(false)}
      />

      <CustomAlert
        visible={!!alertMessage}
        title="Error"
        message={alertMessage ?? ""}
        type="error"
        buttons={[
          {
            text: "OK",
            variant: "primary",
          },
        ]}
        onClose={clearAlert}
      />
    </>
  );
};
