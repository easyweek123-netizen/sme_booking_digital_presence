import type { ServiceTypeValue } from '../../types';
import { appointment, group, type ServiceTypeDefinition } from './typeRegistry';

export const serviceTypeRegistry: Record<ServiceTypeValue, ServiceTypeDefinition> = {
  APPOINTMENT: appointment,
  GROUP: group,
};
