import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {
  Text,
  Button,
  Card,
  Avatar,
  Chip,
  Surface,
  Divider,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootState } from '../../store/store';
import { RootStackParamList } from '../../types';
import { colors } from '../../theme/theme';

type ParkingDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ParkingDetails'>;
type ParkingDetailsScreenRouteProp = RouteProp<RootStackParamList, 'ParkingDetails'>;

const ParkingDetailsScreen: React.FC = () => {
  const navigation = useNavigation<ParkingDetailsScreenNavigationProp>();
  const route = useRoute<ParkingDetailsScreenRouteProp>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { parkingSpace } = route.params;
  const isProvider = user?.userType === 'provider';
  const isOwnSpace = user?.id === parkingSpace.providerId;

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCall = () => {
    Linking.openURL(`tel:${parkingSpace.providerPhone}`);
  };

  const handleMessage = () => {
    navigation.navigate('ChatScreen', {
      otherUserId: parkingSpace.providerId,
      otherUserName: parkingSpace.providerName,
    });
  };

  const handleDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${parkingSpace.coordinates.latitude},${parkingSpace.coordinates.longitude}`;
    Linking.openURL(url);
  };

  const getVehicleCapacityText = (size: string) => {
    switch (size) {
      case 'small':
        return 'Autos pequeños';
      case 'medium':
        return 'Autos medianos';
      case 'large':
        return 'Autos grandes/SUVs';
      case 'extra-large':
        return 'Camionetas/Vans';
      default:
        return size;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: parkingSpace.images[0] }} 
            style={styles.image}
            resizeMode="cover"
          />
          <Surface style={styles.statusBadge} elevation={3}>
            <Text style={[styles.statusText, { 
              color: parkingSpace.isAvailable ? colors.success : colors.error 
            }]}>
              {parkingSpace.isAvailable ? 'Disponible' : 'No disponible'}
            </Text>
          </Surface>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title and Price */}
          <View style={styles.header}>
            <View style={styles.titleSection}>
              <Text style={styles.title}>{parkingSpace.title}</Text>
              <Text style={styles.address}>{parkingSpace.address}</Text>
            </View>
            <View style={styles.priceSection}>
              <Text style={styles.price}>${parkingSpace.pricePerHour}</Text>
              <Text style={styles.priceUnit}>por hora</Text>
              {parkingSpace.pricePerDay && (
                <Text style={styles.dayPrice}>${parkingSpace.pricePerDay}/día</Text>
              )}
            </View>
          </View>

          {/* Provider Info */}
          <Card style={styles.providerCard}>
            <Card.Content>
              <View style={styles.providerInfo}>
                <Avatar.Text 
                  size={50} 
                  label={parkingSpace.providerName.charAt(0)} 
                  style={styles.providerAvatar}
                />
                <View style={styles.providerDetails}>
                  <Text style={styles.providerName}>{parkingSpace.providerName}</Text>
                  <View style={styles.ratingContainer}>
                    <Icon name="star" size={16} color={colors.secondary} />
                    <Text style={styles.ratingText}>
                      {parkingSpace.providerRating} ({parkingSpace.providerRating >= 4.5 ? 'Excelente' : 'Bueno'})
                    </Text>
                  </View>
                  <Text style={styles.memberSince}>
                    Miembro desde {new Date().getFullYear() - 1}
                  </Text>
                </View>
                <View style={styles.contactButtons}>
                  <TouchableOpacity style={styles.contactButton} onPress={handleCall}>
                    <Icon name="phone" size={20} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.contactButton} onPress={handleMessage}>
                    <Icon name="message" size={20} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Description */}
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Descripción</Text>
              <Text style={styles.description}>{parkingSpace.description}</Text>
            </Card.Content>
          </Card>

          {/* Space Details */}
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Detalles del Espacio</Text>
              
              <View style={styles.detailRow}>
                <Icon name="local-parking" size={20} color={colors.textSecondary} />
                <Text style={styles.detailText}>
                  {parkingSpace.totalSpaces - parkingSpace.occupiedSpaces} de {parkingSpace.totalSpaces} espacios disponibles
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Icon name="directions-car" size={20} color={colors.textSecondary} />
                <Text style={styles.detailText}>
                  Capacidad: {getVehicleCapacityText(parkingSpace.maxVehicleSize)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Icon name="schedule" size={20} color={colors.textSecondary} />
                <Text style={styles.detailText}>
                  Disponible desde {formatDateTime(parkingSpace.availableFrom)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Icon name="event" size={20} color={colors.textSecondary} />
                <Text style={styles.detailText}>
                  Hasta {formatDateTime(parkingSpace.availableTo)}
                </Text>
              </View>
            </Card.Content>
          </Card>

          {/* Amenities */}
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Características</Text>
              <View style={styles.amenitiesContainer}>
                {parkingSpace.amenities.map((amenity, index) => (
                  <Chip key={index} style={styles.amenityChip}>
                    {amenity}
                  </Chip>
                ))}
              </View>

              <Divider style={styles.divider} />

              <View style={styles.featuresContainer}>
                <View style={styles.featureItem}>
                  <Icon 
                    name={parkingSpace.isSecure ? "check-circle" : "cancel"} 
                    size={20} 
                    color={parkingSpace.isSecure ? colors.success : colors.error} 
                  />
                  <Text style={styles.featureText}>Seguro</Text>
                </View>

                <View style={styles.featureItem}>
                  <Icon 
                    name={parkingSpace.isCovered ? "check-circle" : "cancel"} 
                    size={20} 
                    color={parkingSpace.isCovered ? colors.success : colors.error} 
                  />
                  <Text style={styles.featureText}>Techado</Text>
                </View>

                <View style={styles.featureItem}>
                  <Icon 
                    name={parkingSpace.hasElectricCharging ? "check-circle" : "cancel"} 
                    size={20} 
                    color={parkingSpace.hasElectricCharging ? colors.success : colors.error} 
                  />
                  <Text style={styles.featureText}>Carga eléctrica</Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Access Instructions */}
          {parkingSpace.accessInstructions && (
            <Card style={styles.card}>
              <Card.Content>
                <Text style={styles.sectionTitle}>Instrucciones de Acceso</Text>
                <Text style={styles.instructions}>{parkingSpace.accessInstructions}</Text>
              </Card.Content>
            </Card>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Button
              mode="outlined"
              onPress={handleDirections}
              style={styles.directionsButton}
              icon="directions"
            >
              Cómo llegar
            </Button>

            {!isProvider && !isOwnSpace && parkingSpace.isAvailable && (
              <Button
                mode="contained"
                onPress={() => navigation.navigate('BookingRequest', { parkingSpace })}
                style={styles.reserveButton}
                icon="event"
              >
                Reservar Ahora
              </Button>
            )}

            {isOwnSpace && (
              <Button
                mode="contained"
                onPress={() => navigation.navigate('EditParkingSpace', { parkingSpace })}
                style={styles.editButton}
                icon="edit"
              >
                Editar Espacio
              </Button>
            )}
          </View>
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
  imageContainer: {
    position: 'relative',
    height: 250,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  priceSection: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
  },
  priceUnit: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  dayPrice: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  providerCard: {
    marginBottom: 16,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerAvatar: {
    backgroundColor: colors.primary,
    marginRight: 16,
  },
  providerDetails: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  ratingText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  memberSince: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  contactButtons: {
    flexDirection: 'row',
  },
  contactButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
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
  description: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  amenityChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: colors.background,
  },
  divider: {
    marginVertical: 16,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  instructions: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 32,
  },
  directionsButton: {
    flex: 1,
    marginRight: 8,
  },
  reserveButton: {
    flex: 1,
    marginLeft: 8,
  },
  editButton: {
    flex: 1,
    marginLeft: 8,
  },
});

export default ParkingDetailsScreen;