import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Surface,
  HelperText,
  Checkbox,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { RootState } from '../../store/store';
import { registerStart, registerSuccess, registerFailure } from '../../store/slices/authSlice';
import { colors } from '../../theme/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Por favor ingresa un email válido';
    }

    if (!formData.phone) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Por favor ingresa un número de teléfono válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!acceptTerms) {
      newErrors.terms = 'Debes aceptar los términos y condiciones';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      dispatch(registerStart());

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Navigate to user type selection
      navigation.navigate('UserTypeSelection');

    } catch (err) {
      dispatch(registerFailure('Error al crear la cuenta. Intenta nuevamente.'));
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo crear la cuenta. Intenta nuevamente.',
      });
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Surface style={styles.logoSurface} elevation={2}>
              <Icon name="local-parking" size={40} color={colors.primary} />
            </Surface>
            <Text style={styles.title}>Crear Cuenta</Text>
            <Text style={styles.subtitle}>
              Únete a la comunidad ParkDrive
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <TextInput
              label="Nombre completo"
              value={formData.name}
              onChangeText={(value) => updateFormData('name', value)}
              mode="outlined"
              autoCapitalize="words"
              style={styles.input}
              error={!!errors.name}
              left={<TextInput.Icon icon="account" />}
            />
            <HelperText type="error" visible={!!errors.name}>
              {errors.name}
            </HelperText>

            <TextInput
              label="Email"
              value={formData.email}
              onChangeText={(value) => updateFormData('email', value)}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
              error={!!errors.email}
              left={<TextInput.Icon icon="email" />}
            />
            <HelperText type="error" visible={!!errors.email}>
              {errors.email}
            </HelperText>

            <TextInput
              label="Teléfono"
              value={formData.phone}
              onChangeText={(value) => updateFormData('phone', value)}
              mode="outlined"
              keyboardType="phone-pad"
              style={styles.input}
              error={!!errors.phone}
              left={<TextInput.Icon icon="phone" />}
            />
            <HelperText type="error" visible={!!errors.phone}>
              {errors.phone}
            </HelperText>

            <TextInput
              label="Contraseña"
              value={formData.password}
              onChangeText={(value) => updateFormData('password', value)}
              mode="outlined"
              secureTextEntry={!showPassword}
              style={styles.input}
              error={!!errors.password}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off" : "eye"}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />
            <HelperText type="error" visible={!!errors.password}>
              {errors.password}
            </HelperText>

            <TextInput
              label="Confirmar contraseña"
              value={formData.confirmPassword}
              onChangeText={(value) => updateFormData('confirmPassword', value)}
              mode="outlined"
              secureTextEntry={!showConfirmPassword}
              style={styles.input}
              error={!!errors.confirmPassword}
              left={<TextInput.Icon icon="lock-check" />}
              right={
                <TextInput.Icon
                  icon={showConfirmPassword ? "eye-off" : "eye"}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              }
            />
            <HelperText type="error" visible={!!errors.confirmPassword}>
              {errors.confirmPassword}
            </HelperText>

            {/* Terms and Conditions */}
            <View style={styles.termsContainer}>
              <Checkbox
                status={acceptTerms ? 'checked' : 'unchecked'}
                onPress={() => {
                  setAcceptTerms(!acceptTerms);
                  if (errors.terms) {
                    setErrors(prev => ({ ...prev, terms: '' }));
                  }
                }}
              />
              <Text style={styles.termsText}>
                Acepto los{' '}
                <Text style={styles.termsLink}>términos y condiciones</Text>
                {' '}y la{' '}
                <Text style={styles.termsLink}>política de privacidad</Text>
              </Text>
            </View>
            <HelperText type="error" visible={!!errors.terms}>
              {errors.terms}
            </HelperText>

            {error && (
              <HelperText type="error" visible={true} style={styles.errorText}>
                {error}
              </HelperText>
            )}

            <Button
              mode="contained"
              onPress={handleRegister}
              loading={isLoading}
              disabled={isLoading}
              style={styles.registerButton}
              contentStyle={styles.buttonContent}
            >
              {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Button>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>¿Ya tienes una cuenta?</Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate('Login')}
              style={styles.loginButton}
            >
              Iniciar sesión
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoSurface: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    marginBottom: 40,
  },
  input: {
    marginBottom: 8,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
    marginBottom: 8,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
    lineHeight: 20,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: '500',
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 16,
  },
  registerButton: {
    marginTop: 16,
    marginBottom: 8,
  },
  buttonContent: {
    height: 50,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  loginButton: {
    // Additional styles if needed
  },
});

export default RegisterScreen;