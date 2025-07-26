import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Text,
  Surface,
  Avatar,
  Card,
  List,
  Switch,
  Divider,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootState } from '../../store/store';
import { logout } from '../../store/slices/authSlice';
import { colors } from '../../theme/theme';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const isProvider = user?.userType === 'provider';

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: () => dispatch(logout()),
        },
      ]
    );
  };

  const menuItems = [
    {
      title: 'Editar Perfil',
      subtitle: 'Actualiza tu información personal',
      icon: 'edit',
      onPress: () => {/* TODO: Navigate to edit profile */},
    },
    {
      title: 'Información del Vehículo',
      subtitle: 'Gestiona los datos de tu vehículo',
      icon: 'directions-car',
      onPress: () => navigation.navigate('VehicleInfo'),
      showForProvider: false,
    },
    {
      title: 'Mis Estacionamientos',
      subtitle: 'Gestiona tus espacios publicados',
      icon: 'local-parking',
      onPress: () => navigation.navigate('MyParkingSpaces'),
      showForProvider: true,
    },
    {
      title: 'Métodos de Pago',
      subtitle: 'Tarjetas y opciones de pago',
      icon: 'payment',
      onPress: () => navigation.navigate('PaymentMethods'),
    },
    {
      title: 'Notificaciones',
      subtitle: 'Ve todas tus notificaciones',
      icon: 'notifications',
      onPress: () => navigation.navigate('Notifications'),
    },
    {
      title: 'Configuración',
      subtitle: 'Ajustes de la aplicación',
      icon: 'settings',
      onPress: () => navigation.navigate('Settings'),
    },
    {
      title: 'Ayuda y Soporte',
      subtitle: 'Obtén ayuda o contacta soporte',
      icon: 'help',
      onPress: () => navigation.navigate('Help'),
    },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (item.showForProvider === undefined) return true;
    return item.showForProvider === isProvider;
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Surface style={styles.header} elevation={2}>
          <View style={styles.profileInfo}>
            <Avatar.Text 
              size={80} 
              label={user?.name?.charAt(0) || 'U'} 
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name || 'Usuario'}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
              <View style={styles.userTypeContainer}>
                <Icon 
                  name={isProvider ? 'local-parking' : 'search'} 
                  size={16} 
                  color={colors.primary} 
                />
                <Text style={styles.userType}>
                  {isProvider ? 'Arrendador' : 'Buscador'}
                </Text>
              </View>
            </View>
          </View>
          
          {user?.isVerified && (
            <View style={styles.verifiedBadge}>
              <Icon name="verified" size={20} color={colors.success} />
              <Text style={styles.verifiedText}>Verificado</Text>
            </View>
          )}
        </Surface>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{user?.rating?.toFixed(1) || '0.0'}</Text>
                <Text style={styles.statLabel}>Calificación</Text>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Icon
                      key={star}
                      name="star"
                      size={16}
                      color={star <= (user?.rating || 0) ? colors.secondary : colors.border}
                    />
                  ))}
                </View>
              </View>
              <Divider style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{user?.totalRatings || 0}</Text>
                <Text style={styles.statLabel}>
                  {isProvider ? 'Reservas' : 'Calificaciones'}
                </Text>
              </View>
              <Divider style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {user?.createdAt ? 
                    new Date().getFullYear() - new Date(user.createdAt).getFullYear() : 0
                  }
                </Text>
                <Text style={styles.statLabel}>Años</Text>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {filteredMenuItems.map((item, index) => (
            <TouchableOpacity key={index} onPress={item.onPress}>
              <List.Item
                title={item.title}
                description={item.subtitle}
                left={(props) => (
                  <View style={styles.menuIcon}>
                    <Icon name={item.icon} size={24} color={colors.primary} />
                  </View>
                )}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                style={styles.menuItem}
                titleStyle={styles.menuTitle}
                descriptionStyle={styles.menuDescription}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <Card style={styles.quickActionsCard}>
          <Card.Content>
            <Text style={styles.quickActionsTitle}>Acciones Rápidas</Text>
            
            <List.Item
              title="Modo Nocturno"
              description="Activa el tema oscuro"
              left={() => (
                <View style={styles.menuIcon}>
                  <Icon name="dark-mode" size={24} color={colors.primary} />
                </View>
              )}
              right={() => <Switch value={false} onValueChange={() => {}} />}
              style={styles.quickActionItem}
            />
            
            <List.Item
              title="Notificaciones Push"
              description="Recibe notificaciones en tiempo real"
              left={() => (
                <View style={styles.menuIcon}>
                  <Icon name="notifications-active" size={24} color={colors.primary} />
                </View>
              )}
              right={() => <Switch value={true} onValueChange={() => {}} />}
              style={styles.quickActionItem}
            />
          </Card.Content>
        </Card>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={24} color={colors.error} />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>ParkDrive v1.0.0</Text>
          <Text style={styles.appCopyright}>© 2024 ParkDrive. Todos los derechos reservados.</Text>
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
  header: {
    padding: 20,
    backgroundColor: colors.surface,
    marginBottom: 16,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: colors.primary,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  userTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userType: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 4,
    fontWeight: '500',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  verifiedText: {
    fontSize: 12,
    color: colors.success,
    marginLeft: 4,
    fontWeight: '500',
  },
  statsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statCard: {
    // Additional styles if needed
  },
  statContent: {
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
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    marginHorizontal: 16,
  },
  menuContainer: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  menuItem: {
    paddingVertical: 8,
  },
  menuIcon: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  menuDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  quickActionsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  quickActionItem: {
    paddingVertical: 4,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.error,
    marginLeft: 8,
  },
  appInfo: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  appVersion: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  appCopyright: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default ProfileScreen;