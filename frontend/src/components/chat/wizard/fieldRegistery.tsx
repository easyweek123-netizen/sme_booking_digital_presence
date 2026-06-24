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
import type { FieldId } from '@shared';


// One render registry for every field the BE can put in a wizard step.
// website.* bind to WebsiteFormValues paths; service.* bind to ServiceFormInput paths.
export const FIELD_REGISTRY: Partial<Record<FieldId, () => React.JSX.Element>> = {
  // ── website (business + location + schedule) ───────────────────────────────
  'website.name': () => (
    <TextField
      name="basic.name"
      label="Business name"
      isRequired
      placeholder="Your business name"
    />
  ),

  'website.tagline': () => (
    <TextAreaField
      name="basic.description"
      label="Tagline"
      placeholder="Shown beneath your name"
    />
  ),

  'website.about': () => <AboutEditor />,
  
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

  // ── service ────────────────────────────────────────────────────────────────
  'service.type': () => <ServiceType />,

  'service.name': () => (
    <TextField
      name="name"
      label="Service name"
      isRequired
      placeholder="Gel manicure"
    />
  ),

  'service.duration': () => <Duration />,
  'service.price': () => <Price />,
  'service.pause': () => <PauseAfter />,

  'service.description': () => (
    <TextAreaField
      name="description"
      label="Description"
      placeholder="A tailored haircut…"
    />
  ),

  'service.color': () => <ServiceColor />,
  'service.photo': () => <PhotoUrl />,
  'service.category': () => <ServiceCategory />,
  'service.location': () => <LocationSelect />,
  'service.hours': () => (
    <RecurringHoursEditor name="availability" title="Availability" layout="day-grouped" />
  ),
};