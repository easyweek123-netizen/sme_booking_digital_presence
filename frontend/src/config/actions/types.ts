import type { ChatAction } from '@shared';
import type { BusinessWithServices } from '../../types';

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Context passed to action handlers for building component props
 */
export interface ActionContext {
  business?: BusinessWithServices;
}

// ─────────────────────────────────────────────────────────────────────────────
// Runtime Handler Type (for registry and ActionsRenderer)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Runtime action handler type used by registry and ActionsRenderer.
 * Uses loose types for dynamic lookups at runtime.
 */
export interface RuntimeActionHandler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>;
  title: string;
  getProps: (action: ChatAction, ctx: ActionContext) => Record<string, unknown>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute?: (action: ChatAction, formData: any) => Promise<void>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Typed Action Handler (for definition-time type safety)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Type-safe action handler definition.
 * This is used internally by defineHandler for compile-time type checking.
 *
 * @template TAction - The specific action type (e.g., ServiceCreateAction)
 * @template TFormData - The data returned by the form component on submit
 */
interface TypedActionHandlerDef<
  TAction extends ChatAction,
  TFormData = void,
> {
  /**
   * React component to render for this action.
   * Must accept onSubmit and onCancel callbacks.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>;

  /** Title shown in the canvas container */
  title: string;

  /**
   * Build props for the component from action data.
   * The action parameter is typed to the specific action type.
   */
  getProps: (action: TAction, ctx: ActionContext) => Record<string, unknown>;

  /**
   * Execute the mutation when user confirms.
   * Both action and formData are strictly typed.
   * Undefined for display-only actions.
   */
  execute?: (action: TAction, formData: TFormData) => Promise<void>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Helper function to create a type-safe handler.
 * Ensures TypeScript infers the correct types for action and formData
 * during definition, while returning a RuntimeActionHandler for registry.
 *
 * Type safety is enforced at definition time:
 * - action parameter is typed to the specific action type
 * - formData parameter is typed to the specific form data type
 *
 * @example
 * ```typescript
 * 'service:create': defineHandler<ServiceCreateAction, ServiceInput>({
 *   component: ServiceForm,
 *   title: 'New Service',
 *   getProps: (action, ctx) => ({
 *     initialValues: action.service,  // action is typed as ServiceCreateAction
 *   }),
 *   execute: async (action, formData) => {
 *     // formData is typed as ServiceInput
 *     await createService({ ...formData, businessId: action.businessId });
 *   },
 * }),
 * ```
 */
export function defineHandler<TAction extends ChatAction, TFormData = void>(
  handler: TypedActionHandlerDef<TAction, TFormData>,
): RuntimeActionHandler {
  // Return as RuntimeActionHandler - type safety is enforced at definition time
  return handler as RuntimeActionHandler;
}
