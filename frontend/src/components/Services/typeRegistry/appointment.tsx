import type { ServiceTypeDefinition } from './types';

export const appointment: ServiceTypeDefinition = {
  defaults: {
    capacity: 1,
    durationMinutes: 30,
    pauseAfterMinutes: 0,
  },
};
