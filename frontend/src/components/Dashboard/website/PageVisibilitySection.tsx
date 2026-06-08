import {
  HStack,
  Switch,
  Text,
  VStack,
  Divider,
} from '@chakra-ui/react';
import { Controller, useFormContext } from 'react-hook-form';
import { DashboardSectionCard } from '../DashboardSectionCard';
import { BrandPillBadge, SectionLabel } from '../../ui';
import type { WebsiteFormValues } from '../../../pages/dashboard/websiteForm.types';

interface VisibilityRowProps {
  name:
    | 'workingHoursVisibilityOnBookingPage.showNextAvailable'
    | 'workingHoursVisibilityOnBookingPage.showWeeklyHours';
  title: string;
  helper: React.ReactNode;
  recommended?: boolean;
}

function VisibilityRow({ name, title, helper, recommended }: VisibilityRowProps) {
  const { control } = useFormContext<WebsiteFormValues>();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <HStack align="center" spacing={4} py={4}>
          <VStack align="stretch" spacing={1} flex={1} minW={0}>
            <HStack spacing={2}>
              <Text fontWeight="700" color="text.heading">
                {title}
              </Text>
              {recommended && <BrandPillBadge>Recommended</BrandPillBadge>}
            </HStack>
            <Text fontSize="sm" color="text.muted" lineHeight="1.5">
              {helper}
            </Text>
          </VStack>
          <Switch
            isChecked={!!field.value}
            onChange={(e) => field.onChange(e.target.checked)}
            colorScheme="brand"
            size="md"
          />
        </HStack>
      )}
    />
  );
}

export function PageVisibilitySection() {
  return (
    <DashboardSectionCard>
      <VStack align="stretch" spacing={0}>
        <HStack spacing={2} align="center">
          <SectionLabel letterSpacing="0.08em">Page visibility</SectionLabel>
          <Text fontSize="sm" color="text.muted">
            Apply to your booking page — not the scheduler
          </Text>
          <Divider flex={1} borderColor="border.subtle" />
        </HStack>

        <VisibilityRow
          name="workingHoursVisibilityOnBookingPage.showNextAvailable"
          title='Show "Next available" on cover'
          recommended
          helper={
            <>
              Soonest bookable slot, shown beside your business name.
              Turn off if your services are by enquiry only.
            </>
          }
        />

        <Divider />

        <VisibilityRow
          name="workingHoursVisibilityOnBookingPage.showWeeklyHours"
          title="Show weekly hours table"
          helper={
            <>
              The Mon–Sun list at the bottom of your page. Hours are still used by the scheduler.
            </>
          }
        />
      </VStack>
    </DashboardSectionCard>
  );
}
