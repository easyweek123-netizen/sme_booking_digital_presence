import { useBreakpointValue } from '@chakra-ui/react';
import { DashboardContentShell, DashboardTabs, DashboardFormActions } from '../../Dashboard';
import { WebsiteForm } from './WebsiteForm';
import { WebsiteFormDesktop } from './WebsiteFormDesktop';
import { WebsiteFormMobile } from './WebsiteFormMobile';
import { TabCompletionBadge } from './TabCompletionBadge';
import { useWebsiteTabStatus } from './hooks';
import type { BusinessWithServices, AvailabilityInput } from '../../../types';
import type { DashboardTabSpec } from '../DashboardTabs';
import type { WebsiteTabKey } from './websiteTabs';

interface WebsiteFormContainerProps {
  business: BusinessWithServices;
  initialAvailability: AvailabilityInput[];
  /** Optional override (legacy `DashboardWebsite` prop). Defaults to viewport-derived. */
  isDesktop?: boolean;
}

export function WebsiteFormContainer({
  business,
  initialAvailability,
  isDesktop,
}: WebsiteFormContainerProps) {
  const viewportLgUp = useBreakpointValue({ base: false, lg: true }, { ssr: false }) ?? false;
  const desktopLayout = typeof isDesktop === 'boolean' ? isDesktop : viewportLgUp;

  return (
    <WebsiteForm business={business} initialAvailability={initialAvailability}>
      {({ methods, activeTab, setActiveTab, isSaving, onSave, resetToInitial, tabs }) => {
        const status = useWebsiteTabStatus(methods);
        const tabSpecs: ReadonlyArray<DashboardTabSpec<WebsiteTabKey>> = tabs.map((t) => ({
          key: t.key,
          label: t.label,
          badge: <TabCompletionBadge done={status[t.key].done} total={status[t.key].total} />,
        }));

        return (
          <DashboardContentShell
            title="Website"
            description="Build and customize your booking page"
            actions={
              <DashboardFormActions
                isDirty={methods.formState.isDirty}
                isSaving={isSaving}
                onSave={onSave}
                onDiscard={resetToInitial}
              />
            }
            tabs={<DashboardTabs tabs={tabSpecs} activeKey={activeTab} onChange={setActiveTab} />}
          >
            {desktopLayout ? (
              <WebsiteFormDesktop activeTab={activeTab} business={business} />
            ) : (
              <WebsiteFormMobile activeTab={activeTab} />
            )}
          </DashboardContentShell>
        );
      }}
    </WebsiteForm>
  );
}
