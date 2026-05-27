import type { ComponentType, ReactNode } from 'react';
import type { ServiceFormFieldsInput } from '@bookeasy/shared';
import type { CreateServiceRequest, ServiceTypeValue } from '../../../types';
import type { ServiceDraft } from '../preview';

export interface BookingFlowProps {
  business: {
    id: number;
    slug?: string;
    timezone: string;
    brandColor?: string | null;
  };
  service: {
    id: number;
    type: ServiceTypeValue;
    capacity: number;
    durationMinutes: number;
    priceType: CreateServiceRequest['priceType'];
  };
  onSelect: (selection: {
    date: string;
    startTime: string;
    endTime: string;
  }) => void;
  mode?: 'live' | 'preview';
}

export interface ServiceTypeDefinition {
  label: string;
  typeChipIcon: ReactNode;
  defaults: Pick<
    ServiceFormFieldsInput,
    'capacity' | 'durationMinutes' | 'pauseAfterMinutes'
  >;
  Card: ComponentType<{ draft: ServiceDraft }>;
  BookingFlow?: ComponentType<BookingFlowProps>;
}
