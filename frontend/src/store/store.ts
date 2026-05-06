import {
  configureStore,
  combineReducers,
  createListenerMiddleware,
  type UnknownAction,
} from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  createTransform,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer from './slices/authSlice';
import onboardingReducer from './slices/onboardingSlice';
import chatReducer from './slices/chatSlice';
import canvasReducer from './slices/canvasSlice';
import billingReducer from './slices/billingSlice';
import type { BillingUiState } from './slices/billingSlice';
import { baseApi } from './api/baseApi';
import { RESET_STORE } from './actions';

// Create listener middleware (listeners registered in storeListeners.ts)
export const listenerMiddleware = createListenerMiddleware();

// Combine all reducers
const appReducer = combineReducers({
  auth: authReducer,
  onboarding: onboardingReducer,
  chat: chatReducer,
  canvas: canvasReducer,
  billing: billingReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

// Root reducer with reset capability
type AppState = ReturnType<typeof appReducer>;

const rootReducer = (state: AppState | undefined, action: UnknownAction): AppState => {
  if (action.type === RESET_STORE) {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

const persistConfig = {
  key: 'bookeasy',
  version: 1,
  storage,
  whitelist: ['auth', 'onboarding', 'chat', 'canvas', 'billing'],
  transforms: [
    createTransform<BillingUiState, BillingUiState>(
      (inboundState, key) => {
        if (key !== 'billing') return inboundState;
        return {
          upgradePrompt: { open: false },
          checkout: inboundState.checkout,
        };
      },
      (outboundState, key) => {
        if (key !== 'billing') return outboundState;
        return {
          upgradePrompt: { open: false },
          checkout: outboundState.checkout,
        };
      },
      { whitelist: ['billing'] },
    ),
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, RESET_STORE],
      },
    })
      .prepend(listenerMiddleware.middleware)
      .concat(baseApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof appReducer>;
export type AppDispatch = typeof store.dispatch;
