import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ChatAction, PreviewContext } from '../../types/chat.types';

interface CanvasState {
  activeTab: 'preview' | 'actions';
  previewContext: PreviewContext;
  actions: ChatAction[];
}

const initialState: CanvasState = {
  activeTab: 'preview',
  previewContext: 'booking_page',
  actions: [],
};

const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<'preview' | 'actions'>) => {
      state.activeTab = action.payload;
    },
    setPreviewContext: (state, action: PayloadAction<PreviewContext>) => {
      state.previewContext = action.payload;
      state.activeTab = 'preview'; // Auto-switch to preview tab
    },
    setActions: (state, action: PayloadAction<ChatAction[]>) => {
      state.actions = action.payload;
      // Auto-switch to actions tab when actions are set
      if (action.payload.length > 0) {
        state.activeTab = 'actions';
      }
    },
    clearActions: (state) => {
      state.actions = [];
      state.activeTab = 'preview';
    },
  },
});

export const { setActiveTab, setPreviewContext, setActions, clearActions } = canvasSlice.actions;
export default canvasSlice.reducer;

