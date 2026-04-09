import {
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} from '../../store/api';
import { ServiceForm } from '../../components/onboarding/ServiceForm';
import { ServiceCard } from '../../components/Dashboard/ServiceCard';
import { DeleteConfirmation } from '../../components/canvas/DeleteConfirmation';
import { defineHandler, type RuntimeActionHandler } from './types';
import type {
  ServiceCreateAction,
  ServiceUpdateAction,
  ServiceDeleteAction,
  ServiceGetAction,
  ServiceInput,
} from '@shared';

// ─────────────────────────────────────────────────────────────────────────────
// Service Actions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Service entity action handlers.
 * Uses defineHandler for type-safe action and formData typing.
 *
 * Each handler maps an action type to:
 * - component: The React component to render
 * - title: Header title for the canvas container
 * - getProps: Derives component props from action data
 * - execute: Mutation to run when user confirms (optional for display-only)
 */
export function useServiceActions(): Record<string, RuntimeActionHandler> {
  const [createService] = useCreateServiceMutation();
  const [updateService] = useUpdateServiceMutation();
  const [deleteService] = useDeleteServiceMutation();

  return {
    'service:create': defineHandler<ServiceCreateAction, ServiceInput>({
      component: ServiceForm,
      title: 'New Service',
      getProps: (action, ctx) => ({
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
      execute: async (action, formData) => {
        const businessId = action.businessId;
        if (!businessId) throw new Error('Business ID required');
        await createService({
          businessId,
          name: formData.name,
          price: formData.price,
          durationMinutes: formData.durationMinutes,
          description: formData.description,
          imageUrl: formData.imageUrl,
        }).unwrap();
      },
    }),

    'service:update': defineHandler<ServiceUpdateAction, ServiceInput>({
      component: ServiceForm,
      title: 'Edit Service',
      getProps: (action, ctx) => ({
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
      execute: async (action, formData) => {
        await updateService({
          id: action.resolvedId,
          name: formData.name,
          price: formData.price,
          durationMinutes: formData.durationMinutes,
          description: formData.description,
          imageUrl: formData.imageUrl,
        }).unwrap();
      },
    }),

    'service:delete': defineHandler<ServiceDeleteAction, { confirmed: boolean }>({
      component: DeleteConfirmation,
      title: 'Delete Service',
      getProps: (action) => ({
        entityType: 'service',
        id: action.resolvedId,
        name: action.name,
      }),
      execute: async (action) => {
        await deleteService(action.resolvedId).unwrap();
      },
    }),

    'service:get': defineHandler<ServiceGetAction, void>({
      component: ServiceCard,
      title: 'Service Details',
      getProps: (action) => ({
        service: action.service,
        showActions: false,
      }),
      // No execute - display only
    }),
  };
}
