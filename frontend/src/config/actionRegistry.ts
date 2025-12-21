import type { ElementType } from 'react';
import type { ChatAction } from '@shared';
import type { BusinessWithServices } from '../types';
import { useServiceActions } from './actions';

// ─── Types ───

/**
 * Context passed to getProps for building component props
 */
export interface ActionContext {
  business?: BusinessWithServices;
}

/**
 * Configuration for each action type.
 * Each entity defines its own actions in a separate file.
 *
 * Note: We use ElementType for component which allows any valid React component.
 * Props are built via getProps and type safety is enforced via type guards.
 */
export interface ActionConfig {
  /**
   * Component to render for this action.
   * Receives props from getProps() + onSubmit + onCancel at runtime.
   * Use ElementType to allow any React component without strict prop matching.
   */
  component: ElementType;

  /** Title shown in the canvas container */
  title: string;

  /** Build props for the component from action data */
  getProps: (action: ChatAction, ctx: ActionContext) => Record<string, unknown>;

  /** Execute the mutation. Undefined for display-only actions. */
  execute?: (action: ChatAction, formData: Record<string, unknown>) => Promise<void>;
}

// ─── Composed Registry Hook ───

/**
 * Composed action registry - each entity adds its own actions.
 *
 * To add a new entity:
 * 1. Create config/actions/[entity].actions.ts with use[Entity]Actions hook
 * 2. Import and spread here
 *
 * No changes needed to useProposalExecution.ts!
 */
export function useActionRegistry(): Record<string, ActionConfig> {
  const serviceActions = useServiceActions();
  // Future: const bookingActions = useBookingActions();
  // Future: const customerActions = useCustomerActions();

  return {
    ...serviceActions,
    // ...bookingActions,
    // ...customerActions,
  };
}

