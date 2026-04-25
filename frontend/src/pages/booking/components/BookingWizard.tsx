import { Box, Container, SimpleGrid, GridItem } from '@chakra-ui/react';
import { WizardStepIndicator } from './wizard/WizardStepIndicator';
import { ServiceStep } from './wizard/ServiceStep';
import { DateTimeStep } from './wizard/DateTimeStep';
import { DetailsStep } from './wizard/DetailsStep';
import { ConfirmStep } from './wizard/ConfirmStep';
import { BookingSummarySidebar } from './wizard/BookingSummarySidebar';
import type { BusinessWithServices } from '../../../types';
import type { BookingWizardState } from './wizard/useBookingWizard';

interface Props {
  business: BusinessWithServices;
  wizard: BookingWizardState;
  /** From viewport `lg` or canvas preview container width. */
  desktopLayout: boolean;
}

export function BookingWizard({ business, wizard, desktopLayout }: Props) {
  const services = (business.services || []).filter((s) => s.isActive);

  return (
    <Box as="section" bg="surface.page">
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
              <ServiceStep
                services={services}
                selectedServiceId={wizard.selectedService?.id ?? null}
                onSelectService={wizard.handleSelectService}
                selectedCategoryId={wizard.selectedCategoryId}
                onSelectCategory={wizard.setSelectedCategoryId}
              />
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
            {wizard.step === 3 && (
              <DetailsStep
                businessName={business.name}
                isSubmitting={wizard.isCreating}
                onVerified={wizard.handleVerified}
                onError={wizard.handleVerificationError}
              />
            )}
            {wizard.step === 4 && wizard.createdBooking && wizard.selectedService && (
              <ConfirmStep
                booking={wizard.createdBooking}
                service={wizard.selectedService}
                business={business}
                onBookAnother={wizard.handleBookAnother}
                onClose={wizard.handleBookAnother}
              />
            )}
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
              onContinue={wizard.handleContinue}
            />
          </GridItem>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
