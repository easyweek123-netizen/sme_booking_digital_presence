import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Message } from '../../types/chat.types';

interface ChatState {
  messages: Message[];
  initialized: boolean;
}

const initialState: ChatState = {
  messages: [],
  initialized: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.initialized = action.payload;
    },
    clearChat: (state) => {
      state.messages = [];
      state.initialized = false;
    },
  },
});

export const { addMessage, setMessages, setInitialized, clearChat } = chatSlice.actions;
export default chatSlice.reducer;

