import { Box, Container, SimpleGrid, GridItem, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { WizardStepIndicator } from './wizard/WizardStepIndicator';
import { ServiceStep } from './wizard/ServiceStep';
import { DateTimeStep } from './wizard/DateTimeStep';
import { BookingSummarySidebar } from './wizard/BookingSummarySidebar';
import { BookingSuccess } from '../../../components/Booking/BookingSuccess';
import { BusinessDetailsSections } from './wizard/BusinessDetailsSections';
import { SelectOptionModal } from './wizard/SelectOptionModal';
import { FullScreenWizardOverlay } from './wizard/FullScreenWizardOverlay';
import { AuthModal } from './wizard/AuthModal';
import type { BusinessWithServices } from '../../../types';
import type { BookingWizardState } from './wizard/useBookingWizard';

interface Props {
  business: BusinessWithServices;
  wizard: BookingWizardState;
  /** From viewport `lg` or canvas preview container width. */
  desktopLayout: boolean;
  isPreview: boolean;
}

export function BookingWizard(props: Props) {
  const { business, wizard, desktopLayout } = props;
  const services = (business.services || []).filter((s) => s.isActive);
  const [bookingFlowState, setBookingFlowState] = useState<'profile' | 'select-option' | 'wizard'>('profile');
  const [isAuthOpen, setAuthOpen] = useState(false);

  const handleSidebarContinue = () => {
    if (wizard.step === 1) {
      if (wizard.selectedService) {
        setBookingFlowState('wizard');
      } else {
        setBookingFlowState('select-option');
      }
    } else if (wizard.step === 2) {
      setAuthOpen(true);
    } else {
      wizard.handleContinue();
    }
  };

  const handleAuthSuccess = async (email: string, name: string) => {
    await wizard.handleVerified({ email } as any, name);
  };

  // SUCCESS SCREEN MODE (NO CLUTTER, NO SIDEBAR, NO DETAILS)
  if (wizard.createdBooking && wizard.selectedService) {
    return (
      <Box as="section" bg="white" minH="100vh" py={12}>
        <Container maxW="container.md">
          <BookingSuccess
            booking={wizard.createdBooking}
            service={wizard.selectedService}
            business={business}
            onBookAnother={wizard.handleBookAnother}
            onClose={wizard.handleBookAnother}
          />
        </Container>
      </Box>
    );
  }

  // FULL-SCREEN WIZARD FLOW OVERLAY MODE
  if (bookingFlowState === 'wizard') {
    return (
      <>
        <FullScreenWizardOverlay
          business={business}
          wizard={wizard}
          onBack={() => setBookingFlowState('select-option')}
          onClose={() => setBookingFlowState('profile')}
          onContinueToAuth={() => setAuthOpen(true)}
        />
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setAuthOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      </>
    );
  }

  return (
    <Box as="section" bg="white">
      <Container maxW="container.xl" px={{ base: 4 }} py={{ base: 6 }}>
        <WizardStepIndicator
          currentStep={wizard.step}
          onStepClick={wizard.setStep}
          canGoTo={wizard.canGoTo}
        />
        <SimpleGrid
          columns={desktopLayout ? 12 : 1}
          spacing={{ base: 4, lg: 8 }}
          alignItems="start"
        >
          <GridItem colSpan={desktopLayout ? 8 : 12}>
            {wizard.step === 1 && (
              <VStack spacing={10} align="stretch">
                <ServiceStep
                  services={services}
                  selectedServiceId={wizard.selectedService?.id ?? null}
                  onSelectService={wizard.handleSelectService}
                  selectedCategoryId={wizard.selectedCategoryId}
                  onSelectCategory={wizard.setSelectedCategoryId}
                />
                <BusinessDetailsSections business={business} />
              </VStack>
            )}
            {wizard.step === 2 && wizard.selectedService && (
              <DateTimeStep
                business={business}
                service={wizard.selectedService}
                selectedDate={wizard.selectedDate}
                onDateChange={wizard.handleDateChange}
                selectedTime={wizard.selectedTime}
                onSelectTime={wizard.handleSelectTime}
              />
            )}
            {/* {wizard.step === 4 && wizard.createdBooking && wizard.selectedService && (
              <BookingSuccess
                booking={wizard.createdBooking}
                service={wizard.selectedService}
                business={business}
                onBookAnother={wizard.handleBookAnother}
                onClose={wizard.handleBookAnother}
              /> */}
          </GridItem>

          <GridItem colSpan={desktopLayout ? 4 : 12} display={desktopLayout ? 'block' : 'none'}>
            <BookingSummarySidebar
              business={business}
              step={wizard.step}
              selectedService={wizard.selectedService}
              selectedDate={wizard.selectedDate}
              selectedTime={wizard.selectedTime}
              customerName={wizard.customerName}
              customerEmail={wizard.customerEmail}
              canContinue={wizard.canContinue}
              onContinue={handleSidebarContinue}
            />
          </GridItem>
        </SimpleGrid>
      </Container>

      {/* Select Option Overlay Sheet */}
      <SelectOptionModal
        isOpen={bookingFlowState === 'select-option'}
        onClose={() => setBookingFlowState('profile')}
        onSelectAppointment={() => setBookingFlowState('wizard')}
        hasSelectedService={true} // always allow transitioning to full screen selector to choose services!
      />

      {/* Centered Auth Login Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </Box>
  );
}
