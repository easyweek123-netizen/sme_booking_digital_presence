import {
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} from '../../store/api';
import { ServiceForm } from '../../components/onboarding/ServiceForm';
import { ServiceCard } from '../../components/Dashboard/ServiceCard';
import { DeleteConfirmation } from '../../components/canvas/DeleteConfirmation';
import type { ActionConfig, ActionContext } from '../actionRegistry';
import type {
  ChatAction,
  ServiceCreateAction,
  ServiceUpdateAction,
  ServiceDeleteAction,
  ServiceGetAction,
} from '@shared';

// ─── Type Guards ───

function isServiceCreateAction(action: ChatAction): action is ServiceCreateAction {
  return action.type === 'service:create';
}

function isServiceUpdateAction(action: ChatAction): action is ServiceUpdateAction {
  return action.type === 'service:update';
}

function isServiceDeleteAction(action: ChatAction): action is ServiceDeleteAction {
  return action.type === 'service:delete';
}

function isServiceGetAction(action: ChatAction): action is ServiceGetAction {
  return action.type === 'service:get';
}

/**
 * Validate service form data from component submission
 */
function validateServiceFormData(data: Record<string, unknown>): {
  name: string;
  price: number;
  durationMinutes: number;
  description?: string;
  imageUrl?: string | null;
} {
  if (
    typeof data.name !== 'string' ||
    typeof data.price !== 'number' ||
    typeof data.durationMinutes !== 'number'
  ) {
    throw new Error('Invalid form data');
  }
  return {
    name: data.name,
    price: data.price,
    durationMinutes: data.durationMinutes,
    description: typeof data.description === 'string' ? data.description : undefined,
    imageUrl: typeof data.imageUrl === 'string' ? data.imageUrl : null,
  };
}

// ─── Service Actions ───

/**
 * Service entity actions - self-contained with mutations.
 * Each entity defines its own action hook.
 */
export function useServiceActions(): Record<string, ActionConfig> {
  const [createService] = useCreateServiceMutation();
  const [updateService] = useUpdateServiceMutation();
  const [deleteService] = useDeleteServiceMutation();

  return {
    'service:create': {
      component: ServiceForm,
      title: 'New Service',
      getProps: (action: ChatAction, ctx: ActionContext) => {
        if (!isServiceCreateAction(action)) return {};
        return {
          initialValues: action.service
            ? {
                name: action.service.name || '',
                price: action.service.price || 0,
                durationMinutes: action.service.durationMinutes || 30,
                description: action.service.description,
                imageUrl: action.service.imageUrl,
              }
            : null,
          businessId: action.businessId ?? ctx.business?.id,
          workingHours: ctx.business?.workingHours,
          moreOptionsExpanded: true,
        };
      },
      execute: async (action: ChatAction, formData: Record<string, unknown>) => {
        if (!isServiceCreateAction(action)) return;
        const businessId = action.businessId;
        if (!businessId) throw new Error('Business ID required');

        const data = validateServiceFormData(formData);
        await createService({
          businessId,
          name: data.name,
          price: data.price,
          durationMinutes: data.durationMinutes,
          description: data.description,
          imageUrl: data.imageUrl,
        }).unwrap();
      },
    },

    'service:update': {
      component: ServiceForm,
      title: 'Edit Service',
      getProps: (action: ChatAction, ctx: ActionContext) => {
        if (!isServiceUpdateAction(action)) return {};
        return {
          initialValues: {
            id: String(action.resolvedId),
            name: action.service.name || '',
            price: action.service.price || 0,
            durationMinutes: action.service.durationMinutes || 30,
            description: action.service.description,
            imageUrl: action.service.imageUrl,
          },
          businessId: ctx.business?.id,
          workingHours: ctx.business?.workingHours,
          moreOptionsExpanded: true,
        };
      },
      execute: async (action: ChatAction, formData: Record<string, unknown>) => {
        if (!isServiceUpdateAction(action)) return;

        const data = validateServiceFormData(formData);
        await updateService({
          id: action.resolvedId,
          name: data.name,
          price: data.price,
          durationMinutes: data.durationMinutes,
          description: data.description,
          imageUrl: data.imageUrl,
        }).unwrap();
      },
    },

    'service:delete': {
      component: DeleteConfirmation,
      title: 'Delete Service',
      getProps: (action: ChatAction) => {
        if (!isServiceDeleteAction(action)) return {};
        return {
          entityType: 'service',
          id: action.resolvedId,
          name: action.name,
        };
      },
      execute: async (action: ChatAction) => {
        if (!isServiceDeleteAction(action)) return;
        await deleteService(action.resolvedId).unwrap();
      },
    },

    'service:get': {
      component: ServiceCard,
      title: 'Service Details',
      getProps: (action: ChatAction) => {
        if (!isServiceGetAction(action)) return {};
        return {
          service: action.service,
          showActions: false,
        };
      },
      // No execute - display only
    },
  };
}

