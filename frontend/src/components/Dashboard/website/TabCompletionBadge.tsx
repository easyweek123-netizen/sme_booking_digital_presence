import { useFormContext, useWatch } from 'react-hook-form';
import { BrandPillBadge } from '../../ui';
import { Badge } from '@chakra-ui/react';
import { CheckIcon } from '../../icons';
import type { WebsiteFormValues } from '../../../pages/dashboard/websiteForm.types';
import type { WebsiteTabKey } from './websiteTabs';

interface Props { tabKey: WebsiteTabKey; }

const filled = (s?: string) => !!(s && s.trim());

function TabCompletionBadgeDisplay({ done, total }: { done: number; total: number }) {
  if (done === total) {
    return (
      <BrandPillBadge leftIcon={<CheckIcon size={10} aria-hidden />}>
        {total}/{total}
      </BrandPillBadge>
    );
  }
  return (
    <Badge variant="subtle" colorScheme="gray" borderRadius="full" fontSize="2xs" fontWeight="600" px={2}>
      {done}/{total}
    </Badge>
  );
}

function BasicTabCompletionBadge() {
  const { control } = useFormContext<WebsiteFormValues>();
  const [name, description, logoUrl, brandColor] = useWatch({
    control,
    name: ['basic.name', 'basic.description', 'basic.logoUrl', 'basic.brandColor'],
  });
  const done = [name, description, logoUrl, brandColor].filter(filled).length;
  return <TabCompletionBadgeDisplay done={done} total={4} />;
}

function LocationTabCompletionBadge() {
  const { control } = useFormContext<WebsiteFormValues>();
  const [address, phone, online] = useWatch({
    control,
    name: ['location.byType.ADDRESS', 'location.byType.PHONE', 'location.byType.ONLINE'],
  });
  const done =
    ((address?.length ?? 0) > 0 ? 1 : 0) +
    ((phone?.length ?? 0) > 0 ? 1 : 0) +
    (online ? 1 : 0);
  return <TabCompletionBadgeDisplay done={done} total={3} />;
}

function AvailabilityTabCompletionBadge() {
  const { control } = useFormContext<WebsiteFormValues>();
  const hours = useWatch({ control, name: 'availability.hours' });
  const done = (hours?.length ?? 0) > 0 ? 1 : 0;
  return <TabCompletionBadgeDisplay done={done} total={1} />;
}

function AboutTabCompletionBadge() {
  const { control } = useFormContext<WebsiteFormValues>();
  const aboutContent = useWatch({ control, name: 'about.aboutContent' });
  const done = filled(aboutContent) ? 1 : 0;
  return <TabCompletionBadgeDisplay done={done} total={1} />;
}

export function TabCompletionBadge({ tabKey }: Props) {
  switch (tabKey) {
    case 'basic':
      return <BasicTabCompletionBadge />;
    case 'location':
      return <LocationTabCompletionBadge />;
    case 'availability':
      return <AvailabilityTabCompletionBadge />;
    case 'about':
      return <AboutTabCompletionBadge />;
  }
}
