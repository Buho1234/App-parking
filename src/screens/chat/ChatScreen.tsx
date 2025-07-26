import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/theme';

const ChatScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>Chat</Text>
            <Text style={styles.info}>Esta pantalla implementaría un sistema de chat en tiempo real entre usuarios.</Text>
          </Card.Content>
        </Card>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, padding: 16 },
  card: { marginBottom: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginBottom: 16 },
  info: { fontSize: 14, color: colors.textSecondary },
});

export default ChatScreen;