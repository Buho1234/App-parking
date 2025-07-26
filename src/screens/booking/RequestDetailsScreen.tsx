import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/theme';

const RequestDetailsScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>Detalles de la Solicitud</Text>
            <Chip style={[styles.statusChip, { backgroundColor: colors.warning }]}>
              Pendiente
            </Chip>
            <Text style={styles.info}>Esta pantalla mostraría los detalles completos de una solicitud de reserva.</Text>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  card: { marginBottom: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginBottom: 16 },
  statusChip: { alignSelf: 'flex-start', marginBottom: 16 },
  info: { fontSize: 14, color: colors.textSecondary },
});

export default RequestDetailsScreen;