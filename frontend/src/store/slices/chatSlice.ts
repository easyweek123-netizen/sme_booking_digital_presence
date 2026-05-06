import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const MAX_OPEN_TABS = 3;

export interface ChatState {
  openTabIds: number[];
  activeTabId: number | null;
}

const initialState: ChatState = {
  openTabIds: [],
  activeTabId: null,
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

    setActiveTab: (state, action: PayloadAction<number | null>) => {
      state.activeTabId = action.payload;
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

export const { openTab, closeTab, setActiveTab, removeConversation } =
  chatSlice.actions;

export default chatSlice.reducer;
