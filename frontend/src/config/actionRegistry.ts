import {
  useServiceActions,
  useBookingActions,
  type RuntimeActionHandler,
} from './actions';

// Re-export types for convenience
export type { ActionContext, RuntimeActionHandler } from './actions';

// ─────────────────────────────────────────────────────────────────────────────
// Composed Registry Hook
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Composed action registry - each entity adds its own handlers.
 *
 * To add a new entity:
 * 1. Create config/actions/[entity].actions.ts with use[Entity]Actions hook
 * 2. Import and spread here
 *
 * No changes needed to useProposalExecution.ts!
 */
export function useActionRegistry(): Record<string, RuntimeActionHandler> {
  const serviceActions = useServiceActions();
  const bookingActions = useBookingActions();

  return {
    ...serviceActions,
    ...bookingActions,
  };
}
