import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Card,
  Avatar,
  Chip,
  Button,
  SegmentedButtons,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootState } from '../../store/store';
import { BookingRequest, Booking } from '../../types';
import { colors } from '../../theme/theme';
import { 
  fetchMyRequestsSuccess,
  fetchReceivedRequestsSuccess,
  fetchMyBookingsSuccess,
  updateBookingRequestStatus 
} from '../../store/slices/bookingSlice';

const BookingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { myRequests, receivedRequests, myBookings } = useSelector((state: RootState) => state.booking);
  const isProvider = user?.userType === 'provider';

  const [activeTab, setActiveTab] = useState(isProvider ? 'received' : 'requests');

  // Mock data
  const mockRequests: BookingRequest[] = [
    {
      id: '1',
      seekerId: 'seeker1',
      seekerName: 'Ana Martínez',
      seekerPhone: '+1234567890',
      parkingSpaceId: 'space1',
      parkingSpaceTitle: 'Estacionamiento Centro',
      parkingSpaceAddress: 'Av. Principal 123',
      startDateTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      endDateTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
      totalHours: 2,
      proposedPrice: 10,
      message: 'Necesito estacionar por 2 horas',
      status: 'pending',
      createdAt: new Date(),
      vehicleInfo: {
        type: 'car',
        licensePlate: 'ABC-123',
        color: 'Azul',
        make: 'Toyota',
        model: 'Corolla',
      },
    },
  ];

  const mockBookings: Booking[] = [
    {
      id: '1',
      requestId: 'req1',
      seekerId: 'seeker1',
      providerId: 'provider1',
      parkingSpaceId: 'space1',
      startDateTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      endDateTime: new Date(Date.now() + 1 * 60 * 60 * 1000),
      totalHours: 3,
      agreedPrice: 15,
      status: 'active',
      paymentStatus: 'paid',
      createdAt: new Date(),
    },
  ];

  useEffect(() => {
    // Load mock data
    dispatch(fetchMyRequestsSuccess(mockRequests));
    dispatch(fetchReceivedRequestsSuccess(mockRequests));
    dispatch(fetchMyBookingsSuccess(mockBookings));
  }, []);

  const handleRequestAction = (requestId: string, action: 'accept' | 'reject') => {
    dispatch(updateBookingRequestStatus({ 
      requestId, 
      status: action === 'accept' ? 'accepted' : 'rejected' 
    }));
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return colors.warning;
      case 'accepted':
      case 'active':
        return colors.success;
      case 'rejected':
      case 'cancelled':
        return colors.error;
      case 'completed':
        return colors.info;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'accepted':
        return 'Aceptada';
      case 'rejected':
        return 'Rechazada';
      case 'active':
        return 'Activa';
      case 'completed':
        return 'Completada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const renderBookingRequest = ({ item }: { item: BookingRequest }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>
              {isProvider ? item.seekerName : item.parkingSpaceTitle}
            </Text>
            <Text style={styles.cardSubtitle}>
              {isProvider ? item.parkingSpaceTitle : item.parkingSpaceAddress}
            </Text>
            <View style={styles.timeContainer}>
              <Icon name="schedule" size={16} color={colors.textSecondary} />
              <Text style={styles.timeText}>
                {formatDateTime(item.startDateTime)} - {formatDateTime(item.endDateTime)}
              </Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.priceText}>${item.proposedPrice}</Text>
              <Text style={styles.hoursText}>({item.totalHours}h)</Text>
            </View>
          </View>
          <Chip 
            style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) }]}
            textStyle={styles.statusText}
          >
            {getStatusText(item.status)}
          </Chip>
        </View>

        {item.message && (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>"{item.message}"</Text>
          </View>
        )}

        <View style={styles.vehicleInfo}>
          <Icon name="directions-car" size={16} color={colors.textSecondary} />
          <Text style={styles.vehicleText}>
            {item.vehicleInfo.make} {item.vehicleInfo.model} - {item.vehicleInfo.licensePlate}
          </Text>
        </View>

        {isProvider && item.status === 'pending' && (
          <View style={styles.actionButtons}>
            <Button
              mode="outlined"
              onPress={() => handleRequestAction(item.id, 'reject')}
              style={styles.rejectButton}
              labelStyle={{ color: colors.error }}
            >
              Rechazar
            </Button>
            <Button
              mode="contained"
              onPress={() => handleRequestAction(item.id, 'accept')}
              style={styles.acceptButton}
            >
              Aceptar
            </Button>
          </View>
        )}

        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => navigation.navigate('RequestDetails', { request: item })}
        >
          <Text style={styles.detailsButtonText}>Ver detalles</Text>
          <Icon name="chevron-right" size={20} color={colors.primary} />
        </TouchableOpacity>
      </Card.Content>
    </Card>
  );

  const renderBooking = ({ item }: { item: Booking }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>Reserva Activa</Text>
            <View style={styles.timeContainer}>
              <Icon name="schedule" size={16} color={colors.textSecondary} />
              <Text style={styles.timeText}>
                {formatDateTime(item.startDateTime)} - {formatDateTime(item.endDateTime)}
              </Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.priceText}>${item.agreedPrice}</Text>
              <Text style={styles.hoursText}>({item.totalHours}h)</Text>
            </View>
          </View>
          <Chip 
            style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) }]}
            textStyle={styles.statusText}
          >
            {getStatusText(item.status)}
          </Chip>
        </View>

        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => navigation.navigate('BookingDetails', { booking: item })}
        >
          <Text style={styles.detailsButtonText}>Ver detalles</Text>
          <Icon name="chevron-right" size={20} color={colors.primary} />
        </TouchableOpacity>
      </Card.Content>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="inbox" size={64} color={colors.textSecondary} />
      <Text style={styles.emptyTitle}>
        {activeTab === 'requests' && 'No tienes solicitudes'}
        {activeTab === 'received' && 'No has recibido solicitudes'}
        {activeTab === 'bookings' && 'No tienes reservas activas'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {activeTab === 'requests' && 'Busca estacionamientos para crear solicitudes'}
        {activeTab === 'received' && 'Las solicitudes aparecerán aquí cuando las recibas'}
        {activeTab === 'bookings' && 'Tus reservas activas aparecerán aquí'}
      </Text>
    </View>
  );

  const getTabData = () => {
    switch (activeTab) {
      case 'requests':
        return myRequests;
      case 'received':
        return receivedRequests;
      case 'bookings':
        return myBookings;
      default:
        return [];
    }
  };

  const getRenderItem = () => {
    if (activeTab === 'bookings') {
      return renderBooking;
    }
    return renderBookingRequest;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {isProvider ? 'Solicitudes y Reservas' : 'Mis Reservas'}
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <SegmentedButtons
          value={activeTab}
          onValueChange={setActiveTab}
          buttons={isProvider ? [
            {
              value: 'received',
              label: 'Recibidas',
              icon: 'inbox',
            },
            {
              value: 'bookings',
              label: 'Activas',
              icon: 'event-note',
            },
          ] : [
            {
              value: 'requests',
              label: 'Solicitudes',
              icon: 'send',
            },
            {
              value: 'bookings',
              label: 'Activas',
              icon: 'event-note',
            },
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <FlatList
          data={getTabData()}
          renderItem={getRenderItem()}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  tabsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
  },
  segmentedButtons: {
    // Additional styles if needed
  },
  content: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  card: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  hoursText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    color: colors.surface,
    fontWeight: '500',
  },
  messageContainer: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  messageText: {
    fontSize: 14,
    color: colors.text,
    fontStyle: 'italic',
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  vehicleText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  rejectButton: {
    flex: 1,
    marginRight: 8,
    borderColor: colors.error,
  },
  acceptButton: {
    flex: 1,
    marginLeft: 8,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  detailsButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default BookingsScreen;