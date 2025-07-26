import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Chip,
  Switch,
  HelperText,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/theme';
import { addParkingSpaceSuccess } from '../../store/slices/parkingSlice';
import Toast from 'react-native-toast-message';

const AddParkingSpaceScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    pricePerHour: '',
    pricePerDay: '',
    totalSpaces: '1',
    isSecure: false,
    isCovered: false,
    hasElectricCharging: false,
    accessInstructions: '',
  });

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const amenitiesOptions = [
    'Techado', 'Seguridad 24/7', 'Carga eléctrica', 'Acceso fácil', 
    'Vigilancia', 'Cámaras de seguridad', 'Iluminación', 'Cerca del transporte público'
  ];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es requerida';
    }

    if (!formData.pricePerHour || isNaN(Number(formData.pricePerHour)) || Number(formData.pricePerHour) <= 0) {
      newErrors.pricePerHour = 'Ingresa un precio por hora válido';
    }

    if (!formData.totalSpaces || isNaN(Number(formData.totalSpaces)) || Number(formData.totalSpaces) <= 0) {
      newErrors.totalSpaces = 'Ingresa un número de espacios válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      // Create new parking space
      const newSpace = {
        id: Date.now().toString(),
        providerId: 'current-user-id',
        providerName: 'Usuario Actual',
        providerPhone: '+1234567890',
        providerRating: 4.5,
        title: formData.title,
        description: formData.description,
        address: formData.address,
        coordinates: {
          latitude: 40.7128 + (Math.random() - 0.5) * 0.01,
          longitude: -74.0060 + (Math.random() - 0.5) * 0.01,
        },
        pricePerHour: Number(formData.pricePerHour),
        pricePerDay: formData.pricePerDay ? Number(formData.pricePerDay) : undefined,
        images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
        amenities: selectedAmenities,
        maxVehicleSize: 'medium' as const,
        isAvailable: true,
        availableFrom: new Date(),
        availableTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        createdAt: new Date(),
        totalSpaces: Number(formData.totalSpaces),
        occupiedSpaces: 0,
        isSecure: formData.isSecure,
        isCovered: formData.isCovered,
        hasElectricCharging: formData.hasElectricCharging,
        accessInstructions: formData.accessInstructions || undefined,
      };

      dispatch(addParkingSpaceSuccess(newSpace));
      
      Toast.show({
        type: 'success',
        text1: '¡Estacionamiento agregado!',
        text2: 'Tu espacio ha sido publicado exitosamente',
      });

      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo agregar el estacionamiento',
      });
    }
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Información Básica</Text>
              
              <TextInput
                label="Título del estacionamiento"
                value={formData.title}
                onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
                mode="outlined"
                style={styles.input}
                error={!!errors.title}
              />
              <HelperText type="error" visible={!!errors.title}>
                {errors.title}
              </HelperText>

              <TextInput
                label="Descripción"
                value={formData.description}
                onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                mode="outlined"
                multiline
                numberOfLines={3}
                style={styles.input}
                error={!!errors.description}
              />
              <HelperText type="error" visible={!!errors.description}>
                {errors.description}
              </HelperText>

              <TextInput
                label="Dirección completa"
                value={formData.address}
                onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
                mode="outlined"
                style={styles.input}
                error={!!errors.address}
              />
              <HelperText type="error" visible={!!errors.address}>
                {errors.address}
              </HelperText>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Precios y Capacidad</Text>
              
              <TextInput
                label="Precio por hora ($)"
                value={formData.pricePerHour}
                onChangeText={(text) => setFormData(prev => ({ ...prev, pricePerHour: text }))}
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
                error={!!errors.pricePerHour}
              />
              <HelperText type="error" visible={!!errors.pricePerHour}>
                {errors.pricePerHour}
              </HelperText>

              <TextInput
                label="Precio por día ($) - Opcional"
                value={formData.pricePerDay}
                onChangeText={(text) => setFormData(prev => ({ ...prev, pricePerDay: text }))}
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
              />

              <TextInput
                label="Número de espacios"
                value={formData.totalSpaces}
                onChangeText={(text) => setFormData(prev => ({ ...prev, totalSpaces: text }))}
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
                error={!!errors.totalSpaces}
              />
              <HelperText type="error" visible={!!errors.totalSpaces}>
                {errors.totalSpaces}
              </HelperText>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Características</Text>
              
              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Estacionamiento seguro</Text>
                <Switch
                  value={formData.isSecure}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, isSecure: value }))}
                />
              </View>

              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Techado/Cubierto</Text>
                <Switch
                  value={formData.isCovered}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, isCovered: value }))}
                />
              </View>

              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Carga eléctrica disponible</Text>
                <Switch
                  value={formData.hasElectricCharging}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, hasElectricCharging: value }))}
                />
              </View>

              <Text style={styles.amenitiesTitle}>Servicios adicionales</Text>
              <View style={styles.amenitiesContainer}>
                {amenitiesOptions.map((amenity) => (
                  <Chip
                    key={amenity}
                    selected={selectedAmenities.includes(amenity)}
                    onPress={() => toggleAmenity(amenity)}
                    style={styles.amenityChip}
                  >
                    {amenity}
                  </Chip>
                ))}
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Información Adicional</Text>
              
              <TextInput
                label="Instrucciones de acceso (opcional)"
                value={formData.accessInstructions}
                onChangeText={(text) => setFormData(prev => ({ ...prev, accessInstructions: text }))}
                mode="outlined"
                multiline
                numberOfLines={3}
                style={styles.input}
                placeholder="Ej: Llamar al llegar, portón automático con código 1234, etc."
              />
            </Card.Content>
          </Card>

          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={() => navigation.goBack()}
              style={styles.cancelButton}
            >
              Cancelar
            </Button>
            
            <Button
              mode="contained"
              onPress={handleSave}
              style={styles.saveButton}
            >
              Guardar Espacio
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
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  input: {
    marginBottom: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  amenitiesTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginTop: 16,
    marginBottom: 12,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 32,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
  },
});

export default AddParkingSpaceScreen;