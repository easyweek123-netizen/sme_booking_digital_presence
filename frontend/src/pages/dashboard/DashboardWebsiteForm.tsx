import { useMemo, useState, useCallback } from 'react';
import {
  Box,
  VStack,
  Text,
  Button,
  useToast,
  HStack,
  SimpleGrid,
  GridItem,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  Badge,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useUpdateBusinessMutation } from '../../store/api/businessApi';
import { WorkingHoursEditor } from '../../components/onboarding/WorkingHoursEditor';
import { BrandingFields } from '../../components/ui/BrandingFields';
import {
  AboutContentFields,
  BusinessProfileFields,
  WebsiteCompletionProgress,
} from '../../components/Dashboard';
import { BookingLinkCard } from '../../components/QRCode';
import { CheckIcon } from '../../components/icons';
import { PageHeader } from '../../components/ui/PageHeader';
import { TOAST_DURATION } from '../../constants';
import type { WorkingHours, BusinessWithServices } from '../../types';

type TabKey = 'profile' | 'branding' | 'hours' | 'about';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'profile', label: 'Profile' },
  { key: 'branding', label: 'Branding' },
  { key: 'hours', label: 'Hours' },
  { key: 'about', label: 'About' },
];

const SECTION_SCROLL_ID_TO_TAB: Record<string, TabKey> = {
  'section-business-profile': 'profile',
  'section-branding': 'branding',
  'section-working-hours': 'hours',
  'section-about': 'about',
};

const FORM_DATA_KEYS = [
  'name',
  'description',
  'phone',
  'address',
  'city',
  'website',
  'instagram',
  'logoUrl',
  'brandColor',
  'coverImageUrl',
  'aboutContent',
] as const;

type FormDataState = {
  [K in (typeof FORM_DATA_KEYS)[number]]: string;
};

function businessToFormState(b: BusinessWithServices): FormDataState {
  return {
    name: b.name || '',
    description: b.description || '',
    phone: b.phone || '',
    address: b.address || '',
    city: b.city || '',
    website: b.website || '',
    instagram: b.instagram || '',
    logoUrl: b.logoUrl || '',
    brandColor: b.brandColor || '',
    coverImageUrl: b.coverImageUrl || '',
    aboutContent: b.aboutContent || '',
  };
}

function workingHoursEqual(a: WorkingHours | null, b: WorkingHours | null | undefined): boolean {
  return JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
}

function countDirtyFields(
  formData: FormDataState,
  baseline: FormDataState,
  workingHours: WorkingHours | null,
  baselineWorkingHours: WorkingHours | null | undefined,
): number {
  let n = 0;
  for (const k of FORM_DATA_KEYS) {
    if ((formData[k] ?? '') !== (baseline[k] ?? '')) {
      n += 1;
    }
  }
  if (!workingHoursEqual(workingHours, baselineWorkingHours ?? null)) {
    n += 1;
  }
  return n;
}

function filled(v?: string | null): boolean {
  return !!(v && String(v).trim());
}

interface DashboardWebsiteFormProps {
  business: BusinessWithServices;
  /** When provided (canvas preview), layout follows panel width; otherwise uses `lg` viewport breakpoint. */
  isDesktop?: boolean;
}

