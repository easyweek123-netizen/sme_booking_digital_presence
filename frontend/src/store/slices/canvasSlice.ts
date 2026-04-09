import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ChatAction, PreviewContext } from '@shared';

// ─── localStorage Persistence ───

const STORAGE_KEY = 'bookeasy_proposals';

/**
 * Load proposals from localStorage
 */
function loadProposalsFromStorage(): ChatAction[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn('Failed to load proposals from localStorage:', error);
  }
  return [];
}

/**
 * Save proposals to localStorage
 */
function saveProposalsToStorage(proposals: ChatAction[]): void {
  try {
    if (proposals.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(proposals));
    }
  } catch (error) {
    console.warn('Failed to save proposals to localStorage:', error);
  }
}

// ─── State ───

interface CanvasState {
  activeTab: 'preview' | 'actions';
  previewContext: PreviewContext;
  proposals: ChatAction[];
}

// Rehydrate proposals from localStorage on init
const storedProposals = loadProposalsFromStorage();

const initialState: CanvasState = {
  activeTab: storedProposals.length > 0 ? 'actions' : 'preview',
  previewContext: 'booking_page',
  proposals: storedProposals,
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

    /** Replace all proposals with new ones */
    setProposals: (state, action: PayloadAction<ChatAction[]>) => {
      state.proposals = action.payload;
      saveProposalsToStorage(action.payload);
      // Auto-switch to actions tab when proposals are set
      if (action.payload.length > 0) {
        state.activeTab = 'actions';
      }
    },

    /** Add new proposals to the queue */
    addProposals: (state, action: PayloadAction<ChatAction[]>) => {
      state.proposals.push(...action.payload);
      saveProposalsToStorage(state.proposals);
      // Auto-switch to actions tab when proposals are added
      if (action.payload.length > 0) {
        state.activeTab = 'actions';
      }
    },

    /** Remove a specific proposal by proposalId or index */
    removeProposal: (state, action: PayloadAction<string | number>) => {
      const payload = action.payload;
      if (typeof payload === 'string') {
        // Remove by proposalId
        state.proposals = state.proposals.filter((p) => p.proposalId !== payload);
      } else {
        // Remove by index (legacy)
        state.proposals.splice(payload, 1);
      }
      saveProposalsToStorage(state.proposals);
      // Switch to preview if no more proposals
      if (state.proposals.length === 0) {
        state.activeTab = 'preview';
      }
    },

    /** Clear all proposals */
    clearProposals: (state) => {
      state.proposals = [];
      saveProposalsToStorage([]);
      state.activeTab = 'preview';
    },
  },
});

export const { 
  setActiveTab, 
  setPreviewContext, 
  setProposals, 
  addProposals,
  removeProposal,
  clearProposals 
} = canvasSlice.actions;

export default canvasSlice.reducer;
