import { useBreakpointValue } from '@chakra-ui/react';
import type { Business, Service, ServiceCategory } from '../../../types';
import { BrandProvider } from '../brand';
import { WizardStepLayout } from './WizardStepLayout';
import { SuccessStep } from './steps/SuccessStep';
import { useBookingFlow } from './hooks/useBookingFlow';
import { BOOKING_STEPS } from './bookingSteps';

interface BookingWizardProps {
  business: Business;
  services: Service[];
  categories: ServiceCategory[];
  initialService?: Service | null;
  isAuthenticated: boolean;
  userEmail?: string | null;
  signingIn?: boolean;
  onSignIn: () => void;
  onSubmit: (payload: { service: Service; date: Date; slot: string }) => Promise<void> | void;
  onClose: () => void;
}

export function BookingWizard({
  business,
  services,
  categories,
  initialService = null,
  isAuthenticated,
  userEmail,
  signingIn,
  onSignIn,
  onSubmit,
  onClose,
}: BookingWizardProps) {
  const isDesktop = useBreakpointValue({ base: false, lg: true }) ?? false;
  const flow = useBookingFlow({ initialService, steps: BOOKING_STEPS, onSubmit });
  const { state } = flow;

  if (state.succeeded && state.service && state.slot) {
    return (
      <BrandProvider brandColor={business.brandColor} bg="white" minH="100vh">
        <SuccessStep
          business={business}
          service={state.service}
          date={state.date}
          slot={state.slot}
          isDesktop={isDesktop}
          onDone={onClose}
        />
      </BrandProvider>
    );
  }

  const currentStep = BOOKING_STEPS[state.step - 1];
  const StepComponent = currentStep.Component;
  const canContinue = currentStep.isComplete(state);

  return (
    <BrandProvider brandColor={business.brandColor} bg="white" minH="100vh">
      <WizardStepLayout
        business={business}
        steps={BOOKING_STEPS}
        currentIndex={state.step - 1}
        state={state}
        isDesktop={isDesktop}
        canContinue={canContinue}
        submitting={state.submitting}
        continueLabel={currentStep.continueLabel?.(state) ?? 'Continue'}
        onBack={state.step === 1 ? onClose : flow.goBack}
        onClose={onClose}
        onContinue={flow.goNext}
        onCrumbJump={(idx) => {
          if (idx >= state.step - 1) return;
          const allComplete = BOOKING_STEPS.slice(0, idx).every((s) => s.isComplete(state));
          if (!allComplete) return;
          for (let i = 0; i < state.step - 1 - idx; i++) flow.goBack();
        }}
      >
        <StepComponent
          flow={flow}
          business={business}
          services={services}
          categories={categories}
          isDesktop={isDesktop}
          isAuthenticated={isAuthenticated}
          userEmail={userEmail}
          signingIn={signingIn}
          onSignIn={onSignIn}
        />
      </WizardStepLayout>
    </BrandProvider>
  );
}
