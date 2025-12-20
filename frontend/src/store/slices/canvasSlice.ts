import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ChatAction, PreviewContext } from '@shared';

// Alias for clarity - proposals are ChatActions with proposalId
type ActionProposal = ChatAction;

interface CanvasState {
  activeTab: 'preview' | 'actions';
  previewContext: PreviewContext;
  proposals: ActionProposal[];
}

const initialState: CanvasState = {
  activeTab: 'preview',
  previewContext: 'booking_page',
  proposals: [],
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
    setProposals: (state, action: PayloadAction<ActionProposal[]>) => {
      state.proposals = action.payload;
      // Auto-switch to actions tab when proposals are set
      if (action.payload.length > 0) {
        state.activeTab = 'actions';
      }
    },
    
    /** Add new proposals to the queue */
    addProposals: (state, action: PayloadAction<ActionProposal[]>) => {
      state.proposals.push(...action.payload);
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
        state.proposals = state.proposals.filter(p => p.proposalId !== payload);
      } else {
        // Remove by index (legacy)
        state.proposals.splice(payload, 1);
      }
      // Switch to preview if no more proposals
      if (state.proposals.length === 0) {
        state.activeTab = 'preview';
      }
    },
    
    /** Clear all proposals */
    clearProposals: (state) => {
      state.proposals = [];
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
