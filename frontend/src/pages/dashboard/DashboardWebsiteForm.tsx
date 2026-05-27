import { useState, type ReactNode } from 'react';
import {
  Box,
  VStack,
  useToast,
  SimpleGrid,
  GridItem,
  Badge,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useForm, FormProvider } from 'react-hook-form';
import { useUpdateBusinessMutation } from '../../store/api/businessApi';
import { useUpdateScheduleMutation } from '../../store/api/schedulesApi';
import { BrandingFields } from '../../components/ui/BrandingFields';
import {
  AboutContentFields,
  BusinessProfileFields,
  WebsiteCompletionProgress,
  DashboardContentShell,
  DashboardTabs,
  DashboardFormActions,
  type DashboardTabSpec,
} from '../../components/Dashboard';
import { RecurringHoursEditor, DateSpecificHoursEditor } from '../../components/Availability';
import { BookingLinkCard } from '../../components/QRCode';
import { CheckIcon } from '../../components/icons';
import { TOAST_DURATION } from '../../constants';
import type { BusinessWithServices, AvailabilityInput } from '../../types';
import type { WebsiteFormValues } from './websiteForm.types';
type TabKey = 'profile' | 'branding' | 'hours' | 'about';
const TABS: { key: TabKey; label: string }[] = [
  { key: 'profile', label: 'Profile' },
  { key: 'branding', label: 'Branding' },
  { key: 'hours', label: 'Hours' },
  { key: 'about', label: 'About' },
];
function businessToFormValues(
  b: BusinessWithServices,
  availability: AvailabilityInput[],
): WebsiteFormValues {
  return {
    profile: {
      name: b.name || '',
      description: b.description || '',
      phone: b.phone || '',
      address: b.address || '',
      city: b.city || '',
      website: b.website || '',
      instagram: b.instagram || '',
    },
    branding: {
      logoUrl: b.logoUrl || '',
      brandColor: b.brandColor || '',
      coverImageUrl: b.coverImageUrl || '',
    },
    about: { aboutContent: b.aboutContent || '' },
    availability,
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
  const [activeTab, setActiveTab] = useState<TabKey>('profile');
  const methods = useForm<WebsiteFormValues>({
    defaultValues: businessToFormValues(business, initialAvailability),
    mode: 'onBlur',
  });
  const { isDirty, dirtyFields } = methods.formState;
  const handleDiscard = () => {
    methods.reset(businessToFormValues(business, initialAvailability));
  };
  const handleSave = methods.handleSubmit(async (values) => {
    try {
      const businessFields = { ...values.profile, ...values.branding, ...values.about };
      const ops: Promise<unknown>[] = [];
      const businessIsDirty =
        !!dirtyFields.profile || !!dirtyFields.branding || !!dirtyFields.about;
      if (businessIsDirty) ops.push(updateBusiness(businessFields).unwrap());
      if (dirtyFields.availability) {
        ops.push(
          updateSchedule({
            id: business.defaultScheduleId,
            data: { availability: values.availability },
          }).unwrap(),
        );
      }
      await Promise.all(ops);
      methods.reset(values);
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
  const isSaving = isUpdatingBusiness || isUpdatingSchedule;
  const tabStatus: Record<TabKey, { done: number; total: number }> = (() => {
    const v = methods.watch();
    const filled = (s?: string) => !!(s && s.trim());
    return {
      profile: {
        done: [
          v.profile.name,
          v.profile.description,
          v.profile.phone,
          v.profile.address,
          v.profile.city,
        ].filter(filled).length,
        total: 5,
      },
      branding: {
        done: [v.branding.logoUrl, v.branding.brandColor, v.branding.coverImageUrl].filter(
          filled,
        ).length,
        total: 3,
      },
      hours: { done: 1, total: 1 },
      about: { done: filled(v.about.aboutContent) ? 1 : 0, total: 1 },
    };
  })();
  const sectionCardProps = {
    bg: 'surface.card' as const,
    borderRadius: 'xl' as const,
    border: '1px solid' as const,
    borderColor: 'border.subtle' as const,
  };
  const buildBadge = (key: TabKey): ReactNode => {
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
  const websiteTabs: ReadonlyArray<DashboardTabSpec<TabKey>> = TABS.map((t) => ({
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
            {activeTab === 'profile' && (
              <Box {...sectionCardProps} p={{ base: 4 }}>
                <BusinessProfileFields />
              </Box>
            )}
            {activeTab === 'branding' && (
              <Box {...sectionCardProps} p={{ base: 4 }}>
                <BrandingFields />
              </Box>
            )}
            {activeTab === 'hours' && (
              <Box {...sectionCardProps} p={{ base: 4 }}>
                <VStack align="stretch" spacing={6}>
                  <RecurringHoursEditor
                    name="availability"
                    title="Weekly hours"
                    description="Set when you are typically available."
                    layout="day-grouped"
                    showCopyToDays
                  />
                  <DateSpecificHoursEditor
                    name="availability"
                    title="Date-specific hours"
                    description="Adjust hours for specific dates."
                    addLabel="Hours"
                    allowClosedToggle
                  />
                </VStack>
              </Box>
            )}
            {activeTab === 'about' && (
              <Box {...sectionCardProps} p={{ base: 4 }}>
                <AboutContentFields />
              </Box>
            )}
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
