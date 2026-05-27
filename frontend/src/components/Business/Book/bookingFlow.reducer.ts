import type { Service } from '../../../types';
import type { BookingAction, BookingState } from './bookingFlow.types';

export const initialBookingState = (initialService: Service | null = null): BookingState => ({
  step: initialService ? 2 : 1,
  service: initialService,
  date: new Date(),
  slot: null,
  submitting: false,
  succeeded: false,
});

export function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'SELECT_SERVICE':
      return { ...state, service: action.service, slot: null };
    case 'DESELECT_SERVICE':
      return { ...state, service: null, slot: null };
    case 'SELECT_DATE':
      return { ...state, date: action.date, slot: null };
    case 'SELECT_SLOT':
      return { ...state, slot: action.slot };
    case 'GO_BACK':
      return { ...state, step: Math.max(1, state.step - 1) };
    case 'GO_NEXT':
      return { ...state, step: state.step + 1 };
    case 'SUBMIT_START':
      return { ...state, submitting: true };
    case 'SUBMIT_SUCCESS':
      return { ...state, submitting: false, succeeded: true };
    case 'SUBMIT_ERROR':
      return { ...state, submitting: false };
    default:
      return state;
  }
}
