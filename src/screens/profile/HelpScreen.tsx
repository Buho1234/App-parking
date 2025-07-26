import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, List } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/theme';

const HelpScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>Ayuda y Soporte</Text>
          </Card.Content>
        </Card>
        
        <List.Item
          title="Preguntas Frecuentes"
          description="Encuentra respuestas a las preguntas más comunes"
          left={props => <List.Icon {...props} icon="help-circle" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
        
        <List.Item
          title="Contactar Soporte"
          description="Envía un mensaje a nuestro equipo de soporte"
          left={props => <List.Icon {...props} icon="message" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
        
        <List.Item
          title="Términos y Condiciones"
          description="Lee nuestros términos de servicio"
          left={props => <List.Icon {...props} icon="file-document" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1 },
  card: { margin: 16, marginBottom: 8 },
  title: { fontSize: 20, fontWeight: 'bold', color: colors.text },
});

export default HelpScreen;