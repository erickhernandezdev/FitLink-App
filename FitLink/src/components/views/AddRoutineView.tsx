import { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { useAddRoutineContainer } from "../../containers/AddRoutineContainer";
import RoutineForm from "../forms/RoutineForm";
import { CustomAlert } from "../ui/CustomAlert";
import { theme } from "../../constants/theme";

export default function AddRoutineView() {
  const navigation = useNavigation();

  const container = useAddRoutineContainer();

  const [showUnsavedChangesAlert, setShowUnsavedChangesAlert] = useState(false);

  const [pendingNavigationAction, setPendingNavigationAction] =
    useState<any>(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (!container.shouldBlockNavigation || !container.hasChanges()) {
        return;
      }

      e.preventDefault();

      setPendingNavigationAction(e.data.action);
      setShowUnsavedChangesAlert(true);
    });

    return unsubscribe;
  }, [navigation, container.shouldBlockNavigation, container.hasChanges]);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <RoutineForm {...container} submitLabel="Guardar rutina" />
      </SafeAreaView>

      <CustomAlert
        visible={showUnsavedChangesAlert}
        title="Cambios sin guardar"
        message="¿Deseas salir sin guardar los cambios?"
        type="warning"
        buttons={[
          {
            text: "Cancelar",
            variant: "secondary",
          },
          {
            text: "Salir",
            variant: "danger",
            onPress: () => {
              if (pendingNavigationAction) {
                navigation.dispatch(pendingNavigationAction);
              }
            },
          },
        ]}
        onClose={() => {
          setShowUnsavedChangesAlert(false);
          setPendingNavigationAction(null);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
});
