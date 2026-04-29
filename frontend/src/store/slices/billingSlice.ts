import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { BillingCycle, CheckoutResponse, Plan } from '../../types/billing.types';

interface UpgradePromptState {
  open: boolean;
  requiredPlan?: Exclude<Plan, 'free'>;
  currentPlan?: Plan;
  sourceFeature?: string;
}

interface CheckoutUiState {
  selectedPlan: Exclude<Plan, 'free'> | null;
  selectedCycle: BillingCycle | null;
  response: CheckoutResponse | null;
}

export interface BillingUiState {
  upgradePrompt: UpgradePromptState;
  checkout: CheckoutUiState;
}

const initialState: BillingUiState = {
  upgradePrompt: { open: false },
  checkout: {
    selectedPlan: null,
    selectedCycle: null,
    response: null,
  },
};

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    openUpgradePrompt: (
      state,
      action: PayloadAction<
        Omit<UpgradePromptState, 'open'> & { open?: never }
      >,
    ) => {
      state.upgradePrompt = { open: true, ...action.payload };
    },
    closeUpgradePrompt: (state) => {
      state.upgradePrompt = { open: false };
    },
    setCheckoutContext: (
      state,
      action: PayloadAction<{
        plan: Exclude<Plan, 'free'>;
        cycle: BillingCycle;
      }>,
    ) => {
      state.checkout.selectedPlan = action.payload.plan;
      state.checkout.selectedCycle = action.payload.cycle;
    },
    setCheckoutResponse: (state, action: PayloadAction<CheckoutResponse>) => {
      state.checkout.response = action.payload;
    },
    clearCheckoutState: (state) => {
      state.checkout = {
        selectedPlan: null,
        selectedCycle: null,
        response: null,
      };
    },
  },
});

export const {
  openUpgradePrompt,
  closeUpgradePrompt,
  setCheckoutContext,
  setCheckoutResponse,
  clearCheckoutState,
} = billingSlice.actions;
export default billingSlice.reducer;

