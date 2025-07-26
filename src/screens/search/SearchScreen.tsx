import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  SearchBar,
  Surface,
  Button,
  Card,
  Avatar,
  Chip,
  Modal,
  Portal,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DatePicker from 'react-native-date-picker';
import { RootState } from '../../store/store';
import { ParkingSpace, SearchFilters } from '../../types';
import { colors } from '../../theme/theme';
import { searchSpacesSuccess, setSearchFilters } from '../../store/slices/parkingSlice';

const SearchScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { searchResults, searchFilters } = useSelector((state: RootState) => state.parking);

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState<'start' | 'end' | null>(null);
  const [tempFilters, setTempFilters] = useState<SearchFilters>({
    maxDistance: 5,
    maxPricePerHour: 10,
    startDateTime: new Date(),
    endDateTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    vehicleType: 'car',
    amenities: [],
    isSecure: false,
    isCovered: false,
    hasElectricCharging: false,
  });

  // Mock search results
  const mockSearchResults: ParkingSpace[] = [
    {
      id: '1',
      providerId: 'provider1',
      providerName: 'María González',
      providerPhone: '+1234567890',
      providerRating: 4.8,
      title: 'Estacionamiento Seguro Centro',
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
      providerId: 'provider2',
      providerName: 'Carlos Rodríguez',
      providerPhone: '+1234567891',
      providerRating: 4.6,
      title: 'Parking Económico',
      description: 'Espacio al aire libre, precio conveniente',
      address: 'Calle Secundaria 456',
      coordinates: { latitude: 40.7118, longitude: -74.0070 },
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

  const handleSearch = () => {
    // Simulate search with filters
    dispatch(searchSpacesSuccess(mockSearchResults));
    dispatch(setSearchFilters(tempFilters));
  };

  const clearFilters = () => {
    setTempFilters({
      maxDistance: 5,
      maxPricePerHour: 10,
      startDateTime: new Date(),
      endDateTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      vehicleType: 'car',
      amenities: [],
      isSecure: false,
      isCovered: false,
      hasElectricCharging: false,
    });
  };

  const toggleAmenity = (amenity: string) => {
    setTempFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
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

  const renderParkingSpaceCard = ({ item }: { item: ParkingSpace }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ParkingDetails', { parkingSpace: item })}
    >
      <Card style={styles.spaceCard}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardAddress}>{item.address}</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.priceText}>${item.pricePerHour}/hora</Text>
                <Text style={styles.distanceText}>• 0.5 km</Text>
              </View>
            </View>
            <View style={styles.availabilityContainer}>
              <Surface style={[styles.statusIndicator, { backgroundColor: item.isAvailable ? colors.success : colors.error }]} />
              <Text style={styles.statusText}>
                {item.isAvailable ? 'Disponible' : 'Ocupado'}
              </Text>
            </View>
          </View>

          <View style={styles.providerInfo}>
            <Avatar.Text size={32} label={item.providerName.charAt(0)} />
            <View style={styles.providerDetails}>
              <Text style={styles.providerName}>{item.providerName}</Text>
              <View style={styles.ratingContainer}>
                <Icon name="star" size={16} color={colors.secondary} />
                <Text style={styles.ratingText}>{item.providerRating}</Text>
              </View>
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
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const renderFiltersModal = () => (
    <Portal>
      <Modal
        visible={showFilters}
        onDismiss={() => setShowFilters(false)}
        contentContainerStyle={styles.modalContainer}
      >
        <ScrollView>
          <Text style={styles.modalTitle}>Filtros de Búsqueda</Text>

          {/* Date and Time */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Fecha y Hora</Text>
            
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowDatePicker('start')}
            >
              <Icon name="schedule" size={20} color={colors.primary} />
              <Text style={styles.dateTimeText}>
                Desde: {formatDateTime(tempFilters.startDateTime)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowDatePicker('end')}
            >
              <Icon name="schedule" size={20} color={colors.primary} />
              <Text style={styles.dateTimeText}>
                Hasta: {formatDateTime(tempFilters.endDateTime)}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Vehicle Type */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Tipo de Vehículo</Text>
            <View style={styles.chipContainer}>
              {['car', 'motorcycle', 'truck', 'van', 'rv'].map((type) => (
                <Chip
                  key={type}
                  selected={tempFilters.vehicleType === type}
                  onPress={() => setTempFilters(prev => ({ ...prev, vehicleType: type as any }))}
                  style={styles.filterChip}
                >
                  {type === 'car' ? 'Auto' : 
                   type === 'motorcycle' ? 'Moto' :
                   type === 'truck' ? 'Camión' :
                   type === 'van' ? 'Van' : 'Autocaravana'}
                </Chip>
              ))}
            </View>
          </View>

          {/* Amenities */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Características</Text>
            <View style={styles.chipContainer}>
              {['Techado', 'Seguridad 24/7', 'Carga eléctrica', 'Acceso fácil', 'Vigilancia'].map((amenity) => (
                <Chip
                  key={amenity}
                  selected={tempFilters.amenities.includes(amenity)}
                  onPress={() => toggleAmenity(amenity)}
                  style={styles.filterChip}
                >
                  {amenity}
                </Chip>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={clearFilters}
              style={styles.clearButton}
            >
              Limpiar
            </Button>
            <Button
              mode="contained"
              onPress={() => {
                handleSearch();
                setShowFilters(false);
              }}
              style={styles.applyButton}
            >
              Aplicar Filtros
            </Button>
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <SearchBar
          placeholder="Buscar por dirección..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Icon name="filter-list" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Active Filters */}
      {searchFilters && (
        <View style={styles.activeFilters}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Chip style={styles.activeFilterChip}>
              📍 {searchFilters.maxDistance}km
            </Chip>
            <Chip style={styles.activeFilterChip}>
              💰 Hasta ${searchFilters.maxPricePerHour}/h
            </Chip>
            {searchFilters.amenities.map((amenity, index) => (
              <Chip key={index} style={styles.activeFilterChip}>
                {amenity}
              </Chip>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Results */}
      <View style={styles.content}>
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {searchResults.length} estacionamientos encontrados
          </Text>
          <TouchableOpacity style={styles.mapViewButton}>
            <Icon name="map" size={20} color={colors.primary} />
            <Text style={styles.mapViewText}>Ver en mapa</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={searchResults}
          renderItem={renderParkingSpaceCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Date Picker */}
      <DatePicker
        modal
        open={showDatePicker !== null}
        date={showDatePicker === 'start' ? tempFilters.startDateTime : tempFilters.endDateTime}
        onConfirm={(date) => {
          if (showDatePicker === 'start') {
            setTempFilters(prev => ({ ...prev, startDateTime: date }));
          } else {
            setTempFilters(prev => ({ ...prev, endDateTime: date }));
          }
          setShowDatePicker(null);
        }}
        onCancel={() => setShowDatePicker(null)}
        minimumDate={new Date()}
        title={showDatePicker === 'start' ? 'Fecha de inicio' : 'Fecha de fin'}
      />

      {/* Filters Modal */}
      {renderFiltersModal()}
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    elevation: 2,
  },
  searchBar: {
    flex: 1,
    marginRight: 12,
  },
  filterButton: {
    padding: 8,
  },
  activeFilters: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.surface,
  },
  activeFilterChip: {
    marginRight: 8,
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  mapViewButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapViewText: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 4,
  },
  listContainer: {
    paddingHorizontal: 16,
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
  distanceText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  availabilityContainer: {
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 10,
    color: colors.textSecondary,
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
    alignItems: 'center',
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
  modalContainer: {
    backgroundColor: colors.surface,
    margin: 20,
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  filterSection: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 12,
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    marginBottom: 8,
  },
  dateTimeText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  clearButton: {
    flex: 1,
    marginRight: 8,
  },
  applyButton: {
    flex: 1,
    marginLeft: 8,
  },
});

export default SearchScreen;