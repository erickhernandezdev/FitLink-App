import React, { FC } from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { theme } from '../../constants/theme';

interface ExploreCarouselCardProps {
  name: string;
  author: string;
  exerciseCount: number;
  estimatedTime: number;
  downloads: number;
  onPress: () => void;
}

export const ExploreCarouselCard: FC<ExploreCarouselCardProps> = ({
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
        <Text style={styles.title} numberOfLines={1}>
          {name}
        </Text>

        <Text style={styles.author} numberOfLines={1}>
          Por: <Text style={styles.authorHighlight}>{author}</Text>
        </Text>

        <View style={styles.infoColumn}>
          <Text style={styles.infoText}>{estimatedTime} min</Text>
          <Text style={styles.infoText}>{exerciseCount} ejercicios</Text>
          <Text style={styles.infoText}>
            {downloads} {downloads === 1 ? 'descarga' : 'descargas'}
          </Text>
        </View>
      </Pressable>

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
  );
};

const styles = StyleSheet.create({
  action: {
    alignItems: 'center',
    borderTopColor: theme.colors.divider,
    borderTopWidth: 1,
    justifyContent: 'center',
    paddingVertical: 10,
  },
  actionText: {
    color: theme.colors.textSecondary,
    fontFamily: 'Roboto_500Medium',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  author: {
    color: theme.colors.textSecondary,
    fontFamily: 'Roboto_400Regular',
    fontSize: 13,
    marginBottom: 8,
  },
  authorHighlight: {
    color: theme.colors.textSecondary,
    fontFamily: 'Roboto_500Medium',
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.divider,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 12,
    overflow: 'hidden',
    width: 220,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  infoColumn: {
    flexDirection: 'column',
    gap: 4,
  },
  infoText: {
    color: theme.colors.textPrimary,
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
  },
  pressed: {
    opacity: 0.7,
  },
  title: {
    color: theme.colors.textPrimary,
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    marginBottom: 4,
  },
});
