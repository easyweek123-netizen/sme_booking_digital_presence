import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Wizard } from '@shared';

const MAX_OPEN_TABS = 3;

export interface ChatState {
  openTabIds: number[];
  activeTabId: number | null;
  activeWizard: Wizard | null;
}

const initialState: ChatState = {
  openTabIds: [],
  activeTabId: null,
  activeWizard: null
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    openTab: (state, action: PayloadAction<number>) => {
      const id = action.payload;

      if (state.openTabIds.includes(id)) {
        state.activeTabId = id;
        return;
      }

      if (state.openTabIds.length >= MAX_OPEN_TABS) {
        const idx = state.openTabIds.indexOf(state.activeTabId ?? -1);
        state.openTabIds[idx >= 0 ? idx : state.openTabIds.length - 1] = id;
      } else {
        state.openTabIds.push(id);
      }

      state.activeTabId = id;
    },

    closeTab: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const idx = state.openTabIds.indexOf(id);
      if (idx === -1) return;

      state.openTabIds.splice(idx, 1);

      if (state.activeTabId === id) {
        state.activeTabId = state.openTabIds[Math.max(0, idx - 1)] ?? null;
      }
    },

    setActiveWizard: (s, a: PayloadAction<Wizard|null>) => { s.activeWizard = a.payload; },

    markWizardStepDone: (s, a: PayloadAction<string>) => {
      const step = s.activeWizard?.steps.find((st) => st.id === a.payload);
      if (step) step.done = true;
    },

    setActiveTab: (state, action: PayloadAction<number | null>) => {
      state.activeTabId = action.payload;
      state.activeWizard = null;
    },

    removeConversation: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const idx = state.openTabIds.indexOf(id);
      if (idx >= 0) state.openTabIds.splice(idx, 1);

      if (state.activeTabId === id) {
        state.activeTabId = state.openTabIds[0] ?? null;
      }
    },
  },
});

export const { openTab, closeTab, setActiveWizard, markWizardStepDone, setActiveTab, removeConversation } =
  chatSlice.actions;

export default chatSlice.reducer;
