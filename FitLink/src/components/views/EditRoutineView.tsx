import { useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEditRoutineContainer } from '../../containers/EditRoutineContainer';
import RoutineForm from '../forms/RoutineForm';
import { CustomAlert } from '../ui/CustomAlert';
import { theme } from '../../constants/theme';

interface EditRoutineViewProps {
  routineId: string;
}

export default function EditRoutineView({ routineId }: EditRoutineViewProps) {
  const navigation = useNavigation();
  const container = useEditRoutineContainer({ routineId });

  const [showUnsavedChangesAlert, setShowUnsavedChangesAlert] =
    useState(false);

  const [pendingNavigationAction, setPendingNavigationAction] =
    useState<any>(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (!container.shouldBlockNavigation || !container.hasChanges()) {
        return;
      }

      e.preventDefault();

      setPendingNavigationAction(e.data.action);
      setShowUnsavedChangesAlert(true);
    });

    return unsubscribe;
  }, [
    navigation,
    container.shouldBlockNavigation,
    container.hasChanges,
  ]);

  return (
    <>
      {container.isLoading ? (
        <SafeAreaView style={styles.container}>
          <View style={styles.center}>
            <ActivityIndicator
              size="large"
              color={theme.colors.primary}
            />
            <Text style={styles.loadingText}>
              Cargando rutina...
            </Text>
          </View>
        </SafeAreaView>
      ) : (
        <SafeAreaView style={styles.container}>
          <RoutineForm
            {...container}
            submitLabel="Guardar cambios"
          />
        </SafeAreaView>
      )}

      <CustomAlert
        visible={showUnsavedChangesAlert}
        title="Cambios sin guardar"
        message="¿Deseas salir sin guardar los cambios?"
        type="warning"
        buttons={[
          {
            text: 'Cancelar',
            variant: 'secondary',
          },
          {
            text: 'Salir',
            variant: 'danger',
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
  center: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  loadingText: {
    color: theme.colors.textSecondary,
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    marginTop: 10,
  },
});
