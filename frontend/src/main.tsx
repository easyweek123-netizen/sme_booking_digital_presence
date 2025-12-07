import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ChakraProvider, Spinner, Center } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';

import { store, persistor } from './store/store';
import './store/storeListeners'; // Register store side-effect listeners
import { theme } from './theme';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import App from './App';

import './index.css';

// Loading component for PersistGate
const PersistLoader = () => (
  <Center h="100vh">
    <Spinner size="xl" color="brand.500" thickness="4px" />
  </Center>
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={<PersistLoader />} persistor={persistor}>
          <ChakraProvider theme={theme}>
            <BrowserRouter>
              <AuthProvider>
                <App />
              </AuthProvider>
            </BrowserRouter>
          </ChakraProvider>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  </StrictMode>
);
