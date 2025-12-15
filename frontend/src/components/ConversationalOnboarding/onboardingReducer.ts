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
}

export type OnboardingAction =
  | { type: 'SUBMIT'; value: string }
  | { type: 'SKIP' };

// Initial state
export const initialState: OnboardingState = {
  stepIndex: 0,
  messages: [{ role: 'bot', content: STEPS[0].message }],
  data: { businessName: '', category: null },
};

// Reducer
export function onboardingReducer(state: OnboardingState, action: OnboardingAction): OnboardingState {
  const currentStep = STEPS[state.stepIndex];
  const nextStepIndex = state.stepIndex + 1;
  const nextStep = STEPS[nextStepIndex];

  switch (action.type) {
    case 'SUBMIT': {
      const newData = {
        ...state.data,
        ...(currentStep.id === 'name' && { businessName: action.value }),
        ...(currentStep.id === 'category' && { category: action.value }),
      };

      const newMessages: Message[] = [
        ...state.messages,
        { role: 'user', content: action.value },
      ];

      if (nextStep) {
        newMessages.push({
          role: 'bot',
          content: nextStep.message.replace('{businessName}', newData.businessName),
          suggestions: nextStep.suggestions,
        });
      }

      return { stepIndex: nextStepIndex, messages: newMessages, data: newData };
    }

    case 'SKIP': {
      const newMessages: Message[] = [...state.messages];

      if (nextStep) {
        newMessages.push({
          role: 'bot',
          content: nextStep.message.replace('{businessName}', state.data.businessName),
          suggestions: nextStep.suggestions,
        });
      }

      return { stepIndex: nextStepIndex, messages: newMessages, data: state.data };
    }

    default:
      return state;
  }
}

