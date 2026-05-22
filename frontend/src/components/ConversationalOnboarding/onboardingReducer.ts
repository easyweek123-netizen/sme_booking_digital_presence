import type { Message } from '../../types/chat.types';
import type { Suggestion } from '@shared';

// Step configuration
export interface Step {
  id: string;
  message: string;
  placeholder?: string;
  suggestions?: Suggestion[];
}

// Data collection steps (same for all users)
// Business type suggestions are injected dynamically in useOnboardingFlow
export const STEPS: Step[] = [
  {
    id: 'name',
    message: "Hi! What's your practice called?",
    placeholder: 'e.g Mindful Studio',
  },
  {
    id: 'type',
    message: 'What type of business is {businessName}?',
  },
];

// State types
export type HoursPreference = 'morning' | 'standard' | 'evening';

export interface BusinessData {
  businessName: string;
  businessTypeId: number | null;
  hoursPreference: HoursPreference | null;
}

export interface OnboardingState {
  stepIndex: number;
  messages: Message[];
  data: BusinessData;
  isTyping: boolean;
}

export type OnboardingAction =
  | { type: 'SUBMIT'; value: string; label?: string }
  | { type: 'UPDATE_SELECTION'; value: string; label?: string }
  | { type: 'SKIP' }
  | { type: 'FINISH_TYPING'; message: Message };

// Initial state
export const initialState: OnboardingState = {
  stepIndex: 0,
  messages: [{ role: 'bot', content: STEPS[0].message }],
  data: { businessName: '', businessTypeId: null, hoursPreference: null },
  isTyping: false,
};

// Reducer
export function onboardingReducer(state: OnboardingState, action: OnboardingAction): OnboardingState {
  const currentStep = STEPS[state.stepIndex];
  const nextStepIndex = state.stepIndex + 1;
  const isLastStep = nextStepIndex >= STEPS.length;

  switch (action.type) {
    case 'SUBMIT': {
      if (state.stepIndex >= STEPS.length) return state;

      // Map value to valid hours preference, or null for custom/unknown input
      const validPreferences: HoursPreference[] = ['morning', 'standard', 'evening'];
      const hoursValue = validPreferences.includes(action.value as HoursPreference)
        ? (action.value as HoursPreference)
        : null; // Custom text → null → defaults to standard

      // Business type value is a stringified number ID (or empty string for skip)
      const businessTypeIdValue = currentStep.id === 'type'
        ? (action.value ? parseInt(action.value, 10) || null : null)
        : undefined;

      const newData = {
        ...state.data,
        ...(currentStep.id === 'name' && { businessName: action.value }),
        ...(currentStep.id === 'type' && { businessTypeId: businessTypeIdValue ?? null }),
        ...(currentStep.id === 'hours' && { hoursPreference: hoursValue }),
      };

      // Mark the selected chip in the last bot message that has suggestions
      const messagesWithSelection = state.messages.map((m) => {
        if (m.role === 'bot' && m.suggestions?.length) {
          return {
            ...m,
            suggestions: m.suggestions.map((s) => ({
              ...s,
              isSelected: s.value === action.value,
            })),
          };
        }
        return m;
      });

      return {
        ...state,
        stepIndex: isLastStep ? nextStepIndex : state.stepIndex,
        messages: [...messagesWithSelection, { role: 'user', content: action.label ?? action.value }],
        data: newData,
        isTyping: !isLastStep,
      };
    }

    case 'UPDATE_SELECTION': {
      const businessTypeIdValue = action.value ? parseInt(action.value, 10) || null : null;
      const updated = [...state.messages];

      // Update last user message text
      for (let i = updated.length - 1; i >= 0; i--) {
        if (updated[i].role === 'user') {
          updated[i] = { ...updated[i], content: action.label ?? action.value };
          break;
        }
      }

      // Update selected chip in last bot message with suggestions
      for (let i = updated.length - 1; i >= 0; i--) {
        if (updated[i].role === 'bot' && updated[i].suggestions?.length) {
          updated[i] = {
            ...updated[i],
            suggestions: updated[i].suggestions!.map((s) => ({
              ...s,
              isSelected: s.value === action.value,
            })),
          };
          break;
        }
      }

      return {
        ...state,
        messages: updated,
        data: { ...state.data, businessTypeId: businessTypeIdValue },
      };
    }

    case 'SKIP': {
      // Advance step and skip typing if last step
      return {
        ...state,
        stepIndex: isLastStep ? nextStepIndex : state.stepIndex,
        isTyping: !isLastStep,
      };
    }

    case 'FINISH_TYPING': {
      return {
        ...state,
        stepIndex: nextStepIndex,
        messages: [...state.messages, action.message],
        isTyping: false,
      };
    }

    default:
      return state;
  }
}

