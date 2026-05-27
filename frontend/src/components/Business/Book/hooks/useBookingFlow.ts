import { useCallback, useReducer } from 'react';
import type { Service } from '../../../../types';
import { bookingReducer, initialBookingState } from '../bookingFlow.reducer';
import type { BookingFlow, BookingStep } from '../bookingFlow.types';

interface UseBookingFlowOptions {
  initialService: Service | null;
  steps: readonly BookingStep[];
  onSubmit: (payload: { service: Service; date: Date; slot: string }) => Promise<void> | void;
}

export function useBookingFlow({
  initialService,
  steps,
  onSubmit,
}: UseBookingFlowOptions): BookingFlow {
  const [state, dispatch] = useReducer(bookingReducer, initialBookingState(initialService));

  const selectService = useCallback((service: Service) => dispatch({ type: 'SELECT_SERVICE', service }), []);
  const deselectService = useCallback(() => dispatch({ type: 'DESELECT_SERVICE' }), []);
  const selectDate = useCallback((date: Date) => dispatch({ type: 'SELECT_DATE', date }), []);
  const selectSlot = useCallback((slot: string) => dispatch({ type: 'SELECT_SLOT', slot }), []);
  const goBack = useCallback(() => dispatch({ type: 'GO_BACK' }), []);

  const goNext = useCallback(async () => {
    const stepIdx = state.step - 1;
    const isLast = stepIdx === steps.length - 1;
    if (!isLast) {
      dispatch({ type: 'GO_NEXT' });
      return;
    }
    if (!state.service || !state.slot) return;
    dispatch({ type: 'SUBMIT_START' });
    try {
      await onSubmit({ service: state.service, date: state.date, slot: state.slot });
      dispatch({ type: 'SUBMIT_SUCCESS' });
    } catch {
      dispatch({ type: 'SUBMIT_ERROR' });
    }
  }, [state, steps, onSubmit]);

  return { state, selectService, deselectService, selectDate, selectSlot, goBack, goNext };
}
