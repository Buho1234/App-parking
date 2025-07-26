import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, List, Switch } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/theme';

const SettingsScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <List.Item
          title="Notificaciones Push"
          description="Recibir notificaciones en tiempo real"
          right={() => <Switch value={true} onValueChange={() => {}} />}
        />
        <List.Item
          title="Modo Oscuro"
          description="Activar tema oscuro"
          right={() => <Switch value={false} onValueChange={() => {}} />}
        />
        <List.Item
          title="Idioma"
          description="Español"
          right={() => <Text style={styles.valueText}>ES</Text>}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1 },
  valueText: { fontSize: 14, color: colors.textSecondary, alignSelf: 'center' },
});

export default SettingsScreen;