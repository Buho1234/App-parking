import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { colors } from '../../theme/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BookingDetailsScreen: React.FC = () => {
  const route = useRoute();
  // @ts-ignore - Basic implementation
  const { booking } = route.params || {};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>Detalles de la Reserva</Text>
            <Text style={styles.subtitle}>ID: {booking?.id || 'demo-booking'}</Text>
            
            <View style={styles.statusContainer}>
              <Chip style={[styles.statusChip, { backgroundColor: colors.success }]}>
                Activa
              </Chip>
            </View>

            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <Icon name="schedule" size={20} color={colors.textSecondary} />
                <Text style={styles.infoText}>Desde: Hoy 14:00</Text>
              </View>
              <View style={styles.infoRow}>
                <Icon name="schedule" size={20} color={colors.textSecondary} />
                <Text style={styles.infoText}>Hasta: Hoy 18:00</Text>
              </View>
              <View style={styles.infoRow}>
                <Icon name="local-parking" size={20} color={colors.textSecondary} />
                <Text style={styles.infoText}>Estacionamiento Centro</Text>
              </View>
              <View style={styles.infoRow}>
                <Icon name="payment" size={20} color={colors.textSecondary} />
                <Text style={styles.infoText}>Total: $20</Text>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <Button mode="outlined" style={styles.button}>
                Contactar Arrendador
              </Button>
              <Button mode="contained" style={styles.button}>
                Cómo llegar
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  statusContainer: {
    marginBottom: 16,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  infoContainer: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default BookingDetailsScreen;