import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Spinner, Center } from '@chakra-ui/react';
import { ROUTES } from './config/routes';
import { ProtectedRoute } from './components/auth';

// Lazy load pages for code splitting
const LandingPage = lazy(() => import('./pages/landing').then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('./pages/login').then(m => ({ default: m.LoginPage })));
const OnboardingPage = lazy(() => import('./pages/onboarding').then(m => ({ default: m.OnboardingPage })));
const DashboardPage = lazy(() => import('./pages/dashboard').then(m => ({ default: m.DashboardPage })));
const BookingPage = lazy(() => import('./pages/booking').then(m => ({ default: m.BookingPage })));
const PricingPage = lazy(() => import('./pages/pricing').then(m => ({ default: m.PricingPage })));

// Loading fallback component
function PageLoader() {
  return (
    <Center h="100vh">
      <Spinner size="xl" color="brand.500" thickness="4px" />
    </Center>
  );
}

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route path={ROUTES.HOME} element={<LandingPage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.ONBOARDING} element={<OnboardingPage />} />
        <Route path={ROUTES.PRICING} element={<PricingPage />} />
        <Route path={ROUTES.BOOKING.PATTERN} element={<BookingPage />} />
        
        {/* Protected routes */}
        <Route
          path={`${ROUTES.DASHBOARD.ROOT}/*`}
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default App;
