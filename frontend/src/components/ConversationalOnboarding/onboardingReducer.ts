import type { Message, Suggestion } from '../../types/chat.types';

// Step configuration
export interface Step {
  id: string;
  message: string;
  placeholder?: string;
  suggestions?: Suggestion[];
}

const CATEGORY_SUGGESTIONS: Suggestion[] = [
  { label: 'Bodywork', value: 'Bodywork', icon: '💆' },
  { label: 'Holistic Healing', value: 'Holistic Healing', icon: '✨' },
  { label: 'Coaching', value: 'Coaching', icon: '🌱' },
  { label: 'Movement & Yoga', value: 'Movement & Yoga', icon: '🧘' },
  { label: 'Skip', value: '', variant: 'skip' },
];

// Data collection steps (same for all users)
export const STEPS: Step[] = [
  {
    id: 'name',
    message: "Hi! What's your practice called?",
    placeholder: 'e.g Mindful Studio',
  },
  {
    id: 'category',
    message: 'What type of practice is {businessName}?',
    placeholder: 'e.g Massage therapy, Life coaching...',
    suggestions: CATEGORY_SUGGESTIONS,
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
  const isLastStep = nextStepIndex >= STEPS.length;

  switch (action.type) {
    case 'SUBMIT': {
      const newData = {
        ...state.data,
        ...(currentStep.id === 'name' && { businessName: action.value }),
        ...(currentStep.id === 'category' && { category: action.value }),
      };

      // Add user message; advance step and skip typing if last step
      return {
        ...state,
        stepIndex: isLastStep ? nextStepIndex : state.stepIndex,
        messages: [...state.messages, { role: 'user', content: action.value }],
        data: newData,
        isTyping: !isLastStep,
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

