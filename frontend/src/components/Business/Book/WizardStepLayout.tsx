import { Box, Grid, Heading, Text } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import type { Business } from '../../../types';
import { WizardTopBar } from './WizardTopBar';
import { WizardFooter } from './WizardFooter';
import { SummaryCard } from './SummaryCard';
import type { BookingState, BookingStep } from './bookingFlow.types';

interface WizardStepLayoutProps {
  business: Business;
  steps: readonly BookingStep[];
  currentIndex: number;
  state: BookingState;
  isDesktop: boolean;
  canContinue: boolean;
  submitting: boolean;
  continueLabel: string;
  children: ReactNode;
  onBack: () => void;
  onClose: () => void;
  onContinue: () => void;
  onCrumbJump: (idx: number) => void;
}

export function WizardStepLayout({
  business,
  steps,
  currentIndex,
  state,
  isDesktop,
  canContinue,
  submitting,
  continueLabel,
  children,
  onBack,
  onClose,
  onContinue,
  onCrumbJump,
}: WizardStepLayoutProps) {
  const current = steps[currentIndex];
  return (
    <Box display="flex" flexDirection="column" minH="100vh">
      <WizardTopBar
        steps={steps}
        currentIndex={currentIndex}
        isDesktop={isDesktop}
        onBack={onBack}
        onClose={onClose}
        onCrumbClick={onCrumbJump}
      />

      <Grid
        flex="1"
        templateColumns={{ base: '1fr', lg: 'minmax(0,1fr) 340px' }}
        gap={{ base: 0, lg: 8 }}
        maxW="1240px"
        w="100%"
        mx="auto"
        px={{ base: 4, lg: 12 }}
        pb={{ base: '220px', lg: '120px' }}
      >
        <Box pt={{ base: 4, lg: 6 }}>
          <Heading as="h1" size={{ base: 'lg', lg: 'xl' }} mb={current.subtitle ? 1 : 5}>
            {current.title}
          </Heading>
          {current.subtitle && (
            <Text color="gray.600" mb={5}>
              {current.subtitle}
            </Text>
          )}
          {children}
        </Box>

        {isDesktop && state.service && (
          <Box pt={{ lg: 6 }} pl={{ lg: 0 }}>
            <SummaryCard
              business={business}
              service={state.service}
              date={state.date}
              slot={state.slot}
              step={state.step}
            />
          </Box>
        )}
      </Grid>

      <WizardFooter
        service={state.service}
        step={state.step}
        canContinue={canContinue}
        loading={submitting}
        label={continueLabel}
        onContinue={onContinue}
      />
    </Box>
  );
}
