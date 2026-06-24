import { createSlice } from '@reduxjs/toolkit';

interface PreviewState {
  setupHintDismissed: boolean;
  isCanvasOpen: boolean; // chat-only when false; chat + canvas split when true
}

const initialState: PreviewState = {
  setupHintDismissed: false,
  isCanvasOpen: false,
};

const previewSlice = createSlice({
  name: 'preview',
  initialState,
  reducers: {
    dismissSetupHint: (state) => {
      state.setupHintDismissed = true;
    },
    openCanvas: (state) => {
      state.isCanvasOpen = true;
    },
  },
});

export const { dismissSetupHint, openCanvas } = previewSlice.actions;
export default previewSlice.reducer;