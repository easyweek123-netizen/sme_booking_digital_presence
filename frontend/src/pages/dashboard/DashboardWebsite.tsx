import { useBreakpointValue } from '@chakra-ui/react';
import { PageLoading } from '../../components/ui/states';
import { DashboardContentShell, DashboardFormActions, DashboardTabs } from '../../components/Dashboard';
import { WebsiteForm } from '../../components/Dashboard/website/WebsiteForm';
import { WebsiteFormDesktop } from '../../components/Dashboard/website/WebsiteFormDesktop';
import { WebsiteFormMobile } from '../../components/Dashboard/website/WebsiteFormMobile';
import { TabCompletionBadge } from '../../components/Dashboard/website/TabCompletionBadge';
import { useWebsiteFormSession } from '../../components/Dashboard/website/hooks';

export function DashboardWebsite() {
  const isDesktop = useBreakpointValue({ base: false, lg: true }, { ssr: false });
  const session = useWebsiteFormSession();
  if (session.isLoading) return <PageLoading variant="form" />;

  const Layout = isDesktop ? WebsiteFormDesktop : WebsiteFormMobile;

  return (
    <WebsiteForm session={session}>
      {({ methods, activeTab, setActiveTab, isSaving, onSave, resetToInitial, tabs }) => (
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
          tabs={
            <DashboardTabs
              tabs={tabs.map((t) => ({
                key: t.key,
                label: t.label,
                badge: <TabCompletionBadge tabKey={t.key} />,
              }))}
              activeKey={activeTab}
              onChange={setActiveTab}
            />
          }
        >
          <Layout activeTab={activeTab} business={session.business} />
        </DashboardContentShell>
      )}
    </WebsiteForm>
  );
}
