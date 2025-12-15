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

/**
 * Chat response from API
 */
export class ChatResponseDto {
  role: 'bot';
  content: string;
  action?: ChatAction;
}
