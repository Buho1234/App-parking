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
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { RootState } from '../../store/store';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import { colors } from '../../theme/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    // Reset errors
    setEmailError('');
    setPasswordError('');

    // Validate inputs
    let hasErrors = false;

    if (!email) {
      setEmailError('El email es requerido');
      hasErrors = true;
    } else if (!validateEmail(email)) {
      setEmailError('Por favor ingresa un email válido');
      hasErrors = true;
    }

    if (!password) {
      setPasswordError('La contraseña es requerida');
      hasErrors = true;
    } else if (password.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      hasErrors = true;
    }

    if (hasErrors) return;

    try {
      dispatch(loginStart());

      // Simulate API call - In real app, replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock successful login - Replace with real authentication
      const mockUser = {
        id: '1',
        email: email,
        name: 'Usuario Demo',
        phone: '+1234567890',
        userType: 'seeker' as const,
        rating: 4.5,
        totalRatings: 120,
        createdAt: new Date(),
        isVerified: true,
      };

      const mockToken = 'mock-jwt-token';

      dispatch(loginSuccess({ user: mockUser, token: mockToken }));
      Toast.show({
        type: 'success',
        text1: '¡Bienvenido!',
        text2: 'Has iniciado sesión correctamente',
      });

    } catch (err) {
      dispatch(loginFailure('Error al iniciar sesión. Verifica tus credenciales.'));
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo iniciar sesión. Verifica tus credenciales.',
      });
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
            <Text style={styles.title}>Iniciar Sesión</Text>
            <Text style={styles.subtitle}>
              Accede a tu cuenta de ParkDrive
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
              error={!!emailError}
              left={<TextInput.Icon icon="email" />}
            />
            <HelperText type="error" visible={!!emailError}>
              {emailError}
            </HelperText>

            <TextInput
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry={!showPassword}
              style={styles.input}
              error={!!passwordError}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off" : "eye"}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />
            <HelperText type="error" visible={!!passwordError}>
              {passwordError}
            </HelperText>

            {error && (
              <HelperText type="error" visible={true} style={styles.errorText}>
                {error}
              </HelperText>
            )}

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
              style={styles.loginButton}
              contentStyle={styles.buttonContent}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>

            <Button
              mode="text"
              onPress={() => {/* TODO: Forgot password */}}
              style={styles.forgotButton}
            >
              ¿Olvidaste tu contraseña?
            </Button>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>¿No tienes una cuenta?</Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate('Register')}
              style={styles.signupButton}
            >
              Crear cuenta
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
    justifyContent: 'center',
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
  errorText: {
    textAlign: 'center',
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 16,
    marginBottom: 8,
  },
  buttonContent: {
    height: 50,
  },
  forgotButton: {
    alignSelf: 'center',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  signupButton: {
    // Additional styles if needed
  },
});

export default LoginScreen;