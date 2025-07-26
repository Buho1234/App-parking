import React from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from 'react-native';
import {
  Button,
  Text,
  Surface,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { colors } from '../../theme/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';

type AuthScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Auth'>;

const { width, height } = Dimensions.get('window');

const AuthScreen: React.FC = () => {
  const navigation = useNavigation<AuthScreenNavigationProp>();

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
      }}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay} />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {/* Logo and Title */}
          <View style={styles.logoContainer}>
            <Surface style={styles.logoSurface} elevation={3}>
              <Icon name="local-parking" size={60} color={colors.primary} />
            </Surface>
            <Text style={styles.title}>ParkDrive</Text>
            <Text style={styles.subtitle}>
              Encuentra y ofrece estacionamientos al instante
            </Text>
          </View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            <View style={styles.feature}>
              <Icon name="search" size={24} color={colors.surface} />
              <Text style={styles.featureText}>Busca espacios cercanos</Text>
            </View>
            <View style={styles.feature}>
              <Icon name="monetization-on" size={24} color={colors.surface} />
              <Text style={styles.featureText}>Negocia precios justos</Text>
            </View>
            <View style={styles.feature}>
              <Icon name="security" size={24} color={colors.surface} />
              <Text style={styles.featureText}>Transacciones seguras</Text>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Login')}
              style={styles.primaryButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
            >
              Iniciar Sesión
            </Button>
            
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('Register')}
              style={styles.secondaryButton}
              contentStyle={styles.buttonContent}
              labelStyle={[styles.buttonLabel, { color: colors.surface }]}
            >
              Crear Cuenta
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  logoSurface: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.surface,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.surface,
    textAlign: 'center',
    opacity: 0.9,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    marginVertical: 40,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  featureText: {
    fontSize: 16,
    color: colors.surface,
    marginLeft: 16,
    opacity: 0.9,
  },
  buttonContainer: {
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    marginBottom: 16,
  },
  secondaryButton: {
    borderColor: colors.surface,
    borderWidth: 2,
  },
  buttonContent: {
    height: 50,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AuthScreen;