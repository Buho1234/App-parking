import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Button,
  Text,
  Surface,
  RadioButton,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { RootState } from '../../store/store';
import { registerSuccess, registerFailure } from '../../store/slices/authSlice';
import { colors } from '../../theme/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';

type UserTypeSelectionNavigationProp = StackNavigationProp<RootStackParamList, 'UserTypeSelection'>;

const UserTypeSelectionScreen: React.FC = () => {
  const navigation = useNavigation<UserTypeSelectionNavigationProp>();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state: RootState) => state.auth);

  const [selectedType, setSelectedType] = useState<'seeker' | 'provider' | null>(null);

  const userTypes = [
    {
      id: 'seeker',
      title: 'Buscador de Estacionamiento',
      description: 'Busco espacios de estacionamiento cercanos',
      icon: 'search',
      features: [
        'Busca estacionamientos disponibles',
        'Negocia precios con propietarios',
        'Reserva espacios de forma segura',
        'Califica tu experiencia',
      ],
      color: colors.primary,
    },
    {
      id: 'provider',
      title: 'Arrendador de Espacios',
      description: 'Ofrezco mi espacio de estacionamiento',
      icon: 'local-parking',
      features: [
        'Publica tus espacios disponibles',
        'Recibe solicitudes de reserva',
        'Gestiona tu disponibilidad',
        'Genera ingresos adicionales',
      ],
      color: colors.secondary,
    },
  ];

  const handleContinue = async () => {
    if (!selectedType) {
      Toast.show({
        type: 'error',
        text1: 'Selección requerida',
        text2: 'Por favor selecciona un tipo de usuario',
      });
      return;
    }

    try {
      // Simulate API call to complete registration
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock successful registration
      const mockUser = {
        id: '1',
        email: 'usuario@demo.com',
        name: 'Usuario Demo',
        phone: '+1234567890',
        userType: selectedType,
        rating: 0,
        totalRatings: 0,
        createdAt: new Date(),
        isVerified: false,
      };

      const mockToken = 'mock-jwt-token';

      dispatch(registerSuccess({ user: mockUser, token: mockToken }));
      
      Toast.show({
        type: 'success',
        text1: '¡Cuenta creada!',
        text2: selectedType === 'seeker' 
          ? 'Ahora puedes buscar estacionamientos' 
          : 'Ahora puedes ofrecer tus espacios',
      });

    } catch (err) {
      dispatch(registerFailure('Error al completar el registro. Intenta nuevamente.'));
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo completar el registro. Intenta nuevamente.',
      });
    }
  };

  const UserTypeCard = ({ userType }: { userType: typeof userTypes[0] }) => {
    const isSelected = selectedType === userType.id;
    
    return (
      <TouchableOpacity
        onPress={() => setSelectedType(userType.id as 'seeker' | 'provider')}
        style={styles.cardTouchable}
      >
        <Surface
          style={[
            styles.card,
            isSelected && { borderColor: userType.color, borderWidth: 2 }
          ]}
          elevation={isSelected ? 4 : 2}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, { backgroundColor: userType.color }]}>
              <Icon name={userType.icon} size={32} color={colors.surface} />
            </View>
            <RadioButton
              value={userType.id}
              status={isSelected ? 'checked' : 'unchecked'}
              onPress={() => setSelectedType(userType.id as 'seeker' | 'provider')}
              color={userType.color}
            />
          </View>
          
          <Text style={styles.cardTitle}>{userType.title}</Text>
          <Text style={styles.cardDescription}>{userType.description}</Text>
          
          <View style={styles.featuresContainer}>
            {userType.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Icon name="check-circle" size={16} color={userType.color} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </Surface>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>¿Cómo usarás ParkDrive?</Text>
          <Text style={styles.subtitle}>
            Selecciona la opción que mejor describa cómo planeas usar la aplicación
          </Text>
        </View>

        {/* User Type Cards */}
        <View style={styles.cardsContainer}>
          {userTypes.map((userType) => (
            <UserTypeCard key={userType.id} userType={userType} />
          ))}
        </View>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleContinue}
            loading={isLoading}
            disabled={!selectedType || isLoading}
            style={[
              styles.continueButton,
              { opacity: selectedType ? 1 : 0.6 }
            ]}
            contentStyle={styles.buttonContent}
          >
            {isLoading ? 'Completando registro...' : 'Continuar'}
          </Button>

          <Text style={styles.noteText}>
            Nota: Podrás cambiar esta configuración más tarde en tu perfil
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  cardsContainer: {
    marginBottom: 40,
  },
  cardTouchable: {
    marginBottom: 20,
  },
  card: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  featuresContainer: {
    // Container for features list
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
  buttonContainer: {
    marginTop: 'auto',
  },
  continueButton: {
    marginBottom: 16,
  },
  buttonContent: {
    height: 50,
  },
  noteText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default UserTypeSelectionScreen;