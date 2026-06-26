import { Box } from '@chakra-ui/react';
import { TextField, TextAreaField } from '../../ui/form';
import { AboutEditor } from '../../Dashboard';
import { RecurringHoursEditor } from '../../Availability/RecurringHoursEditor';
import { LocationSelect } from '../../Locations';
import { ServiceType } from '../../Services/fields/ServiceType';
import { Duration } from '../../Services/fields/Duration';
import { Price } from '../../Services/fields/Price';
import { PauseAfter } from '../../Services/fields/PauseAfter';
import { ServiceColor } from '../../Services/fields/ServiceColor';
import { PhotoUrl } from '../../Services/fields/PhotoUrl';
import { ServiceCategory } from '../../Services/fields/ServiceCategory';
import { RhfColorField, RhfImageField, RhfLocationField } from './fields/rhf';
import { FieldSuggestion } from './FieldSuggestion';
import { CategorySuggestionChip } from './CategorySuggestionChip';
import type { FieldId } from '@shared';
import { PageVisibilitySection } from '../../Dashboard/website/PageVisibilitySection';


// One render registry for every field the BE can put in a wizard step.
// website.* bind to WebsiteFormValues paths; service.* bind to ServiceFormInput paths.
export const FIELD_REGISTRY: Partial<
  Record<FieldId, (props: { suggestion?: string }) => React.JSX.Element>
> = {
  // ── website (business + location + schedule) ───────────────────────────────
  'website.name': () => (
    <TextField
      name="basic.name"
      label="Business name"
      isRequired
      placeholder="Your business name"
    />
  ),

  'website.tagline': ({ suggestion }) => (
    <>
      <TextAreaField
        name="basic.description"
        label="Tagline"
        placeholder="Shown beneath your name"
      />
      <FieldSuggestion name="basic.description" value={suggestion} />
    </>
  ),

  'website.about': ({ suggestion }) => (
    <>
      <AboutEditor />
      <FieldSuggestion name="about.aboutContent" value={suggestion} />
    </>
  ),
  
  'website.logo': () => (
      <RhfImageField
        name="basic.logoUrl"
        label="Logo"
        aspectRatio={1}
        maxW={{ sm: '86px', md: '124px' }}
      />
  ),

  'website.brandColor': () => (
      <RhfColorField
        name="basic.brandColor"
        label="Primary color"
      />
  ),

  'website.cover': () => (
      <Box maxW={{ base: 'full' }}>
        <RhfImageField
          name="basic.coverImageUrl"
          label="Cover image"
          aspectRatio={5 / 2}
        />
      </Box>
  ),

  'website.website': () => (
    <TextField name="basic.website" label="Website" placeholder="https://…" />
  ),

  'website.instagram': () => (
    <TextField name="basic.instagram" label="Instagram" placeholder="@handle" />
  ),

  'website.address': () => (
    <RhfLocationField name="location.byType.ADDRESS.0" type="ADDRESS" />
  ),

  'website.phone': () => (
    <RhfLocationField name="location.byType.PHONE.0" type="PHONE" />
  ),

  'website.availability': () => (
    <RecurringHoursEditor
      name="availability.hours"
      title="Opening hours"
      layout="day-grouped"
    />
  ),

  'website.visibility': () => <PageVisibilitySection />,

  // ── service ────────────────────────────────────────────────────────────────
  'service.type': () => <ServiceType />,

  'service.name': ({ suggestion }) => (
    <>
      <TextField
        name="name"
        label="Service name"
        isRequired
        placeholder="Gel manicure"
      />
      <FieldSuggestion name="name" value={suggestion} />
    </>
  ),

  'service.duration': () => <Duration />,
  'service.price': ({ suggestion }) => (
    <>
      <Price />
      <FieldSuggestion
        name="price"
        value={suggestion}
        // Match Price.tsx's onBlur normalization so the value is a canonical "0.00" string.
        format={(v) => (/^\d+(\.\d{1,2})?$/.test(v.trim()) ? Number(v).toFixed(2) : v)}
      />
    </>
  ),
  'service.pause': () => <PauseAfter />,

  'service.description': ({ suggestion }) => (
    <>
      <TextAreaField
        name="description"
        label="Description"
        placeholder="A tailored haircut…"
      />
      <FieldSuggestion name="description" value={suggestion} />
    </>
  ),

  'service.color': () => <ServiceColor />,
  'service.photo': () => <PhotoUrl />,
  'service.category': ({ suggestion }) => (
    <>
      <ServiceCategory />
      <CategorySuggestionChip suggestion={suggestion} />
    </>
  ),
  'service.location': () => <LocationSelect />,
  'service.hours': () => (
    <RecurringHoursEditor name="availability" title="Availability" layout="day-grouped" />
  ),
};