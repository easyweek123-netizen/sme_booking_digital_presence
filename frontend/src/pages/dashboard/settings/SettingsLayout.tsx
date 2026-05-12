import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../config/routes';
import {
  DashboardContentShell,
  DashboardTabs,
  type DashboardTabSpec,
} from '../../../components/Dashboard';

type SettingsTabKey = 'calendar' | 'billing';

const TAB_PATH: Partial<Record<SettingsTabKey, string>> = {
  calendar: ROUTES.DASHBOARD.SETTINGS_CALENDAR,
  billing: ROUTES.DASHBOARD.SETTINGS_BILLING,
};

const SETTINGS_TABS: ReadonlyArray<DashboardTabSpec<SettingsTabKey>> = [
  { key: 'calendar', label: 'Calendar' },
  { key: 'billing', label: 'Billing' },
];

export function SettingsLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const activeKey: SettingsTabKey =
    SETTINGS_TABS.find((t) => {
      const path = TAB_PATH[t.key];
      return !!path && location.pathname.startsWith(path);
    })?.key ?? 'calendar';

  const handleChange = (key: SettingsTabKey) => {
    const path = TAB_PATH[key];
    if (path) navigate(path);
  };

  return (
    <DashboardContentShell
      title="Settings"
      description="Manage your billing and account preferences."
      tabs={
        <DashboardTabs
          tabs={SETTINGS_TABS}
          activeKey={activeKey}
          onChange={handleChange}
        />
      }
    >
      <Outlet />
    </DashboardContentShell>
  );
}
