import {
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} from '../store/api';

/**
 * Centralized mutations for canvas actions.
 * All CRUD mutations are collected here for easy extension.
 */
export interface ActionMutations {
  // Service mutations
  createService: (data: {
    businessId: number;
    name: string;
    price: number;
    durationMinutes: number;
    description?: string;
  }) => Promise<unknown>;
  
  updateService: (data: {
    id: number;
    name?: string;
    price?: number;
    durationMinutes?: number;
    description?: string;
  }) => Promise<unknown>;
  
  deleteService: (id: number) => Promise<unknown>;
  
  // Future: booking, business, client mutations...
}

/**
 * Hook that provides all CRUD mutations for canvas actions.
 * Centralizes mutation logic and provides unwrapped promises.
 */
export function useActionMutations(): ActionMutations {
  const [createService] = useCreateServiceMutation();
  const [updateService] = useUpdateServiceMutation();
  const [deleteService] = useDeleteServiceMutation();

  return {
    createService: (data) => createService(data).unwrap(),
    updateService: (data) => updateService(data).unwrap(),
    deleteService: (id) => deleteService(id).unwrap(),
  };
}

