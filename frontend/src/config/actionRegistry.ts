import type { ComponentType } from 'react';
import type { ChatAction } from '../types/chat.types';
import type { BusinessWithServices } from '../types';
import type { ActionMutations } from '../hooks/useActionMutations';
import type { ServiceFormData } from '../components/onboarding/ServiceForm';

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
  getProps: (action: ChatAction, ctx: ActionContext) => Record<string, unknown>;
  /** Returns a callable mutation function. Receives mutations and original action for context. */
  getMutation?: (mutations: ActionMutations, action: ChatAction) => (data: unknown) => Promise<unknown>;
}

// ─── Registry ───

// Note: Components are imported dynamically in ActionsRenderer to avoid circular imports
// This registry defines the configuration, ActionsRenderer maps componentKey to actual components

export const actionRegistry: Record<ChatAction['type'], ActionConfig> = {
  'service:create': {
    component: null!, // Assigned in ActionsRenderer
    title: 'New Service',
    getProps: (action, ctx) => {
      const a = action as Extract<ChatAction, { type: 'service:create' }>;
      return {
        initialValues: a.service
          ? {
              name: a.service.name || '',
              price: a.service.price || 0,
              durationMinutes: a.service.durationMinutes || 30,
              description: a.service.description,
            }
          : null,
        businessId: ctx.business?.id,
        workingHours: ctx.business?.workingHours,
        moreOptionsExpanded: true,
      };
    },
    getMutation: (mutations, action) => async (data) => {
      const a = action as Extract<ChatAction, { type: 'service:create' }>;
      const formData = data as ServiceFormData;
      // Get businessId from action, fallback handled by caller
      const businessId = a.businessId;
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
    component: null!, // Assigned in ActionsRenderer
    title: 'Edit Service',
    getProps: (action, ctx) => {
      const a = action as Extract<ChatAction, { type: 'service:update' }>;
      return {
        initialValues: {
          id: String(a.id),
          name: a.service.name || '',
          price: a.service.price || 0,
          durationMinutes: a.service.durationMinutes || 30,
          description: a.service.description,
        },
        businessId: ctx.business?.id,
        workingHours: ctx.business?.workingHours,
        moreOptionsExpanded: true,
      };
    },
    getMutation: (mutations, action) => async (data) => {
      const a = action as Extract<ChatAction, { type: 'service:update' }>;
      const formData = data as ServiceFormData;
      // Get service ID from action directly
      return mutations.updateService({
        id: a.id,
        name: formData.name,
        price: formData.price,
        durationMinutes: formData.durationMinutes,
        description: formData.description,
      });
    },
  },

  'service:delete': {
    component: null!, // Assigned in ActionsRenderer
    title: 'Delete Service',
    getProps: (action) => {
      const a = action as Extract<ChatAction, { type: 'service:delete' }>;
      return {
        entityType: 'service',
        id: a.id,
        name: a.name,
      };
    },
    getMutation: (mutations, action) => async () => {
      const a = action as Extract<ChatAction, { type: 'service:delete' }>;
      // Get service ID from action directly
      return mutations.deleteService(a.id);
    },
  },

  'service:get': {
    component: null!, // Assigned in ActionsRenderer
    title: 'Service Details',
    getProps: (action) => {
      const a = action as Extract<ChatAction, { type: 'service:get' }>;
      return {
        service: a.service,
        showActions: false,
      };
    },
    // No getMutation - display only
  },
};

