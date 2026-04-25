import '@fontsource/geist/400.css';
import '@fontsource/geist/500.css';
import '@fontsource/geist/600.css';
import '@fontsource/geist/700.css';
import '@fontsource/geist/800.css';
// Inter kept as fallback for glyph coverage
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';

import { store, persistor } from './store/store';
import './store/storeListeners'; // Register store side-effect listeners
import { theme } from './theme';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import { CookieConsent } from './components/CookieConsent';
import { PersistLoader } from './components/PersistLoader';
import App from './App';

import './index.css';
import { StrictMode } from 'react';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={<PersistLoader />} persistor={persistor}>
          <ChakraProvider theme={theme}>
            <BrowserRouter>
              <AuthProvider>
                <App />
                <CookieConsent />
              </AuthProvider>
            </BrowserRouter>
          </ChakraProvider>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  </StrictMode>,
);
