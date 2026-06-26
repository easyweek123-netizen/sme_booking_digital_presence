import { createSlice } from '@reduxjs/toolkit';

interface PreviewState {
  setupHintDismissed: boolean;
}

const initialState: PreviewState = {
  setupHintDismissed: false,
};

const previewSlice = createSlice({
  name: 'preview',
  initialState,
  reducers: {
    dismissSetupHint: (state) => {
      state.setupHintDismissed = true;
    },
  },
});

export const { dismissSetupHint } = previewSlice.actions;
export default previewSlice.reducer;