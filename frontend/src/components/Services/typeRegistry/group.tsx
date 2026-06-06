import type { ServiceTypeDefinition } from './types';

export const group: ServiceTypeDefinition = {
  defaults: {
    capacity: 2,
    pauseAfterMinutes: 0,
    durationMinutes: 90,
  },
};
