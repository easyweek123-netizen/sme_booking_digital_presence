import type { AvailabilityInput } from '../../types';

export interface WebsiteFormValues {
  profile: {
    name: string;
    description: string;
    phone: string;
    address: string;
    city: string;
    website: string;
    instagram: string;
  };
  branding: {
    logoUrl: string;
    brandColor: string;
    coverImageUrl: string;
  };
  about: {
    aboutContent: string;
  };
  availability: AvailabilityInput[];
}
