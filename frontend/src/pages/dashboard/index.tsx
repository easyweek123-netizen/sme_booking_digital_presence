import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout, BusinessGate } from '../../components/Dashboard';
import { BusinessProvider } from '../../contexts/BusinessContext';
import { ROUTES } from '../../config/routes';

import { DashboardOverview } from './DashboardOverview';
import { CanvasChat } from './CanvasChat';
import { DashboardBookings } from './DashboardBookings';
import { DashboardClients } from './DashboardClients';
import { DashboardServices } from './DashboardServices';
import { DashboardWebsite } from './DashboardWebsite';

function DashboardRoutes() {
  return (
    <Routes>
      <Route path="canvas" element={<CanvasChat />} />
      <Route index element={<DashboardOverview />} />
      <Route path="bookings" element={<DashboardBookings />} />
      <Route path="clients" element={<DashboardClients />} />
      <Route path="services" element={<DashboardServices />} />
      <Route path="website" element={<DashboardWebsite />} />
      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD.ROOT} replace />} />
    </Routes>
  );
}

export function DashboardPage() {
  return (
    <BusinessProvider>
      <DashboardLayout>
        <BusinessGate>
          <DashboardRoutes />
        </BusinessGate>
      </DashboardLayout>
    </BusinessProvider>
  );
}
