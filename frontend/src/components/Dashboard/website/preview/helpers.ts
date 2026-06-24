import type { BusinessWithServices } from '../../../../types';
import type { Location } from '../../../../types/location';
import type { WebsiteFormValues } from '../../../../pages/dashboard/websiteForm.types';
import { locationFromDraft } from '../../../Locations';

// The preview only reads a strict subset of BusinessWithServices fields.
// Pin those explicitly so type changes elsewhere don't silently widen the
// empty shell.
export type BusinessPreviewShape = Pick<
  BusinessWithServices,
  | 'id' | 'slug' | 'name' | 'description' | 'logoUrl' | 'brandColor'
  | 'coverImageUrl' | 'website' | 'instagram' | 'aboutContent'
  | 'locations' | 'services' | 'workingHours'
  | 'showNextAvailable' | 'showWeeklyHours'
>;

/** Empty-but-valid shell so BusinessBookingPage never reads undefined fields on first render. */
function emptyBusiness(): BusinessPreviewShape {
  return {
    id: 0,
    slug: '',
    name: '',
    description: '',
    logoUrl: '',
    brandColor: '',
    coverImageUrl: '',
    website: '',
    instagram: '',
    aboutContent: '',
    locations: [],
    services: [],
    workingHours: null,
    showNextAvailable: true,
    showWeeklyHours: false,
  };
}

/**
 * Mirror of servicePreviewDraft: builds a fully-formed Business from form values
 * plus an optional saved fallback (provides services/slug/id which the form
 * does not track). Caller passes whatever it has — a missing `saved` is fine.
 */
export function websitePreviewDraft(
  values: WebsiteFormValues | undefined,
  saved: BusinessWithServices | undefined,
): BusinessPreviewShape {
  const base = saved ?? emptyBusiness();
  if (!values) return base;

  const { basic, about, availability } = values;

  const byType = values.location?.byType;
  const locations: Location[] = [
    ...(byType?.ADDRESS ?? []),
    ...(byType?.PHONE ?? []),
    ...(byType?.ONLINE ? [byType.ONLINE] : []),
  ]
    .map((d) => locationFromDraft(d))
    .filter((l): l is Location => l != null);

  return {
    ...base,
    name: basic?.name?.trim() || base.name || 'Your business',
    description: basic?.description ?? base.description ?? '',
    logoUrl: basic?.logoUrl || base.logoUrl,
    brandColor: basic?.brandColor || base.brandColor,
    coverImageUrl: basic?.coverImageUrl ?? base.coverImageUrl,
    website: basic?.website ?? base.website,
    instagram: basic?.instagram ?? base.instagram,
    aboutContent: about?.aboutContent ?? base.aboutContent ?? '',
    locations,
    workingHours: base.workingHours,
    showNextAvailable: availability?.visibility?.showNextAvailable ?? base.showNextAvailable ?? true,
    showWeeklyHours:  availability?.visibility?.showWeeklyHours  ?? base.showWeeklyHours  ?? false,
  };
}
