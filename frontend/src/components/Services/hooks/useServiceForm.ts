import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ServiceFormSchema,
  type ServiceFormFieldsInput,
  type ServiceFormInput,
} from '@bookeasy/shared';
import { serviceTypeRegistry } from '../serviceTypeRegistry';
import { resolveLocationMeta } from '../fields/locationMetaConfig';
import type {
  Business,
  Service,
  ServiceTypeValue,
  AvailabilityInput,
} from '../../../types';

interface UseServiceFormParams {
  service?: Service;
  business: Business;
  availability: AvailabilityInput[];
  /** Values that override both defaults and fetched-service values (e.g. AI-proposed changes). */
  initialValues?: Partial<ServiceFormInput>;
}

const FIELD_DEFAULTS = {
  type: 'APPOINTMENT',
  name: '',
  description: null,
  capacity: 1,
  durationMinutes: 30,
  pauseAfterMinutes: 0,
  price: '',
  priceType: 'FIXED',
  locationType: 'AT_BUSINESS',
  locationMeta: null,
  color: '#7C3AED',
  photoUrl: null,
  categoryId: null,
} satisfies ServiceFormFieldsInput;

function makeServiceDraft(type: ServiceTypeValue): ServiceFormFieldsInput {
  return {
    ...FIELD_DEFAULTS,
    ...serviceTypeRegistry[type].defaults,
  };
}
function fromService(service: Service, business: Business): ServiceFormFieldsInput {
  return {
    type: service.type,
    name: service.name,
    description: service.description,
    capacity: service.capacity,
    durationMinutes: service.durationMinutes,
    pauseAfterMinutes: service.pauseAfterMinutes,
    price: service.price ?? '',
    priceType: service.priceType,
    locationType: service.locationType,
    color: service.color,
    photoUrl: service.photoUrl,
    categoryId: service.categoryId,
    locationMeta: resolveLocationMeta(
      service.locationType,
      business,
      service.locationMeta,
    ),
  };
}
function pickServiceFormFields(
  source: Service | ServiceFormFieldsInput,
  business: Business,
): ServiceFormFieldsInput {
  if ('id' in source) {
    return fromService(source, business);
  }

  return {
    ...source,
    locationMeta: resolveLocationMeta(
      source.locationType,
      business,
      source.locationMeta,
    ),
  };
}

export function useServiceForm({
  service,
  business,
  availability,
  initialValues,
}: UseServiceFormParams): UseFormReturn<ServiceFormInput> {
  const type: ServiceTypeValue =
    initialValues?.type ?? service?.type ?? 'APPOINTMENT';

  const source = service ?? makeServiceDraft(type);
  const fields = pickServiceFormFields(source, business);

  return useForm<ServiceFormInput>({
    resolver: zodResolver(ServiceFormSchema),
    defaultValues: { ...fields, availability, ...initialValues },
    mode: 'onBlur',
  });
}
