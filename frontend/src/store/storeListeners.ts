/**
 * Store Listeners
 *
 * Registers side effects for store actions (Firebase, localStorage, etc.).
 * Imported in main.tsx to initialize listeners.
 */

import { listenerMiddleware, persistor } from './store';
import { RESET_STORE } from './actions';
import { logOut } from '../lib/firebase';

const SHOW_SETUP_KEY = 'showSetupKey';

export function shouldShowSetupHint(): boolean {
  try { return localStorage.getItem(SHOW_SETUP_KEY) !== 'false'; } catch { return true; }
}
export function setShowSetupHint(show: boolean): void {
  try { localStorage.setItem(SHOW_SETUP_KEY, String(show)); } catch { /* ignore */ }
}

// Handle logout side effects when store is reset
listenerMiddleware.startListening({
  type: RESET_STORE,
  effect: async () => {
    await logOut();           
    await persistor.purge();
  },
});