import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { RootStackParamList } from '../types';

// Auth Screens
import AuthScreen from '../screens/auth/AuthScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import UserTypeSelectionScreen from '../screens/auth/UserTypeSelectionScreen';

// Main App
import MainTabNavigator from './MainTabNavigator';

// Detail Screens
import ParkingDetailsScreen from '../screens/parking/ParkingDetailsScreen';
import BookingRequestScreen from '../screens/booking/BookingRequestScreen';
import BookingDetailsScreen from '../screens/booking/BookingDetailsScreen';
import RequestDetailsScreen from '../screens/booking/RequestDetailsScreen';
import AddParkingSpaceScreen from '../screens/parking/AddParkingSpaceScreen';
import EditParkingSpaceScreen from '../screens/parking/EditParkingSpaceScreen';
import ChatScreen from '../screens/chat/ChatScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import VehicleInfoScreen from '../screens/profile/VehicleInfoScreen';
import PaymentMethodsScreen from '../screens/profile/PaymentMethodsScreen';
import HelpScreen from '../screens/profile/HelpScreen';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return (
      <Stack.Navigator 
        initialRouteName="Auth"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
        }}
      >
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="UserTypeSelection" component={UserTypeSelectionScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="Main" component={MainTabNavigator} />
      
      {/* Modal Screens */}
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen 
          name="ParkingDetails" 
          component={ParkingDetailsScreen}
          options={{ headerShown: true, title: 'Detalles del Estacionamiento' }}
        />
        <Stack.Screen 
          name="BookingRequest" 
          component={BookingRequestScreen}
          options={{ headerShown: true, title: 'Solicitar Reserva' }}
        />
        <Stack.Screen 
          name="AddParkingSpace" 
          component={AddParkingSpaceScreen}
          options={{ headerShown: true, title: 'Agregar Estacionamiento' }}
        />
        <Stack.Screen 
          name="EditParkingSpace" 
          component={EditParkingSpaceScreen}
          options={{ headerShown: true, title: 'Editar Estacionamiento' }}
        />
      </Stack.Group>

      {/* Full Screen Modals */}
      <Stack.Group screenOptions={{ presentation: 'fullScreenModal' }}>
        <Stack.Screen 
          name="ChatScreen" 
          component={ChatScreen}
          options={{ headerShown: true, title: 'Chat' }}
        />
      </Stack.Group>

      {/* Regular Screens */}
      <Stack.Screen 
        name="BookingDetails" 
        component={BookingDetailsScreen}
        options={{ headerShown: true, title: 'Detalles de la Reserva' }}
      />
      <Stack.Screen 
        name="RequestDetails" 
        component={RequestDetailsScreen}
        options={{ headerShown: true, title: 'Detalles de la Solicitud' }}
      />
      <Stack.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{ headerShown: true, title: 'Notificaciones' }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ headerShown: true, title: 'Configuración' }}
      />
      <Stack.Screen 
        name="VehicleInfo" 
        component={VehicleInfoScreen}
        options={{ headerShown: true, title: 'Información del Vehículo' }}
      />
      <Stack.Screen 
        name="PaymentMethods" 
        component={PaymentMethodsScreen}
        options={{ headerShown: true, title: 'Métodos de Pago' }}
      />
      <Stack.Screen 
        name="Help" 
        component={HelpScreen}
        options={{ headerShown: true, title: 'Ayuda y Soporte' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;