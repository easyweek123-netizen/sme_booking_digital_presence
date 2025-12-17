import { IsString } from 'class-validator';

export class SendMessageDto {
  @IsString()
  message: string;
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

/**
 * Chat response from API
 */
export class ChatResponseDto {
  role: 'bot';
  content: string;
  action?: ChatAction;
  previewContext?: PreviewContext;
}
