import React from "react";
import { Modal, View, Text, StyleSheet, Pressable } from "react-native";
import { theme } from "../../constants/theme";

interface CustomAlertButton {
  text: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "danger";
}

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  type?: "success" | "error" | "warning" | "info";
  buttons: CustomAlertButton[];
  onClose: () => void;
}

export const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  type = "info",
  buttons,
  onClose,
}) => {
  const getTypeSymbol = () => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "warning":
        return "!";
      default:
        return "i";
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case "success":
        return theme.colors.primary;
      case "error":
        return theme.colors.error;
      case "warning":
        return "#D99A00";
      default:
        return theme.colors.textSecondary;
    }
  };

  const getButtonStyle = (variant: CustomAlertButton["variant"]) => {
    switch (variant) {
      case "danger":
        return styles.dangerButton;
      case "secondary":
        return styles.secondaryButton;
      default:
        return styles.primaryButton;
    }
  };

  const getButtonTextStyle = (variant: CustomAlertButton["variant"]) => {
    switch (variant) {
      case "danger":
        return styles.dangerButtonText;
      case "secondary":
        return styles.secondaryButtonText;
      default:
        return styles.primaryButtonText;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          <View style={[styles.iconContainer, { borderColor: getTypeColor() }]}>
            <Text style={[styles.icon, { color: getTypeColor() }]}>
              {getTypeSymbol()}
            </Text>
          </View>

          <Text style={styles.title}>{title}</Text>

          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonsContainer}>
            {buttons.map((button, index) => (
              <Pressable
                key={`${button.text}-${index}`}
                style={[styles.button, getButtonStyle(button.variant)]}
                onPress={() => {
                  button.onPress?.();
                  onClose();
                }}
              >
                <Text style={getButtonTextStyle(button.variant)}>
                  {button.text}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    flex: 1,
    justifyContent: "center",
    padding: 25,
  },

  alertContainer: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    maxWidth: 400,
    padding: 25,
    width: "100%",
  },

  iconContainer: {
    alignItems: "center",
    borderRadius: 30,
    borderWidth: 2,
    height: 50,
    justifyContent: "center",
    marginBottom: 15,
    width: 50,
  },

  icon: {
    fontFamily: "Roboto_700Bold",
    fontSize: 25,
  },

  title: {
    color: theme.colors.textPrimary,
    fontFamily: "Roboto_700Bold",
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
  },

  message: {
    color: theme.colors.textSecondary,
    fontFamily: "Roboto_400Regular",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
    textAlign: "center",
  },

  buttonsContainer: {
    gap: 10,
    width: "100%",
  },

  button: {
    alignItems: "center",
    borderRadius: 8,
    minHeight: 42,
    justifyContent: "center",
    paddingHorizontal: 15,
    width: "100%",
  },

  primaryButton: {
    backgroundColor: theme.colors.primary,
  },

  secondaryButton: {
    backgroundColor: "transparent",
    borderColor: theme.colors.divider,
    borderWidth: 1,
  },

  dangerButton: {
    backgroundColor: theme.colors.error,
  },

  primaryButtonText: {
    color: theme.colors.textPrimary,
    fontFamily: "Roboto_700Bold",
    fontSize: 15,
  },

  secondaryButtonText: {
    color: theme.colors.textPrimary,
    fontFamily: "Roboto_700Bold",
    fontSize: 15,
  },

  dangerButtonText: {
    color: theme.colors.textPrimary,
    fontFamily: "Roboto_700Bold",
    fontSize: 15,
  },
});
