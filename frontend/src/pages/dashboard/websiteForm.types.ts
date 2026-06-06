import type { AvailabilityInput } from '../../types';
import type { LocationDraft } from '@bookeasy/shared';

export interface WebsiteFormValues {
  basic: {
    name: string;
    description: string;
    logoUrl: string;
    brandColor: string;
    coverImageUrl: string;
    website: string;
    instagram: string;
  };
  location: { locations: LocationDraft[] };
  about: { aboutContent: string };
  availability: AvailabilityInput[];
}
