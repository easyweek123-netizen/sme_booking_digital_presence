import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  WorkingHours,
  DaySchedule,
  BusinessProfile,
  ServiceItem,
} from '../../types';

// Re-export types for backward compatibility
export type { BusinessProfile, ServiceItem };

// Default working hours: Mon-Fri 9:00-17:00
const defaultDaySchedule: DaySchedule = {
  isOpen: true,
  openTime: '09:00',
  closeTime: '17:00',
};

const closedDaySchedule: DaySchedule = {
  isOpen: false,
  openTime: '09:00',
  closeTime: '17:00',
};

export const defaultWorkingHours: WorkingHours = {
  monday: { ...defaultDaySchedule },
  tuesday: { ...defaultDaySchedule },
  wednesday: { ...defaultDaySchedule },
  thursday: { ...defaultDaySchedule },
  friday: { ...defaultDaySchedule },
  saturday: { ...closedDaySchedule },
  sunday: { ...closedDaySchedule },
};

interface OnboardingState {
  currentStep: number; // 1, 2, or 3
  businessProfile: BusinessProfile | null;
  services: ServiceItem[];
  isComplete: boolean;
}

const initialState: OnboardingState = {
  currentStep: 1,
  businessProfile: null,
  services: [],
  isComplete: false,
};

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    setBusinessProfile: (state, action: PayloadAction<BusinessProfile>) => {
      state.businessProfile = action.payload;
    },
    updateBusinessProfile: (
      state,
      action: PayloadAction<Partial<BusinessProfile>>
    ) => {
      if (state.businessProfile) {
        state.businessProfile = {
          ...state.businessProfile,
          ...action.payload,
        };
      } else {
        state.businessProfile = {
          name: '',
          phone: '',
          description: '',
          address: '',
          city: '',
          logoUrl: '',
          brandColor: '',
          workingHours: defaultWorkingHours,
          ...action.payload,
        };
      }
    },
    addService: (state, action: PayloadAction<ServiceItem>) => {
      state.services.push(action.payload);
    },
    updateService: (
      state,
      action: PayloadAction<{ id: string; service: Partial<ServiceItem> }>
    ) => {
      const index = state.services.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.services[index] = {
          ...state.services[index],
          ...action.payload.service,
        };
      }
    },
    removeService: (state, action: PayloadAction<string>) => {
      state.services = state.services.filter((s) => s.id !== action.payload);
    },
    setComplete: (state, action: PayloadAction<boolean>) => {
      state.isComplete = action.payload;
    },
    resetOnboarding: () => initialState,
  },
});

export const {
  setStep,
  setBusinessProfile,
  updateBusinessProfile,
  addService,
  updateService,
  removeService,
  setComplete,
  resetOnboarding,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
