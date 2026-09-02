import React from "react";
import { useRoutineDetailContainer } from "../../containers/RoutineDetailContainer";
import { RoutineDetailContent } from "../details/RoutineDetailContent";
import { CustomAlert } from "../ui/CustomAlert";

interface RoutineDetailViewProps {
  routineId: string | undefined;
}

export const RoutineDetailView: React.FC<RoutineDetailViewProps> = ({
  routineId,
}) => {
  const {
    routine,
    loading,
    handleEdit,
    handleDelete,
    showDeleteConfirmation,
    cancelDelete,
    confirmDelete,
    alertMessage,
    alertTitle,
    alertType,
    clearAlert,
    handleSuccessAlertClose,
  } = useRoutineDetailContainer(routineId);

  const isSuccessAlert = alertType === "success";

  return (
    <>
      <RoutineDetailContent
        routine={routine}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CustomAlert
        visible={showDeleteConfirmation}
        title="Eliminar rutina"
        message="¿Estás seguro de que deseas eliminar esta rutina?"
        type="warning"
        buttons={[
          {
            text: "Cancelar",
            variant: "secondary",
          },
          {
            text: "Eliminar",
            variant: "danger",
            onPress: confirmDelete,
          },
        ]}
        onClose={cancelDelete}
      />

      <CustomAlert
        visible={!!alertMessage}
        title={alertTitle}
        message={alertMessage ?? ""}
        type={alertType}
        buttons={[
          {
            text: "OK",
            variant: "primary",
          },
        ]}
        onClose={isSuccessAlert ? handleSuccessAlertClose : clearAlert}
      />
    </>
  );
};
