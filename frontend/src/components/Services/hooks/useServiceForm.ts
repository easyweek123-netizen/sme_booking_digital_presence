import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ServiceFormSchema,
  type ServiceFormFieldsInput,
  type ServiceFormInput,
  type LocationDraft,
} from '@bookeasy/shared';
import { serviceTypeRegistry } from '../serviceTypeRegistry';
import type {
  Business, Service, ServiceTypeValue, AvailabilityInput,
} from '../../../types';

interface UseServiceFormParams {
  service?: Service;
  business: Business;
  availability: AvailabilityInput[];
  location: LocationDraft | null;
  initialValues?: Partial<ServiceFormInput>;
}

export interface UseServiceFormResult {
  methods: UseFormReturn<ServiceFormInput>;
}

const FIELD_DEFAULTS = {
  type: 'APPOINTMENT', name: '', description: null, capacity: 1,
  durationMinutes: 30, pauseAfterMinutes: 0, price: '', priceType: 'FIXED',
  color: '#7C3AED', photoUrl: null, categoryId: null,
} satisfies Partial<ServiceFormFieldsInput>;

function makeServiceDefaults(type: ServiceTypeValue): Partial<ServiceFormFieldsInput> {
  return { ...FIELD_DEFAULTS, ...serviceTypeRegistry[type].defaults };
}

function fromService(service: Service): ServiceFormFieldsInput {
  return {
    type: service.type, 
    name: service.name, 
    description: service.description,
    capacity: service.capacity, 
    durationMinutes: service.durationMinutes,
    pauseAfterMinutes: service.pauseAfterMinutes, 
    price: service.price ?? '',
    priceType: service.priceType, 
    color: service.color, 
    photoUrl: service.photoUrl,
    categoryId: service.categoryId,
  } as ServiceFormFieldsInput;
}

export function useServiceForm({
  service, availability, location, initialValues,
}: UseServiceFormParams): UseServiceFormResult {
  const type: ServiceTypeValue = initialValues?.type ?? service?.type ?? 'APPOINTMENT';
  const fields = service ? fromService(service) : (makeServiceDefaults(type) as ServiceFormFieldsInput);

  const methods = useForm<ServiceFormInput>({
    resolver: zodResolver(ServiceFormSchema),
    defaultValues: {
      ...fields,
      availability,
      location,
      ...initialValues,
    },
    mode: 'onBlur',
  });

  return { methods };
}
