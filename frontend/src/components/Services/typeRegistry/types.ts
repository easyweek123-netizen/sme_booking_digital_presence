import type { ComponentType } from 'react';
import type { ServiceFormFieldsInput } from '@bookeasy/shared';
import type { CreateServiceRequest, ServiceTypeValue } from '../../../types';
import type { ServiceDraft } from '../types';

export interface BookingFlowProps {
  business: { id: number; slug?: string; timezone: string; brandColor?: string | null; };
  service: {
    id: number;
    type: ServiceTypeValue;
    capacity: number;
    durationMinutes: number;
    priceType: CreateServiceRequest['priceType'];
  };
  onSelect: (selection: { date: string; startTime: string; endTime: string }) => void;
  mode?: 'live' | 'preview';
}

export interface ServiceTypeDefinition {
  defaults: Pick<ServiceFormFieldsInput, 'capacity' | 'durationMinutes' | 'pauseAfterMinutes'>;
  Card?: ComponentType<{ draft: ServiceDraft }>;
  BookingFlow?: ComponentType<BookingFlowProps>;
}
