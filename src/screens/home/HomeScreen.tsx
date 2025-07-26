import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {
  Text,
  Surface,
  FAB,
  SearchBar,
  Card,
  Avatar,
  Chip,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootState } from '../../store/store';
import { ParkingSpace } from '../../types';
import { colors } from '../../theme/theme';
import { fetchNearbySpacesSuccess } from '../../store/slices/parkingSlice';

const { width, height } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { nearbySpaces } = useSelector((state: RootState) => state.parking);
  const isProvider = user?.userType === 'provider';

  const [location, setLocation] = useState({
    latitude: 40.7128,
    longitude: -74.0060,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpace, setSelectedSpace] = useState<ParkingSpace | null>(null);

  // Mock data for nearby parking spaces
  const mockParkingSpaces: ParkingSpace[] = [
    {
      id: '1',
      providerId: 'provider1',
      providerName: 'María González',
      providerPhone: '+1234567890',
      providerRating: 4.8,
      title: 'Estacionamiento Seguro Centro',
      description: 'Espacio techado en el centro de la ciudad',
      address: 'Av. Principal 123, Centro',
      coordinates: {
        latitude: 40.7138,
        longitude: -74.0050,
      },
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
      providerId: 'provider2',
      providerName: 'Carlos Rodríguez',
      providerPhone: '+1234567891',
      providerRating: 4.6,
      title: 'Parking Económico',
      description: 'Espacio al aire libre, precio conveniente',
      address: 'Calle Secundaria 456',
      coordinates: {
        latitude: 40.7118,
        longitude: -74.0070,
      },
      pricePerHour: 3,
      images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
      amenities: ['Precio bajo', 'Disponible 24/7'],
      maxVehicleSize: 'large',
      isAvailable: true,
      availableFrom: new Date(),
      availableTo: new Date(Date.now() + 48 * 60 * 60 * 1000),
      createdAt: new Date(),
      totalSpaces: 1,
      occupiedSpaces: 0,
      isSecure: false,
      isCovered: false,
      hasElectricCharging: false,
    },
  ];

  useEffect(() => {
    requestLocationPermission();
    // Load mock data
    dispatch(fetchNearbySpacesSuccess(mockParkingSpaces));
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getCurrentLocation();
      }
    } else {
      getCurrentLocation();
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      },
      (error) => {
        console.log('Location error:', error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  const renderMarker = (space: ParkingSpace) => (
    <Marker
      key={space.id}
      coordinate={space.coordinates}
      onPress={() => setSelectedSpace(space)}
    >
      <View style={styles.markerContainer}>
        <Surface style={[styles.marker, { backgroundColor: space.isAvailable ? colors.success : colors.error }]} elevation={3}>
          <Icon name="local-parking" size={20} color={colors.surface} />
          <Text style={styles.markerPrice}>${space.pricePerHour}/h</Text>
        </Surface>
      </View>
    </Marker>
  );

  const renderSelectedSpaceCard = () => {
    if (!selectedSpace) return null;

    return (
      <Surface style={styles.spaceCard} elevation={4}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{selectedSpace.title}</Text>
              <Text style={styles.cardAddress}>{selectedSpace.address}</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.priceText}>${selectedSpace.pricePerHour}/hora</Text>
                {selectedSpace.pricePerDay && (
                  <Text style={styles.dayPriceText}>${selectedSpace.pricePerDay}/día</Text>
                )}
              </View>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedSpace(null)}
            >
              <Icon name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.providerInfo}>
            <Avatar.Text size={32} label={selectedSpace.providerName.charAt(0)} />
            <View style={styles.providerDetails}>
              <Text style={styles.providerName}>{selectedSpace.providerName}</Text>
              <View style={styles.ratingContainer}>
                <Icon name="star" size={16} color={colors.secondary} />
                <Text style={styles.ratingText}>{selectedSpace.providerRating}</Text>
              </View>
            </View>
          </View>

          <View style={styles.amenitiesContainer}>
            {selectedSpace.amenities.slice(0, 3).map((amenity, index) => (
              <Chip key={index} style={styles.amenityChip} textStyle={styles.amenityText}>
                {amenity}
              </Chip>
            ))}
          </View>

          <View style={styles.cardActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.detailsButton]}
              onPress={() => navigation.navigate('ParkingDetails', { parkingSpace: selectedSpace })}
            >
              <Text style={styles.detailsButtonText}>Ver Detalles</Text>
            </TouchableOpacity>
            
            {!isProvider && (
              <TouchableOpacity
                style={[styles.actionButton, styles.reserveButton]}
                onPress={() => navigation.navigate('BookingRequest', { parkingSpace: selectedSpace })}
              >
                <Text style={styles.reserveButtonText}>Reservar</Text>
              </TouchableOpacity>
            )}
          </View>
        </Card.Content>
      </Surface>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>
            Hola, {user?.name?.split(' ')[0] || 'Usuario'}
          </Text>
          <Text style={styles.subtitleText}>
            {isProvider ? 'Gestiona tus espacios' : 'Encuentra tu estacionamiento'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Icon name="notifications" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      {!isProvider && (
        <View style={styles.searchContainer}>
          <SearchBar
            placeholder="Buscar por dirección..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            icon="search"
            onPress={() => navigation.navigate('Search')}
          />
        </View>
      )}

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={location}
          showsUserLocation
          showsMyLocationButton
          onRegionChangeComplete={setLocation}
        >
          {nearbySpaces.map(renderMarker)}
        </MapView>

        {/* Selected Space Card */}
        {renderSelectedSpaceCard()}

        {/* Floating Action Button */}
        <FAB
          style={[
            styles.fab,
            { backgroundColor: isProvider ? colors.secondary : colors.primary }
          ]}
          icon={isProvider ? "add" : "search"}
          onPress={() => {
            if (isProvider) {
              navigation.navigate('AddParkingSpace');
            } else {
              navigation.navigate('Search');
            }
          }}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    elevation: 2,
  },
  welcomeContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitleText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  notificationButton: {
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.surface,
  },
  searchBar: {
    elevation: 2,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: width,
    height: '100%',
  },
  markerContainer: {
    alignItems: 'center',
  },
  marker: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  markerPrice: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.surface,
    marginLeft: 4,
  },
  spaceCard: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
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
    marginRight: 8,
  },
  dayPriceText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  closeButton: {
    padding: 4,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  providerDetails: {
    marginLeft: 12,
    flex: 1,
  },
  providerName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  ratingText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  detailsButton: {
    backgroundColor: colors.background,
    marginRight: 8,
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  reserveButton: {
    backgroundColor: colors.primary,
    marginLeft: 8,
  },
  reserveButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.surface,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 16,
  },
});

export default HomeScreen;