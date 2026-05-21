import { useDeleteServiceMutation } from '../../store/api';
import { ServiceFormProposal } from '../../components/canvas/proposals/ServiceFormProposal';
import { DeleteConfirmation } from '../../components/canvas/DeleteConfirmation';
import { defineHandler, type RuntimeActionHandler } from './types';
import type {
  ServiceCreateAction,
  ServiceUpdateAction,
  ServiceDeleteAction,
} from '@shared';
import type { ServiceFormInput } from '@bookeasy/shared';

export function useServiceActions(): Record<string, RuntimeActionHandler> {
  const [deleteService] = useDeleteServiceMutation();

  return {
    'service:create': defineHandler<ServiceCreateAction, Record<string, unknown>>({
      component: ServiceFormProposal,
      title: 'New Service',
      ownsShell: true,
      getProps: (action) => ({
        serviceId: undefined,
        initialValues: action.seed as Partial<ServiceFormInput> | undefined,
      }),
      execute: async () => { /* saved inside ServiceFormProposal */ },
    }),

    'service:update': defineHandler<ServiceUpdateAction, Record<string, unknown>>({
      component: ServiceFormProposal,
      title: 'Edit Service',
      ownsShell: true,
      getProps: (action) => ({
        serviceId: action.resolvedId,
        initialValues: action.seed as Partial<ServiceFormInput> | undefined,
      }),
      execute: async () => { /* saved inside ServiceFormProposal */ },
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
  };
}
