import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/Dashboard';
import { BusinessProvider } from '../../contexts/business';
import { ROUTES } from '../../config/routes';

import { DashboardOverview } from './DashboardOverview';
import { CanvasChat } from './CanvasChat';
import { DashboardBookings } from './DashboardBookings';
import { DashboardClients } from './DashboardClients';
import { DashboardServices } from './DashboardServices';
import { ServicePage } from './ServicePage';
import { DashboardWebsite } from './DashboardWebsite';
import { SettingsLayout } from './settings';
import { Billing } from './settings/Billing';
import { Checkout } from './settings/Checkout';
import { Calendar } from './settings/Calendar';

function DashboardRoutes() {
  return (
    <Routes>
      <Route path="canvas" element={<CanvasChat />} />
      <Route index element={<DashboardOverview />} />
      <Route path="bookings" element={<DashboardBookings />} />
      <Route path="clients" element={<DashboardClients />} />
      <Route path="services" element={<DashboardServices />} />
      <Route path="services/create" element={<ServicePage isEdit={false} />} />
      <Route path="services/:id/edit" element={<ServicePage isEdit />} />
      <Route path="website" element={<DashboardWebsite />} />
      <Route path="settings" element={<SettingsLayout />}>
        <Route index element={<Navigate to="calendar" replace />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="billing" element={<Billing />} />
        <Route path="checkout" element={<Checkout />} />
      </Route>
      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD.ROOT} replace />} />
    </Routes>
  );
}

export function DashboardPage() {
  return (
    <BusinessProvider>
      <DashboardLayout>
        <DashboardRoutes />
      </DashboardLayout>
    </BusinessProvider>
  );
}
