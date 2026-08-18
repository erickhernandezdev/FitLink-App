import React, { FC } from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { theme } from '../../constants/theme';

interface RoutineCardProps {
  name: string;
  exerciseCount: number;
  estimatedTime: number;
  onPress: () => void;
  onStart: () => void;
}

export const RoutineCard: FC<RoutineCardProps> = ({
  name,
  exerciseCount,
  estimatedTime,
  onPress,
  onStart,
}) => {
  return (
    <View style={styles.card}>
      <Pressable
        style={({ pressed }) => [
          styles.content,
          pressed && styles.pressed,
        ]}
        onPress={onPress}
      >
        <Text style={styles.title}>{name}</Text>

        <Text style={styles.info}>
          Cantidad de ejercicios: {exerciseCount}
        </Text>

        <Text style={styles.info}>
          Tiempo estimado: {estimatedTime} minutos
        </Text>
      </Pressable>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [
            styles.action,
            pressed && styles.pressed,
          ]}
          onPress={onPress}
        >
          <Text style={styles.actionText}>Ver detalle</Text>
        </Pressable>

        <View style={styles.divider} />

        <Pressable
          style={({ pressed }) => [
            styles.action,
            pressed && styles.pressed,
          ]}
          onPress={onStart}
        >
          <Text style={styles.actionText}>Entrenamiento</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.divider,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
    overflow: 'hidden',
  },

  content: {
    padding: 15,
  },

  title: {
    color: theme.colors.textPrimary,
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    marginBottom: 8,
  },

  info: {
    color: theme.colors.textSecondary,
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    marginBottom: 4,
  },

  actions: {
    borderTopColor: theme.colors.divider,
    borderTopWidth: 1,
    flexDirection: 'row',
  },

  action: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 12,
  },

  divider: {
    backgroundColor: theme.colors.divider,
    width: 1,
  },

  actionText: {
    color: theme.colors.textSecondary,
    fontFamily: 'Roboto_500Medium',
    fontSize: 14,
  },

  pressed: {
    opacity: 0.7,
  },
});