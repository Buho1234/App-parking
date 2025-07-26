import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Text,
  FAB,
  Card,
  Chip,
  Button,
  Surface,
  Menu,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootState } from '../../store/store';
import { ParkingSpace } from '../../types';
import { colors } from '../../theme/theme';
import { fetchMySpacesSuccess, deleteParkingSpace } from '../../store/slices/parkingSlice';

const MyParkingSpacesScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { mySpaces } = useSelector((state: RootState) => state.parking);

  const [menuVisible, setMenuVisible] = useState<string | null>(null);

  // Mock data for user's parking spaces
  const mockMySpaces: ParkingSpace[] = [
    {
      id: '1',
      providerId: 'provider1',
      providerName: 'Usuario Actual',
      providerPhone: '+1234567890',
      providerRating: 4.8,
      title: 'Mi Estacionamiento Centro',
      description: 'Espacio techado en el centro de la ciudad',
      address: 'Av. Principal 123, Centro',
      coordinates: { latitude: 40.7138, longitude: -74.0050 },
      pricePerHour: 5,
      pricePerDay: 40,
      images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
      amenities: ['Techado', 'Seguridad 24/7', 'Acceso fácil'],
      maxVehicleSize: 'medium',
      isAvailable: true,
      availableFrom: new Date(),
      availableTo: new Date(Date.now() + 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      totalSpaces: 3,
      occupiedSpaces: 1,
      isSecure: true,
      isCovered: true,
      hasElectricCharging: false,
      accessInstructions: 'Llamar al llegar',
    },
    {
      id: '2',
      providerId: 'provider1',
      providerName: 'Usuario Actual',
      providerPhone: '+1234567890',
      providerRating: 4.8,
      title: 'Estacionamiento Casa',
      description: 'Espacio disponible en mi casa',
      address: 'Calle Residencial 456',
      coordinates: { latitude: 40.7118, longitude: -74.0070 },
      pricePerHour: 3,
      images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
      amenities: ['Precio bajo', 'Disponible 24/7'],
      maxVehicleSize: 'large',
      isAvailable: false,
      availableFrom: new Date(),
      availableTo: new Date(Date.now() + 48 * 60 * 60 * 1000),
      createdAt: new Date(),
      totalSpaces: 1,
      occupiedSpaces: 1,
      isSecure: false,
      isCovered: false,
      hasElectricCharging: false,
    },
  ];

  useEffect(() => {
    // Load user's parking spaces
    dispatch(fetchMySpacesSuccess(mockMySpaces));
  }, []);

  const handleDeleteSpace = (spaceId: string) => {
    Alert.alert(
      'Eliminar Estacionamiento',
      '¿Estás seguro de que quieres eliminar este estacionamiento? Esta acción no se puede deshacer.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteParkingSpace(spaceId));
            setMenuVisible(null);
          },
        },
      ]
    );
  };

  const toggleAvailability = (space: ParkingSpace) => {
    // TODO: Implement toggle availability
    console.log('Toggle availability for space:', space.id);
    setMenuVisible(null);
  };

  const renderParkingSpaceCard = ({ item }: { item: ParkingSpace }) => (
    <Card style={styles.spaceCard}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardAddress}>{item.address}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.priceText}>${item.pricePerHour}/hora</Text>
              {item.pricePerDay && (
                <Text style={styles.dayPriceText}>• ${item.pricePerDay}/día</Text>
              )}
            </View>
          </View>
          
          <View style={styles.cardActions}>
            <Surface style={[
              styles.statusIndicator,
              { backgroundColor: item.isAvailable ? colors.success : colors.error }
            ]} />
            <Menu
              visible={menuVisible === item.id}
              onDismiss={() => setMenuVisible(null)}
              anchor={
                <TouchableOpacity
                  style={styles.menuButton}
                  onPress={() => setMenuVisible(item.id)}
                >
                  <Icon name="more-vert" size={24} color={colors.textSecondary} />
                </TouchableOpacity>
              }
            >
              <Menu.Item
                onPress={() => {
                  navigation.navigate('EditParkingSpace', { parkingSpace: item });
                  setMenuVisible(null);
                }}
                title="Editar"
                leadingIcon="edit"
              />
              <Menu.Item
                onPress={() => toggleAvailability(item)}
                title={item.isAvailable ? 'Desactivar' : 'Activar'}
                leadingIcon={item.isAvailable ? 'visibility-off' : 'visibility'}
              />
              <Menu.Item
                onPress={() => handleDeleteSpace(item.id)}
                title="Eliminar"
                leadingIcon="delete"
                titleStyle={{ color: colors.error }}
              />
            </Menu>
          </View>
        </View>

        <View style={styles.spaceStats}>
          <View style={styles.statItem}>
            <Icon name="local-parking" size={16} color={colors.textSecondary} />
            <Text style={styles.statText}>
              {item.totalSpaces - item.occupiedSpaces}/{item.totalSpaces} disponibles
            </Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="schedule" size={16} color={colors.textSecondary} />
            <Text style={styles.statText}>
              {item.isAvailable ? 'Activo' : 'Inactivo'}
            </Text>
          </View>
        </View>

        <View style={styles.amenitiesContainer}>
          {item.amenities.slice(0, 3).map((amenity, index) => (
            <Chip key={index} style={styles.amenityChip} textStyle={styles.amenityText}>
              {amenity}
            </Chip>
          ))}
          {item.amenities.length > 3 && (
            <Text style={styles.moreAmenities}>+{item.amenities.length - 3} más</Text>
          )}
        </View>

        <View style={styles.cardFooter}>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('ParkingDetails', { parkingSpace: item })}
            style={styles.detailsButton}
          >
            Ver Detalles
          </Button>
          
          <Button
            mode="contained"
            onPress={() => navigation.navigate('EditParkingSpace', { parkingSpace: item })}
            style={styles.editButton}
          >
            Editar
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="local-parking" size={64} color={colors.textSecondary} />
      <Text style={styles.emptyTitle}>No tienes estacionamientos</Text>
      <Text style={styles.emptySubtitle}>
        Agrega tu primer espacio de estacionamiento para comenzar a generar ingresos
      </Text>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('AddParkingSpace')}
        style={styles.addFirstButton}
        icon="add"
      >
        Agregar Estacionamiento
      </Button>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Estacionamientos</Text>
        <Text style={styles.headerSubtitle}>
          {mySpaces.length} espacio{mySpaces.length !== 1 ? 's' : ''} registrado{mySpaces.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Stats Overview */}
      {mySpaces.length > 0 && (
        <View style={styles.statsContainer}>
          <Card style={styles.statsCard}>
            <Card.Content style={styles.statsContent}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {mySpaces.filter(space => space.isAvailable).length}
                </Text>
                <Text style={styles.statLabel}>Activos</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {mySpaces.reduce((total, space) => total + space.occupiedSpaces, 0)}
                </Text>
                <Text style={styles.statLabel}>Ocupados</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  ${mySpaces.reduce((total, space) => total + space.pricePerHour, 0)}
                </Text>
                <Text style={styles.statLabel}>Ingresos/h</Text>
              </View>
            </Card.Content>
          </Card>
        </View>
      )}

      {/* Parking Spaces List */}
      <View style={styles.content}>
        <FlatList
          data={mySpaces}
          renderItem={renderParkingSpaceCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
        />
      </View>

      {/* Add New Space FAB */}
      {mySpaces.length > 0 && (
        <FAB
          style={styles.fab}
          icon="add"
          onPress={() => navigation.navigate('AddParkingSpace')}
        />
      )}
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
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  statsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  statsCard: {
    // Additional styles if needed
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  spaceCard: {
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
  cardAddress: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  dayPriceText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  cardActions: {
    alignItems: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  menuButton: {
    padding: 4,
  },
  spaceStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 16,
  },
  amenityChip: {
    marginRight: 8,
    marginBottom: 4,
    backgroundColor: colors.background,
  },
  amenityText: {
    fontSize: 10,
  },
  moreAmenities: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailsButton: {
    flex: 1,
    marginRight: 8,
  },
  editButton: {
    flex: 1,
    marginLeft: 8,
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
    marginBottom: 24,
  },
  addFirstButton: {
    paddingHorizontal: 24,
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
});

export default MyParkingSpacesScreen;