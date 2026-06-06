import type { AvailabilityInput } from '../../types';

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
  about: {
    aboutContent: string;
  };
  availability: AvailabilityInput[];
}
