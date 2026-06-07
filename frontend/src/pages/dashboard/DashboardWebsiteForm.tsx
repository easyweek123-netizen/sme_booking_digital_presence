import { useMemo, useState, type ReactNode } from 'react';
import {
  useToast,
  SimpleGrid,
  GridItem,
  Badge,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react';
import { useForm, FormProvider } from 'react-hook-form';
import { useUpdateBusinessMutation } from '../../store/api/businessApi';
import { useUpdateScheduleMutation } from '../../store/api/schedulesApi';
import {
  WebsiteCompletionProgress,
  DashboardContentShell,
  DashboardTabs,
  DashboardFormActions,
  type DashboardTabSpec,
} from '../../components/Dashboard';
import {
  WebsiteFormTabs,
  WEBSITE_TABS,
  type WebsiteTabKey,
} from '../../components/Dashboard/website';
import { useSaveBusinessLocations } from '../../components/Dashboard/website/useSaveBusinessLocations';
import { locationToDraft } from '../../components/Services/locations/shared/locationDraft';
import { BookingLinkCard } from '../../components/QRCode';
import { CheckIcon } from '../../components/icons';
import { TOAST_DURATION } from '../../constants';
import type { LocationDraft } from '@bookeasy/shared';
import type { BusinessWithServices, AvailabilityInput } from '../../types';
import type { WebsiteFormValues } from './websiteForm.types';

function businessToFormValues(
  b: BusinessWithServices,
  availability: AvailabilityInput[],
): WebsiteFormValues {
  return {
    basic: {
      name: b.name || '',
      description: b.description || '',
      logoUrl: b.logoUrl || '',
      brandColor: b.brandColor || '',
      coverImageUrl: b.coverImageUrl || '',
      website: b.website || '',
      instagram: b.instagram || '',
    },
    about: { aboutContent: b.aboutContent || '' },
    location: {
      locations: (b.locations ?? [])
        .map((l) => locationToDraft(l))
        .filter((d): d is LocationDraft => d != null),
    },
    availability,
    workingHoursVisibilityOnBookingPage: {
      showNextAvailable: b.showNextAvailable ?? true,
      showWeeklyHours: b.showWeeklyHours ?? true,
    },
  };
}

interface DashboardWebsiteFormProps {
  business: BusinessWithServices;
  initialAvailability: AvailabilityInput[];
  isDesktop?: boolean;
}

export function DashboardWebsiteForm({
  business,
  initialAvailability,
  isDesktop,
}: DashboardWebsiteFormProps) {
  const toast = useToast();
  const viewportLgUp = useBreakpointValue({ base: false, lg: true }, { ssr: false }) ?? false;
  const desktopLayout = typeof isDesktop === 'boolean' ? isDesktop : viewportLgUp;
  const [updateBusiness, { isLoading: isUpdatingBusiness }] = useUpdateBusinessMutation();
  const [updateSchedule, { isLoading: isUpdatingSchedule }] = useUpdateScheduleMutation();
  const saveLocations = useSaveBusinessLocations();
  const [activeTab, setActiveTab] = useState<WebsiteTabKey>('basic');

  const formValues = useMemo(
    () => businessToFormValues(business, initialAvailability),
    [business, initialAvailability],
  );

  const methods = useForm<WebsiteFormValues>({
    values: formValues,
    resetOptions: { keepDirtyValues: true },
    mode: 'onBlur',
  });
  const { isDirty, dirtyFields } = methods.formState;
  const handleDiscard = () => {
    methods.reset(businessToFormValues(business, initialAvailability));
  };
  const handleSave = methods.handleSubmit(async (values) => {
    try {
      const ops: Promise<unknown>[] = [];
      const businessIsDirty =
        !!dirtyFields.basic ||
        !!dirtyFields.about ||
        !!dirtyFields.workingHoursVisibilityOnBookingPage;
      if (businessIsDirty) {
        ops.push(
          updateBusiness({
            ...values.basic,
            ...values.about,
            ...values.workingHoursVisibilityOnBookingPage,
          }).unwrap(),
        );
      }
      if (dirtyFields.availability) {
        ops.push(
          updateSchedule({
            id: business.defaultScheduleId,
            data: { availability: values.availability },
          }).unwrap(),
        );
      }
      if (dirtyFields.location) {
        ops.push(
          saveLocations.save(
            values.location.locations,
            dirtyFields.location?.locations as never,
          ),
        );
      }
      await Promise.all(ops);
      toast({ title: 'Website saved', status: 'success', duration: TOAST_DURATION.MEDIUM });
    } catch {
      toast({
        title: 'Error',
        description: 'Could not save changes. Please try again.',
        status: 'error',
        duration: TOAST_DURATION.MEDIUM,
      });
    }
  });
  const isSaving = isUpdatingBusiness || isUpdatingSchedule || saveLocations.isSaving;
  const tabStatus: Record<WebsiteTabKey, { done: number; total: number }> = (() => {
    const v = methods.watch();
    const filled = (s?: string) => !!(s && s.trim());
    return {
      basic: {
        done: [v.basic.name, v.basic.description, v.basic.logoUrl, v.basic.brandColor].filter(
          filled,
        ).length,
        total: 4,
      },
      location: { done: v.location.locations.length > 0 ? 1 : 0, total: 1 },
      availability: { done: v.availability.length > 0 ? 1 : 0, total: 1 },
      about: { done: filled(v.about.aboutContent) ? 1 : 0, total: 1 },
    };
  })();
  const buildBadge = (key: WebsiteTabKey): ReactNode => {
    const { done, total } = tabStatus[key];
    const complete = done === total;
    return complete ? (
      <Badge
        bg="brand.50"
        color="brand.700"
        borderRadius="full"
        px={2}
        py={0.5}
        display="inline-flex"
        alignItems="center"
        gap={1}
        fontSize="2xs"
        fontWeight="600"
      >
        <CheckIcon size={10} aria-hidden />
        {total}/{total}
      </Badge>
    ) : (
      <Badge
        variant="subtle"
        colorScheme="gray"
        borderRadius="full"
        fontSize="2xs"
        fontWeight="600"
        px={2}
      >
        {done}/{total}
      </Badge>
    );
  };
  const websiteTabs: ReadonlyArray<DashboardTabSpec<WebsiteTabKey>> = WEBSITE_TABS.map((t) => ({
    key: t.key,
    label: t.label,
    badge: buildBadge(t.key),
  }));

  return (
    <FormProvider {...methods}>
      <DashboardContentShell
        title="Website"
        description="Build and customize your booking page"
        actions={
          <DashboardFormActions
            isDirty={isDirty}
            isSaving={isSaving}
            onSave={handleSave}
            onDiscard={handleDiscard}
          />
        }
        tabs={
          <DashboardTabs tabs={websiteTabs} activeKey={activeTab} onChange={setActiveTab} />
        }
      >
        <SimpleGrid columns={desktopLayout ? 12 : 1} spacing={{ base: 4 }} alignItems="start">
          <GridItem colSpan={desktopLayout ? 8 : 12}>
            <WebsiteFormTabs activeTab={activeTab} />
          </GridItem>
          <GridItem colSpan={desktopLayout ? 4 : 12}>
            <VStack
              spacing="space.stack.lg"
              align="stretch"
              position={desktopLayout ? 'sticky' : 'static'}
              top={desktopLayout ? 'space.stack.lg' : undefined}
              py={4}
            >
              <BookingLinkCard slug={business.slug} />
              <WebsiteCompletionProgress business={business} onScrollToSection={() => undefined} />
            </VStack>
          </GridItem>
        </SimpleGrid>
      </DashboardContentShell>
    </FormProvider>
  );
}
