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
  ServiceCreateAction,
  ServiceUpdateAction,
  ServiceDeleteAction,
  ServiceGetAction,
} from '@shared';

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
      getProps: (action: ServiceCreateAction, ctx: ActionContext) => ({
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
      }),
      execute: async (action: ServiceCreateAction, formData) => {
        const businessId = action.businessId;
        if (!businessId) throw new Error('Business ID required');
        const data = formData as {
          name: string;
          price: number;
          durationMinutes: number;
          description?: string;
          imageUrl?: string | null;
        };
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
      getProps: (action: ServiceUpdateAction, ctx: ActionContext) => ({
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
      }),
      execute: async (action: ServiceUpdateAction, formData) => {
        const data = formData as {
          name: string;
          price: number;
          durationMinutes: number;
          description?: string;
          imageUrl?: string | null;
        };
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
      getProps: (action: ServiceDeleteAction) => ({
        entityType: 'service',
        id: action.resolvedId,
        name: action.name,
      }),
      execute: async (action: ServiceDeleteAction) => {
        await deleteService(action.resolvedId).unwrap();
      },
    },

    'service:get': {
      component: ServiceCard,
      title: 'Service Details',
      getProps: (action: ServiceGetAction) => ({
        service: action.service,
        showActions: false,
      }),
      // No execute - display only
    },
  };
}

