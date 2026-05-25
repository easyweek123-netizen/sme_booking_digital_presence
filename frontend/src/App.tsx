import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Spinner, Center } from '@chakra-ui/react';
import { ROUTES } from './config/routes';
import { ProtectedRoute } from './components/auth';
import { PublicLayout, ScrollToTop } from './components/Layout';
import { GlobalModals } from './components/GlobalModals';

// Lazy load pages for code splitting
const LandingPage = lazy(() => import('./pages/landing').then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('./pages/login').then(m => ({ default: m.LoginPage })));
const OnboardingPage = lazy(() => import('./pages/onboarding').then(m => ({ default: m.OnboardingPage })));
const OnboardingV2Page = lazy(() =>
  import('./pages/onboardingV2').then((m) => ({ default: m.OnboardingV2Page })),
);

const USE_ONBOARDING_V2 = import.meta.env.VITE_USE_ONBOARDING_V2 === 'true';
const DashboardPage = lazy(() => import('./pages/dashboard').then(m => ({ default: m.DashboardPage })));
const PricingPage = lazy(() => import('./pages/pricing').then(m => ({ default: m.PricingPage })));
const ServicesPage = lazy(() => import('./pages/services').then(m => ({ default: m.ServicesPage })));
const PrivacyPolicy = lazy(() => import('./pages/legal').then(m => ({ default: m.PrivacyPolicy })));
const TermsOfService = lazy(() => import('./pages/legal').then(m => ({ default: m.TermsOfService })));
const Impressum = lazy(() => import('./pages/legal').then(m => ({ default: m.Impressum })));
const BookingPage = lazy(() => import('./pages/booking').then(m => ({ default: m.BookingPage })));
// Loading fallback component
function PageLoader() {
  return (
    <Center h="100vh">
      <Spinner size="xl" color="accent.primary" thickness="4px" />
    </Center>
  );
}
function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ScrollToTop />
      <GlobalModals />
      <Routes>
        {/* Standalone Login & Onboarding pages — full screen, no public header/footer */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route
          path={ROUTES.ONBOARDING}
          element={USE_ONBOARDING_V2 ? <OnboardingV2Page /> : <OnboardingPage />}
        />
        <Route path={ROUTES.BOOKING.PATTERN} element={<BookingPage />} />

        {/* Public routes with consistent header */}
        <Route element={<PublicLayout />}>
          <Route path={ROUTES.HOME} element={<LandingPage />} />
          <Route path={ROUTES.PRICING} element={<PricingPage />} />
          <Route path={ROUTES.SERVICES} element={<ServicesPage />} />
          <Route path={ROUTES.PRIVACY} element={<PrivacyPolicy />} />
          <Route path={ROUTES.TERMS} element={<TermsOfService />} />
          <Route path={ROUTES.IMPRESSUM} element={<Impressum />} />
        </Route>

{/* Protected routes - Dashboard has its own layout */}
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
