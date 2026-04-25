import { Box, Flex, Text, Button } from '@chakra-ui/react';
import { Fragment } from 'react';
import { CheckIcon } from '../../../../components/icons';

const STEPS = [
  { n: 1, label: 'Service' },
  { n: 2, label: 'Date & time' },
  { n: 3, label: 'Your details' },
  { n: 4, label: 'Confirm' },
] as const;

interface Props {
  currentStep: 1 | 2 | 3 | 4;
  onStepClick: (n: 1 | 2 | 3 | 4) => void;
  canGoTo: (n: 1 | 2 | 3 | 4) => boolean;
}

export function WizardStepIndicator({ currentStep, onStepClick, canGoTo }: Props) {
  const activeSummary = STEPS[currentStep - 1]?.label ?? '';

  return (
    <Box mb={{ base: 6, md: 8 }} w="100%">
      <Flex as="nav" aria-label="Booking steps" align="center" w="100%">
        {STEPS.map((s, idx) => {
          const isCompleted = s.n < currentStep;
          const isActive = s.n === currentStep;
          const clickable = canGoTo(s.n as 1 | 2 | 3 | 4);
          const segmentToLeftIsProgress = idx > 0 && currentStep > STEPS[idx - 1].n;

          return (
            <Fragment key={s.n}>
              {idx > 0 && (
                <Box
                  flex={1}
                  h="1px"
                  minW={{ base: 2, md: 3 }}
                  bg={segmentToLeftIsProgress ? 'gray.800' : 'border.subtle'}
                  alignSelf="center"
                  aria-hidden
                />
              )}
              <Button
                variant="unstyled"
                display="inline-flex"
                alignItems="center"
                gap={2}
                flexShrink={0}
                onClick={() => clickable && onStepClick(s.n as 1 | 2 | 3 | 4)}
                cursor={clickable ? 'pointer' : 'default'}
                opacity={clickable || isActive || isCompleted ? 1 : 0.6}
                h="auto"
                p={0}
                aria-current={isActive ? 'step' : undefined}
                aria-label={`${s.label}, step ${s.n} of 4`}
              >
                <Box
                  w="28px"
                  h="28px"
                  borderRadius="full"
                  display="inline-flex"
                  alignItems="center"
                  justifyContent="center"
                  bg={isCompleted ? 'brand.500' : isActive ? 'gray.800' : 'surface.card'}
                  color={isCompleted || isActive ? 'white' : 'text.muted'}
                  border="1px solid"
                  borderColor={isCompleted ? 'brand.500' : isActive ? 'gray.800' : 'border.subtle'}
                  fontSize="sm"
                  fontWeight="600"
                >
                  {isCompleted ? <CheckIcon size={14} /> : s.n}
                </Box>
                <Text
                  display={{ base: 'none', md: 'inline' }}
                  fontSize="md"
                  fontWeight={isActive ? '600' : '500'}
                  color={
                    isActive ? 'text.heading' : isCompleted ? 'text.primary' : 'text.muted'
                  }
                >
                  {s.label}
                </Text>
              </Button>
            </Fragment>
          );
        })}
      </Flex>

      <Text
        display={{ base: 'block', md: 'none' }}
        textAlign="center"
        fontSize="sm"
        color="text.muted"
        mt={3}
        fontWeight="500"
        aria-live="polite"
      >
        Step {currentStep} of 4 · {activeSummary}
      </Text>
    </Box>
  );
}
