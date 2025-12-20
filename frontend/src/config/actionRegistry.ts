import type { ComponentType } from 'react';
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
 */
export interface ActionConfig {
  /** Component to render for this action */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>;

  /** Title shown in the canvas container */
  title: string;

  /** Build props for the component from action data */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getProps: (action: any, ctx: ActionContext) => Record<string, unknown>;

  /** Execute the mutation. Undefined for display-only actions. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute?: (action: any, formData?: any) => Promise<unknown>;
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

// ─── Static Registry (for non-hook contexts) ───

// Keep a static version for components that can't use hooks (e.g., ActionsRenderer needs it for type lookup)
// This is populated lazily by the hook on first render
let _staticRegistry: Record<string, ActionConfig> | null = null;

/**
 * Get static registry (for use outside of React components).
 * Only available after useActionRegistry has been called at least once.
 */
export function getStaticRegistry(): Record<string, ActionConfig> | null {
  return _staticRegistry;
}

/**
 * Internal: update static registry (called by useActionRegistry)
 */
export function _setStaticRegistry(registry: Record<string, ActionConfig>) {
  _staticRegistry = registry;
}
