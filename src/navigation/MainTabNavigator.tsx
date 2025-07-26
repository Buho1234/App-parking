import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Badge } from 'react-native-paper';
import { View } from 'react-native';
import { RootState } from '../store/store';
import { colors } from '../theme/theme';

// Screens
import HomeScreen from '../screens/home/HomeScreen';
import SearchScreen from '../screens/search/SearchScreen';
import BookingsScreen from '../screens/booking/BookingsScreen';
import MyParkingSpacesScreen from '../screens/parking/MyParkingSpacesScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();

const MainTabNavigator: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { unreadCount } = useSelector((state: RootState) => state.notification);
  const isProvider = user?.userType === 'provider';

  const TabIcon = ({ name, color, size, badgeCount }: { 
    name: string; 
    color: string; 
    size: number; 
    badgeCount?: number;
  }) => (
    <View style={{ position: 'relative' }}>
      <Icon name={name} color={color} size={size} />
      {badgeCount && badgeCount > 0 && (
        <Badge
          size={16}
          style={{
            position: 'absolute',
            top: -4,
            right: -8,
            backgroundColor: colors.error,
          }}
        >
          {badgeCount > 99 ? '99+' : badgeCount}
        </Badge>
      )}
    </View>
  );

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingTop: 5,
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="home" color={color} size={size} />
          ),
        }}
      />
      
      {!isProvider && (
        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{
            title: 'Buscar',
            tabBarIcon: ({ color, size }) => (
              <TabIcon name="search" color={color} size={size} />
            ),
          }}
        />
      )}

      {isProvider && (
        <Tab.Screen
          name="MyParkingSpaces"
          component={MyParkingSpacesScreen}
          options={{
            title: 'Mis Espacios',
            tabBarIcon: ({ color, size }) => (
              <TabIcon name="local-parking" color={color} size={size} />
            ),
          }}
        />
      )}

      <Tab.Screen
        name="Bookings"
        component={BookingsScreen}
        options={{
          title: isProvider ? 'Solicitudes' : 'Reservas',
          tabBarIcon: ({ color, size }) => (
            <TabIcon 
              name={isProvider ? "assignment" : "event-note"} 
              color={color} 
              size={size} 
              badgeCount={unreadCount}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;