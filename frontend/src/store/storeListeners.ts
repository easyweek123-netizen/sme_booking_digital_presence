/**
 * Store Listeners
 * 
 * Registers side effects for store actions.
 * This file is imported in main.tsx to initialize listeners.
 * 
 * Separation of concerns:
 * - store.ts: Pure store configuration (no side effects)
 * - storeListeners.ts: Side effects (Firebase, localStorage, etc.)
 */

import { listenerMiddleware, persistor } from './store';
import { RESET_STORE } from './actions';
import { logOut } from '../lib/firebase';

// Handle logout side effects when store is reset
listenerMiddleware.startListening({
  type: RESET_STORE,
  effect: async () => {
    await logOut();           // Sign out of Firebase
    await persistor.purge();  // Clear persisted localStorage
  },
});

