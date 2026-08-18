import React, { FC } from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { theme } from '../../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

export const Button: FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
}) => {
  const getButtonStyle = () => {
    if (disabled) {
      return [styles.button, styles.buttonDisabled];
    }

    switch (variant) {
      case 'secondary':
        return [styles.button, styles.buttonSecondary];

      case 'danger':
        return [styles.button, styles.buttonDanger];

      default:
        return [styles.button, styles.buttonPrimary];
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return [styles.text, styles.textSecondary];

      case 'danger':
        return [styles.text, styles.textDanger];

      default:
        return [styles.text, styles.textPrimary];
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          ...getButtonStyle(),
          pressed && !disabled && styles.buttonPressed,
        ]}
        onPress={disabled ? undefined : onPress}
        disabled={disabled}
      >
        <Text style={getTextStyle()}>{title}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    width: '100%',
  },

  buttonPrimary: {
    backgroundColor: theme.colors.primary,
  },

  buttonSecondary: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.divider,
    borderWidth: 1,
  },

  buttonDanger: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.error,
    borderWidth: 1,
  },

  buttonDisabled: {
    backgroundColor: theme.colors.divider,
  },

  buttonPressed: {
    opacity: 0.8,
  },

  container: {
    marginBottom: 10,
  },

  text: {
    fontSize: 16,
    fontWeight: '500',
  },

  textPrimary: {
    color: theme.colors.textPrimary,
  },

  textSecondary: {
    color: theme.colors.textPrimary,
  },

  textDanger: {
    color: theme.colors.error,
  },
});
