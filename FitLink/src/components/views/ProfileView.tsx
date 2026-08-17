import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useProfileContainer } from '../../containers/ProfileContainer';
import { TrainingHistory } from '../profile/TrainingHistory';
import { Button } from '../ui/Button';
import { theme } from '../../constants/theme';

const ProfileView: React.FC = () => {
  const {
    username,
    trainingHistory,
    loading,
    handleLogout,
  } = useProfileContainer();

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hola, {username}</Text>

      <TrainingHistory sessions={trainingHistory} />

      <Button
        title="Cerrar sesión"
        onPress={handleLogout}
      />
    </View>
  );
};

export default ProfileView;

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
    padding: 20,
  },
  title: {
    color: theme.colors.textPrimary,
    fontFamily: 'Roboto_700Bold',
    fontSize: 24,
  },
});