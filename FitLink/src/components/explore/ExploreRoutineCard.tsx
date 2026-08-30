import React, { FC } from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { theme } from '../../constants/theme';

interface ExploreRoutineCardProps {
  name: string;
  author: string;
  exerciseCount: number;
  estimatedTime: number;
  downloads: number;
  onPress: () => void;
}

export const ExploreRoutineCard: FC<ExploreRoutineCardProps> = ({
  name,
  author,
  exerciseCount,
  estimatedTime,
  downloads,
  onPress,
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

        <Text style={styles.author}>
          Creado por: <Text style={styles.authorHighlight}>{author}</Text>
        </Text>

        <Text style={styles.info}>
          Cantidad de ejercicios: {exerciseCount}
        </Text>

        <Text style={styles.info}>
          Tiempo estimado: {estimatedTime} minutos
        </Text>

        <Text style={styles.info}>
          Descargas: {downloads}
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  action: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 12,
  },
  actionText: {
    color: theme.colors.textSecondary,
    fontFamily: 'Roboto_500Medium',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  actions: {
    borderTopColor: theme.colors.divider,
    borderTopWidth: 1,
    flexDirection: 'row',
  },
  author: {
    color: theme.colors.textSecondary,
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    marginBottom: 6,
  },
  authorHighlight: {
    color: theme.colors.textSecondary,
    fontFamily: 'Roboto_500Medium',
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.divider,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
  },
  content: {
    padding: 15,
  },
  info: {
    color: theme.colors.textSecondary,
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    marginBottom: 4,
  },
  pressed: {
    opacity: 0.7,
  },
  title: {
    color: theme.colors.textPrimary,
    fontFamily: 'Roboto_700Bold',
    fontSize: 18,
    marginBottom: 4,
  },
});
