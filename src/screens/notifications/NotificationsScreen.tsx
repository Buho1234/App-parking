import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, List, Avatar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';

const NotificationsScreen: React.FC = () => {
  const mockNotifications = [
    {
      id: '1',
      title: '¡Nueva solicitud!',
      message: 'Ana Martínez quiere reservar tu estacionamiento',
      time: 'Hace 5 min',
      type: 'booking_request',
      isRead: false,
    },
    {
      id: '2',
      title: 'Solicitud aceptada',
      message: 'Carlos aceptó tu solicitud de estacionamiento',
      time: 'Hace 1 hora',
      type: 'booking_accepted',
      isRead: true,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {mockNotifications.map((notification) => (
          <List.Item
            key={notification.id}
            title={notification.title}
            description={notification.message}
            left={() => (
              <Avatar.Icon
                size={40}
                icon={notification.type === 'booking_request' ? 'inbox' : 'check-circle'}
                style={{ backgroundColor: notification.isRead ? colors.textSecondary : colors.primary }}
              />
            )}
            right={() => (
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{notification.time}</Text>
                {!notification.isRead && <View style={styles.unreadDot} />}
              </View>
            )}
            style={[
              styles.notificationItem,
              !notification.isRead && styles.unreadItem
            ]}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  notificationItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  unreadItem: {
    backgroundColor: colors.background,
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: 4,
  },
});

export default NotificationsScreen;