import type { Message, Suggestion } from '../../types/chat.types';

// Step configuration
export interface Step {
  id: string;
  message: string;
  placeholder?: string;
  suggestions?: Suggestion[];
  inputType: 'text' | 'auth';
}

const CATEGORY_SUGGESTIONS: Suggestion[] = [
  { label: 'Beauty', value: 'Beauty', icon: '💇' },
  { label: 'Health', value: 'Health', icon: '💪' },
  { label: 'Wellness', value: 'Wellness', icon: '🧘' },
  { label: 'Skip', value: '', variant: 'skip' },
];

export const STEPS: Step[] = [
  {
    id: 'name',
    message: "Hi! What's your business called?",
    placeholder: 'e.g Nike',
    inputType: 'text',
  },
  {
    id: 'category',
    message: 'What would you like to tell us about {businessName}?',
    placeholder: 'e.g Hair salon, Music lessons...',
    suggestions: CATEGORY_SUGGESTIONS,
    inputType: 'text',
  },
  {
    id: 'auth',
    message: "Perfect! Let's get started.",
    inputType: 'auth',
  },
];

// State types
export interface BusinessData {
  businessName: string;
  category: string | null;
}

export interface OnboardingState {
  stepIndex: number;
  messages: Message[];
  data: BusinessData;
  isTyping: boolean;
}

export type OnboardingAction =
  | { type: 'SUBMIT'; value: string }
  | { type: 'SKIP' }
  | { type: 'START_TYPING' }
  | { type: 'FINISH_TYPING'; message: Message };

// Initial state
export const initialState: OnboardingState = {
  stepIndex: 0,
  messages: [{ role: 'bot', content: STEPS[0].message }],
  data: { businessName: '', category: null },
  isTyping: false,
};

// Reducer
export function onboardingReducer(state: OnboardingState, action: OnboardingAction): OnboardingState {
  const currentStep = STEPS[state.stepIndex];
  const nextStepIndex = state.stepIndex + 1;

  switch (action.type) {
    case 'SUBMIT': {
      const newData = {
        ...state.data,
        ...(currentStep.id === 'name' && { businessName: action.value }),
        ...(currentStep.id === 'category' && { category: action.value }),
      };

      // Add user message and start typing
      return {
        ...state,
        messages: [...state.messages, { role: 'user', content: action.value }],
        data: newData,
        isTyping: true,
      };
    }

    case 'SKIP': {
      // Start typing without adding user message
      return {
        ...state,
        isTyping: true,
      };
    }

    case 'START_TYPING': {
      return { ...state, isTyping: true };
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

