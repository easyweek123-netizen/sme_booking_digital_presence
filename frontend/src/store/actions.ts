import { createAction } from '@reduxjs/toolkit';

// Reset action - clears entire store and persisted storage
export const resetStore = createAction('store/RESET');
export const RESET_STORE = resetStore.type;
