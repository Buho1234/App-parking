import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/theme';

const EditParkingSpaceScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>Editar Estacionamiento</Text>
            <Text style={styles.info}>Esta pantalla permitiría editar los detalles de un estacionamiento existente.</Text>
            <Button mode="contained" style={styles.button}>
              Guardar Cambios
            </Button>
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
  info: { fontSize: 14, color: colors.textSecondary, marginBottom: 16 },
  button: { marginTop: 16 },
});

export default EditParkingSpaceScreen;