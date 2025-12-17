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
 * Preview context - determines what's shown in the Preview tab
 */
export type PreviewContext =
  | 'booking_page'
  | 'services'
  | 'bookings'
  | 'clients';

/**
 * Discriminated union for chat actions
 * Frontend renders appropriate component based on type
 */
export type ChatAction =
  | {
      type: 'service:create';
      businessId?: number;
      service: ServiceFormData;
    }
  | {
      type: 'service:update';
      id: number;
      service: ServiceFormData;
    }
  | {
      type: 'service:delete';
      id: number;
      name: string;
    }
  | {
      type: 'service:get';
      id: number;
      service: ServiceListItem;
    };

export interface Message {
  role: 'bot' | 'user';
  content: string;
  suggestions?: Suggestion[];
  action?: ChatAction;
  previewContext?: PreviewContext;
}
