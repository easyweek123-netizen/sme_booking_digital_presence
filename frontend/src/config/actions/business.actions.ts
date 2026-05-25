import { useUpdateBusinessMutation } from '../../store/api';
import { BusinessUpdateProposal } from '../../components/canvas/BusinessUpdateProposal';
import { defineHandler, type RuntimeActionHandler } from './types';
import type { BusinessUpdateAction } from '@shared';

export function useBusinessActions(): Record<string, RuntimeActionHandler> {
  const [updateBusiness] = useUpdateBusinessMutation();

  return {
    'business:update': defineHandler<BusinessUpdateAction, Record<string, unknown>>({
      component: BusinessUpdateProposal,
      title: 'Update Business Profile',
      getProps: (action) => ({
        initialValues: { ...action.current, ...action.updates },
        updatedFields: Object.keys(action.updates),
      }),
      execute: async (action, formData) => {
        await updateBusiness({
          id: action.businessId,
          data: formData,
        }).unwrap();
      },
    }),
  };
}
