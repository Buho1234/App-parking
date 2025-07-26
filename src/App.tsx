import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { store } from './store/store';
import AppNavigator from './navigation/AppNavigator';
import { theme } from './theme/theme';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <AppNavigator />
          <Toast />
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
};

export default App;