export function DashboardWebsiteForm({ business, isDesktop }: DashboardWebsiteFormProps) {
  const toast = useToast();
  const viewportLgUp = useBreakpointValue({ base: false, lg: true }, { ssr: false }) ?? false;
  const desktopLayout = typeof isDesktop === 'boolean' ? isDesktop : viewportLgUp;
  const [updateBusiness, { isLoading: isUpdating }] = useUpdateBusinessMutation();

  const [activeTab, setActiveTab] = useState<TabKey>('profile');

  const [formData, setFormData] = useState<FormDataState>(() => businessToFormState(business));
  const [workingHours, setWorkingHours] = useState<WorkingHours | null>(
    () => business.workingHours ?? null,
  );

  const dirtyCount = useMemo(() => {
    const baseline = businessToFormState(business);
    return countDirtyFields(formData, baseline, workingHours, business.workingHours);
  }, [formData, business, workingHours]);
  const hasChanges = dirtyCount > 0;

  const handleScrollToSection = useCallback((sectionId: string) => {
    const tab = SECTION_SCROLL_ID_TO_TAB[sectionId];
    if (tab) setActiveTab(tab);
  }, []);

  const handleDiscard = useCallback(() => {
    setFormData(businessToFormState(business));
    setWorkingHours(business.workingHours ?? null);
  }, [business]);

  const handleWorkingHoursChange = (hours: WorkingHours) => {
    setWorkingHours(hours);
  };

  const handleSave = async () => {
    try {
      await updateBusiness({
        id: business.id,
        data: {
          ...formData,
          workingHours: workingHours || undefined,
        },
      }).unwrap();

      toast({
        title: 'Website saved',
        status: 'success',
        duration: TOAST_DURATION.MEDIUM,
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Could not save changes. Please try again.',
        status: 'error',
        duration: TOAST_DURATION.MEDIUM,
      });
    }
  };

  const tabStatus = {
    profile: {
      done: [
        formData.name,
        formData.description,
        formData.phone,
        formData.address,
        formData.city,
      ].filter(filled).length,
      total: 5,
    },
    branding: {
      done: [formData.logoUrl, formData.brandColor, formData.coverImageUrl].filter(filled).length,
      total: 3,
    },
    hours: { done: workingHours ? 1 : 0, total: 1 },
    about: { done: filled(formData.aboutContent) ? 1 : 0, total: 1 },
  };

  const isComplete = (k: TabKey) => tabStatus[k].done === tabStatus[k].total;

  const tabIndex = Math.max(0, TABS.findIndex((t) => t.key === activeTab));

  const handleTabsChange = (index: number) => {
    setActiveTab(TABS[index]?.key ?? 'profile');
  };

  const sectionCardProps = {
    bg: 'surface.card' as const,
    borderRadius: 'xl' as const,
    border: '1px solid' as const,
    borderColor: 'border.subtle' as const,
  };

  const headerActions = (
    <HStack
      spacing={3}
      align="center"
      flexWrap="wrap"
      justify="flex-end"
    >
      {hasChanges && (
        <Button variant="ghost" size="sm" onClick={handleDiscard} color="text.muted">
          Discard
        </Button>
      )}
      <Button
        colorScheme="brand"
        size="md"
        onClick={handleSave}
        isLoading={isUpdating}
        isDisabled={!hasChanges}
      >
        Save changes
      </Button>
    </HStack>
  );

  return (
    <Box mx="auto">
      <Box
        position="sticky"
        top={0}
        zIndex={1}
        bg="surface.page"
        mb={{ base: 4, md: 6 }}
        borderBottom="1px solid"
        borderColor="border.subtle"
      >
        <PageHeader
          title="Website"
          description="Build and customize your booking page"
          actions={headerActions}
        />
      </Box>

      <Tabs
        variant="enclosed"
        borderColor="border.strong"
        index={tabIndex}
        onChange={handleTabsChange}
      >
        <TabList flexWrap="wrap" gap={2}>
          {TABS.map((t) => {
            const complete = isComplete(t.key);
            const { done, total } = tabStatus[t.key];
            return (
              <Tab key={t.key} fontWeight="600">
                <HStack spacing={2}>
                  <Text as="span">{t.label}</Text>
                  {complete ? (
                    <Badge
                      bg="brand.50"
                      color="brand.700"
                      borderRadius="full"
                      px={2}
                      py={0.5}
                      display="inline-flex"
                      alignItems="center"
                      gap={1}
                      fontSize="xs"
                      fontWeight="600"
                    >
                      <CheckIcon size={12} aria-hidden />
                      {total}/{total}
                    </Badge>
                  ) : (
                    <Badge
                      variant="subtle"
                      colorScheme="gray"
                      borderRadius="full"
                      fontSize="xs"
                      fontWeight="600"
                    >
                      {done}/{total}
                    </Badge>
                  )}
                </HStack>
              </Tab>
            );
          })}
        </TabList>
        
        <SimpleGrid
          columns={desktopLayout ? 12 : 1}
          spacing={{ base: 4 }}
          alignItems="start"
        >
          <GridItem colSpan={desktopLayout ? 8 : 12}>
            <TabPanels>
              <TabPanel px={0}>
                <Box
                  {...sectionCardProps}
                  p={{ base: 4 }}
                >
                  <BusinessProfileFields
                    values={formData}
                    onChange={(name, value) => {
                      setFormData((prev) => ({ ...prev, [name]: value }));
                    }}
                  />
                </Box>
              </TabPanel>
              <TabPanel px={0}>
                <Box
                  {...sectionCardProps}
                  p={{ base: 4 }}
                >
                  <BrandingFields
                    logoUrl={formData.logoUrl}
                    brandColor={formData.brandColor}
                    onLogoUrlChange={(url) => {
                      setFormData((prev) => ({ ...prev, logoUrl: url }));
                    }}
                    onBrandColorChange={(color) => {
                      setFormData((prev) => ({ ...prev, brandColor: color }));
                    }}
                    coverImageUrl={formData.coverImageUrl}
                    onCoverImageUrlChange={(url) => {
                      setFormData((prev) => ({ ...prev, coverImageUrl: url }));
                    }}
                  />
                </Box>
              </TabPanel>
              <TabPanel px={0}>
                <Box
                  {...sectionCardProps}
                  p={{ base: 4 }}
                >
                  {workingHours && (
                    <WorkingHoursEditor defaultExpanded={true} value={workingHours} onChange={handleWorkingHoursChange} />
                  )}
                  {!workingHours && (
                    <Text color="text.muted" fontSize="sm">
                      Working hours are not configured yet.
                    </Text>
                  )}
                </Box>
              </TabPanel>
              <TabPanel px={0}>
                <Box
                  {...sectionCardProps}
                  p={{ base: 4 }}
                >
                  <AboutContentFields
                    value={formData.aboutContent}
                    onChange={(val) => {
                      setFormData((prev) => ({ ...prev, aboutContent: val }));
                    }}
                    brandColor={formData.brandColor}
                    businessName={formData.name}
                  />
                </Box>
              </TabPanel>
            </TabPanels>
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
              <WebsiteCompletionProgress
                business={business}
                onScrollToSection={handleScrollToSection}
              />
            </VStack>
          </GridItem>
        </SimpleGrid>
      </Tabs>
    </Box>
  );
}
