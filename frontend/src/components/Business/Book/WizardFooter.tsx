import { Box, Flex, Text } from '@chakra-ui/react';
import { ArrowRightIcon } from '../../icons';
import { BrandButton } from '../brand';
import { formatPrice } from '../utils';
import type { Service } from '../../../types';

interface WizardFooterProps {
  service: Service | null;
  step: number;
  canContinue: boolean;
  loading: boolean;
  label: string;
  onContinue: () => void;
}

export function WizardFooter({
  service,
  step,
  canContinue,
  loading,
  label,
  onContinue,
}: WizardFooterProps) {
  return (
    <Box
      position="fixed"
      left={0}
      right={0}
      bottom={0}
      zIndex={10}
      bg="whiteAlpha.900"
      backdropFilter="blur(10px)"
      borderTop="1px solid"
      borderColor="border.subtle"
      px={{ base: 4, lg: 12 }}
      py={3}
    >
      <Flex maxW="1240px" mx="auto" align="center" justify="space-between" gap={4}>
        <Box>
          {service ? (
            <>
              <Text fontSize="12px" color="text.muted">
                {step === 1 ? 'Selected' : 'Total'}
              </Text>
              <Text fontSize="lg" fontWeight={700} color="text.heading">
                {formatPrice(service)}
              </Text>
            </>
          ) : (
            <Text fontSize="13px" color="text.muted">
              Select a service to continue
            </Text>
          )}
        </Box>
        <BrandButton
          size="lg"
          onClick={onContinue}
          isDisabled={!canContinue || loading}
          isLoading={loading}
          rightIcon={!loading ? <ArrowRightIcon size={16} /> : undefined}
        >
          {label}
        </BrandButton>
      </Flex>
    </Box>
  );
}
