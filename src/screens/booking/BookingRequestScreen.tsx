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
  Surface,
  HelperText,
  Divider,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList } from '../../types';
import { colors } from '../../theme/theme';
import { createBookingRequestSuccess } from '../../store/slices/bookingSlice';
import Toast from 'react-native-toast-message';

type BookingRequestScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BookingRequest'>;
type BookingRequestScreenRouteProp = RouteProp<RootStackParamList, 'BookingRequest'>;

const BookingRequestScreen: React.FC = () => {
  const navigation = useNavigation<BookingRequestScreenNavigationProp>();
  const route = useRoute<BookingRequestScreenRouteProp>();
  const dispatch = useDispatch();
  const { parkingSpace } = route.params;

  const [startDateTime, setStartDateTime] = useState(new Date());
  const [endDateTime, setEndDateTime] = useState(new Date(Date.now() + 2 * 60 * 60 * 1000));
  const [proposedPrice, setProposedPrice] = useState(parkingSpace.pricePerHour.toString());
  const [message, setMessage] = useState('');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [vehicleInfo, setVehicleInfo] = useState({
    type: 'car' as const,
    licensePlate: '',
    color: '',
    make: '',
    model: '',
  });

  const calculateTotalHours = () => {
    return Math.max(1, Math.ceil((endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60)));
  };

  const calculateTotalPrice = () => {
    const hours = calculateTotalHours();
    const pricePerHour = Number(proposedPrice) || parkingSpace.pricePerHour;
    return hours * pricePerHour;
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (startDateTime >= endDateTime) {
      newErrors.dateTime = 'La fecha de fin debe ser posterior a la de inicio';
    }

    if (startDateTime < new Date()) {
      newErrors.dateTime = 'No puedes reservar en el pasado';
    }

    if (!vehicleInfo.licensePlate.trim()) {
      newErrors.licensePlate = 'La placa es requerida';
    }

    if (!vehicleInfo.color.trim()) {
      newErrors.color = 'El color del vehículo es requerido';
    }

    if (!proposedPrice || isNaN(Number(proposedPrice)) || Number(proposedPrice) <= 0) {
      newErrors.proposedPrice = 'Ingresa un precio válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const newRequest = {
        id: Date.now().toString(),
        seekerId: 'current-user-id',
        seekerName: 'Usuario Actual',
        seekerPhone: '+1234567890',
        parkingSpaceId: parkingSpace.id,
        parkingSpaceTitle: parkingSpace.title,
        parkingSpaceAddress: parkingSpace.address,
        startDateTime,
        endDateTime,
        totalHours: calculateTotalHours(),
        proposedPrice: calculateTotalPrice(),
        message: message.trim() || undefined,
        status: 'pending' as const,
        createdAt: new Date(),
        vehicleInfo,
      };

      dispatch(createBookingRequestSuccess(newRequest));
      
      Toast.show({
        type: 'success',
        text1: '¡Solicitud enviada!',
        text2: 'El arrendador recibirá tu solicitud',
      });

      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo enviar la solicitud',
      });
    }
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Parking Space Info */}
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Estacionamiento Seleccionado</Text>
              <Text style={styles.spaceName}>{parkingSpace.title}</Text>
              <Text style={styles.spaceAddress}>{parkingSpace.address}</Text>
              <Text style={styles.spacePrice}>
                Precio sugerido: ${parkingSpace.pricePerHour}/hora
              </Text>
            </Card.Content>
          </Card>

          {/* Date and Time Selection */}
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Fecha y Hora</Text>
              
              <View style={styles.dateTimeContainer}>
                <View style={styles.dateTimeItem}>
                  <Text style={styles.dateTimeLabel}>Inicio</Text>
                  <Surface style={styles.dateTimeButton} elevation={1}>
                    <Button
                      mode="text"
                      onPress={() => setShowStartPicker(true)}
                      icon="schedule"
                      contentStyle={styles.dateTimeButtonContent}
                    >
                      {formatDateTime(startDateTime)}
                    </Button>
                  </Surface>
                </View>

                <View style={styles.dateTimeItem}>
                  <Text style={styles.dateTimeLabel}>Fin</Text>
                  <Surface style={styles.dateTimeButton} elevation={1}>
                    <Button
                      mode="text"
                      onPress={() => setShowEndPicker(true)}
                      icon="schedule"
                      contentStyle={styles.dateTimeButtonContent}
                    >
                      {formatDateTime(endDateTime)}
                    </Button>
                  </Surface>
                </View>
              </View>

              <HelperText type="error" visible={!!errors.dateTime}>
                {errors.dateTime}
              </HelperText>

              <Surface style={styles.durationInfo} elevation={1}>
                <Icon name="schedule" size={20} color={colors.primary} />
                <Text style={styles.durationText}>
                  Duración: {calculateTotalHours()} hora{calculateTotalHours() !== 1 ? 's' : ''}
                </Text>
              </Surface>
            </Card.Content>
          </Card>

          {/* Vehicle Information */}
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Información del Vehículo</Text>
              
              <TextInput
                label="Placa del vehículo"
                value={vehicleInfo.licensePlate}
                onChangeText={(text) => setVehicleInfo(prev => ({ ...prev, licensePlate: text.toUpperCase() }))}
                mode="outlined"
                style={styles.input}
                error={!!errors.licensePlate}
                autoCapitalize="characters"
              />
              <HelperText type="error" visible={!!errors.licensePlate}>
                {errors.licensePlate}
              </HelperText>

              <View style={styles.vehicleRow}>
                <TextInput
                  label="Color"
                  value={vehicleInfo.color}
                  onChangeText={(text) => setVehicleInfo(prev => ({ ...prev, color: text }))}
                  mode="outlined"
                  style={[styles.input, styles.halfInput]}
                  error={!!errors.color}
                />
                <TextInput
                  label="Marca (opcional)"
                  value={vehicleInfo.make}
                  onChangeText={(text) => setVehicleInfo(prev => ({ ...prev, make: text }))}
                  mode="outlined"
                  style={[styles.input, styles.halfInput]}
                />
              </View>
              <HelperText type="error" visible={!!errors.color}>
                {errors.color}
              </HelperText>

              <TextInput
                label="Modelo (opcional)"
                value={vehicleInfo.model}
                onChangeText={(text) => setVehicleInfo(prev => ({ ...prev, model: text }))}
                mode="outlined"
                style={styles.input}
              />
            </Card.Content>
          </Card>

          {/* Price Negotiation */}
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Precio Propuesto</Text>
              
              <TextInput
                label="Precio por hora ($)"
                value={proposedPrice}
                onChangeText={setProposedPrice}
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
                error={!!errors.proposedPrice}
              />
              <HelperText type="error" visible={!!errors.proposedPrice}>
                {errors.proposedPrice}
              </HelperText>

              <Divider style={styles.divider} />

              <View style={styles.priceBreakdown}>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Duración:</Text>
                  <Text style={styles.priceValue}>{calculateTotalHours()} hora{calculateTotalHours() !== 1 ? 's' : ''}</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Precio por hora:</Text>
                  <Text style={styles.priceValue}>${proposedPrice || '0'}</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.totalLabel}>Total:</Text>
                  <Text style={styles.totalValue}>${calculateTotalPrice()}</Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Message */}
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Mensaje (Opcional)</Text>
              
              <TextInput
                label="Mensaje para el arrendador"
                value={message}
                onChangeText={setMessage}
                mode="outlined"
                multiline
                numberOfLines={3}
                style={styles.input}
                placeholder="Ej: Hola, necesito estacionar por trabajo. Soy muy cuidadoso con mi vehículo."
              />
            </Card.Content>
          </Card>

          {/* Submit Button */}
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
              onPress={handleSubmit}
              style={styles.submitButton}
              icon="send"
            >
              Enviar Solicitud
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Date Pickers */}
      <DatePicker
        modal
        open={showStartPicker}
        date={startDateTime}
        onConfirm={(date) => {
          setStartDateTime(date);
          setShowStartPicker(false);
          // Auto-adjust end time to be at least 1 hour later
          if (date >= endDateTime) {
            setEndDateTime(new Date(date.getTime() + 60 * 60 * 1000));
          }
        }}
        onCancel={() => setShowStartPicker(false)}
        minimumDate={new Date()}
        title="Fecha y hora de inicio"
      />

      <DatePicker
        modal
        open={showEndPicker}
        date={endDateTime}
        onConfirm={(date) => {
          setEndDateTime(date);
          setShowEndPicker(false);
        }}
        onCancel={() => setShowEndPicker(false)}
        minimumDate={new Date(startDateTime.getTime() + 60 * 60 * 1000)}
        title="Fecha y hora de fin"
      />
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
    marginBottom: 12,
  },
  spaceName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  spaceAddress: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  spacePrice: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  dateTimeContainer: {
    marginBottom: 12,
  },
  dateTimeItem: {
    marginBottom: 12,
  },
  dateTimeLabel: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
    fontWeight: '500',
  },
  dateTimeButton: {
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  dateTimeButtonContent: {
    justifyContent: 'flex-start',
    paddingVertical: 8,
  },
  durationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.background,
    marginTop: 8,
  },
  durationText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
    fontWeight: '500',
  },
  input: {
    marginBottom: 8,
  },
  vehicleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  divider: {
    marginVertical: 16,
  },
  priceBreakdown: {
    marginTop: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  priceValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  totalLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: 'bold',
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
  submitButton: {
    flex: 1,
    marginLeft: 8,
  },
});

export default BookingRequestScreen;