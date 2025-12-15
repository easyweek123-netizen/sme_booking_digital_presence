export interface Suggestion {
  label: string;
  value: string;
  icon?: string;
  variant?: 'default' | 'skip';
}

/**
 * Service data for form display
 */
export interface ServiceFormData {
  name?: string;
  price?: number;
  durationMinutes?: number;
  description?: string;
}

/**
 * Service item for list display
 */
export interface ServiceListItem {
  id: number;
  name: string;
  price: number;
  durationMinutes: number;
  description?: string;
}

/**
 * Discriminated union for chat actions
 * Frontend renders appropriate component based on type
 */
export type ChatAction =
  | {
      type: 'service_form';
      operation: 'create' | 'update' | 'delete';
      businessId?: number;
      serviceId?: number;
      service: ServiceFormData;
    }
  | {
      type: 'services_list';
      services: ServiceListItem[];
    };

export interface Message {
  role: 'bot' | 'user';
  content: string;
  suggestions?: Suggestion[];
  action?: ChatAction;
}
