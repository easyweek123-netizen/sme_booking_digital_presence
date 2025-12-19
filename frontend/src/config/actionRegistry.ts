import type { ComponentType } from 'react';
import type { ActionType } from '@shared';
import type { BusinessWithServices } from '../types';
import type { ActionMutations } from '../hooks/useActionMutations';
import type { ServiceFormData } from '../components/onboarding/ServiceForm';

// ─── Component Imports ───
// Direct imports - no more null! placeholders
import { ServiceForm } from '../components/onboarding/ServiceForm';
import { ServiceCard } from '../components/Dashboard/ServiceCard';
import { DeleteConfirmation } from '../components/canvas/DeleteConfirmation';

// ─── Types ───

/**
 * Context passed to getProps for building component props
 */
export interface ActionContext {
  business?: BusinessWithServices;
}

/**
 * Configuration for each action type
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
  
  /** Returns a callable mutation function. Only for actions that modify data. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getMutation?: (mutations: ActionMutations, action: any) => (data: unknown) => Promise<unknown>;
}

// ─── Registry ───

/**
 * Action Registry
 * 
 * Maps action types to their components, props builders, and mutations.
 * This is the single source of truth for how actions are rendered.
 * 
 * To add a new action:
 * 1. Add schema in @shared/schemas/actions/
 * 2. Add config here with component, title, getProps, and optionally getMutation
 */
export const actionRegistry: Record<ActionType, ActionConfig> = {
  'service:create': {
    component: ServiceForm,
    title: 'New Service',
    getProps: (action, ctx) => ({
      initialValues: action.service
        ? {
            name: action.service.name || '',
            price: action.service.price || 0,
            durationMinutes: action.service.durationMinutes || 30,
            description: action.service.description,
          }
        : null,
      businessId: action.businessId ?? ctx.business?.id,
      workingHours: ctx.business?.workingHours,
      moreOptionsExpanded: true,
    }),
    getMutation: (mutations, action) => async (data) => {
      const formData = data as ServiceFormData;
      const businessId = action.businessId;
      if (!businessId) throw new Error('Business ID required');
      return mutations.createService({
        businessId,
        name: formData.name,
        price: formData.price,
        durationMinutes: formData.durationMinutes,
        description: formData.description,
      });
    },
  },

  'service:update': {
    component: ServiceForm,
    title: 'Edit Service',
    getProps: (action, ctx) => ({
      initialValues: {
        id: String(action.resolvedId),
        name: action.service.name || '',
        price: action.service.price || 0,
        durationMinutes: action.service.durationMinutes || 30,
        description: action.service.description,
      },
      businessId: ctx.business?.id,
      workingHours: ctx.business?.workingHours,
      moreOptionsExpanded: true,
    }),
    getMutation: (mutations, action) => async (data) => {
      const formData = data as ServiceFormData;
      return mutations.updateService({
        id: action.resolvedId,
        name: formData.name,
        price: formData.price,
        durationMinutes: formData.durationMinutes,
        description: formData.description,
      });
    },
  },

  'service:delete': {
    component: DeleteConfirmation,
    title: 'Delete Service',
    getProps: (action) => ({
      entityType: 'service',
      id: action.resolvedId,
      name: action.name,
    }),
    getMutation: (mutations, action) => async () => {
      return mutations.deleteService(action.resolvedId);
    },
  },

  'service:get': {
    component: ServiceCard,
    title: 'Service Details',
    getProps: (action) => ({
      service: action.service,
      showActions: false,
    }),
    // No getMutation - display only
  },
};

// Type for the registry
export type ActionRegistry = typeof actionRegistry;
