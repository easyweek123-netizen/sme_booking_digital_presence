import type { FC } from 'react';
import type { Business, Service, ServiceCategory } from '../../../types';

export interface BookingState {
  step: number;
  service: Service | null;
  date: Date;
  slot: string | null;
  submitting: boolean;
  succeeded: boolean;
}

export type BookingAction =
  | { type: 'SELECT_SERVICE'; service: Service }
  | { type: 'DESELECT_SERVICE' }
  | { type: 'SELECT_DATE'; date: Date }
  | { type: 'SELECT_SLOT'; slot: string }
  | { type: 'GO_BACK' }
  | { type: 'GO_NEXT' }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS' }
  | { type: 'SUBMIT_ERROR' };

export interface BookingFlow {
  state: BookingState;
  selectService: (service: Service) => void;
  deselectService: () => void;
  selectDate: (date: Date) => void;
  selectSlot: (slot: string) => void;
  goBack: () => void;
  goNext: () => Promise<void>;
}

export interface BookingStepContext {
  flow: BookingFlow;
  business: Business;
  services: Service[];
  categories: ServiceCategory[];
  isDesktop: boolean;
  isAuthenticated: boolean;
  userEmail?: string | null;
  signingIn?: boolean;
  onSignIn: () => void;
}

export interface BookingStep {
  id: string;
  title: string;
  subtitle?: string;
  Component: FC<BookingStepContext>;
  isComplete: (state: BookingState) => boolean;
  continueLabel?: (state: BookingState) => string;
}
