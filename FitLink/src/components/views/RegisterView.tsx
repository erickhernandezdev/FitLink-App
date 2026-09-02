import React from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRegisterContainer } from "../../containers/RegisterContainer";
import { RegisterForm } from "../forms/RegisterForm";
import { CustomAlert } from "../ui/CustomAlert";
import { theme } from "../../constants/theme";

export const RegisterView: React.FC = () => {
  const {
    formData,
    errors,
    loading,
    updateField,
    handleRegister,
    navigateToLogin,
    alertMessage,
    clearAlert,
  } = useRegisterContainer();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <RegisterForm
          // Datos del formulario
          fullName={formData.fullName}
          email={formData.email}
          username={formData.username}
          password={formData.password}
          // Errores de validación
          fullNameError={errors.fullName}
          emailError={errors.email}
          usernameError={errors.username}
          passwordError={errors.password}
          // Estados del form
          loading={loading}
          // FUnciones
          onFullNameChange={(value) => updateField('fullName', value)}
          onEmailChange={(value) => updateField('email', value)}
          onUsernameChange={(value) => updateField('username', value)}
          onPasswordChange={(value) => updateField('password', value)}
          onRegister={handleRegister}
          onNavigateToLogin={navigateToLogin}
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  safeArea: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
});
