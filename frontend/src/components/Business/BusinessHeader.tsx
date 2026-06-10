import { Box, Flex, HStack, Heading, Text } from '@chakra-ui/react';
import { BrandButton } from './brand';
import type { BusinessWithServices } from '../../types';
import type { OpenStatus } from './utils';
import { getInitials } from './utils';
import { NextAvailablePill } from './sections/NextAvailablePill';
import { ChannelChipRow } from './sections/ChannelChipRow';
import { SmartImage } from '../ui/SmartImage';
import { useDeviceMode } from './context/DeviceModeContext';

interface BusinessHeaderProps {
  business: BusinessWithServices;
  status: OpenStatus;
  businessType?: string;
  onBookNow: () => void;
}

export function BusinessHeader({
  business,
  status,
  onBookNow,
}: BusinessHeaderProps) {
  const isDesktop = useDeviceMode();
  const avatarSize = isDesktop ? '144px' : '104px';

  return (
    <Flex direction="column" gap={2} px={4}>
      <Flex
        align="flex-start"
        gap={isDesktop ? 4 : 2}
      >
        <Box
          w={avatarSize}
          borderRadius="lg"
          border="4px solid"
          borderColor="surface.card"
          bg="surface.muted"
          boxShadow="md"
          overflow="hidden"
          flexShrink={0}
        >
          <SmartImage
            src={business.logoUrl}
            alt={business.name}
            ratio={1}
            borderRadius="lg"
            eager
            fallback={
              <Box
                w="100%"
                h="100%"
                bg="surface.muted"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text
                  fontSize={isDesktop ? '40px' : '32px'}
                  fontWeight={700}
                  color="text.muted"
                  letterSpacing="-0.02em"
                >
                  {getInitials(business.name)}
                </Text>
              </Box>
            }
          />
        </Box>

        <Box flex="1" minW={0} w="100%" pt={4}>
          <Heading
            as="h1"
            fontWeight={700}
            letterSpacing="-0.025em"
            m={0}
            lineHeight={1.4}
            color="text.heading"
          >
            {business.name}
          </Heading>
          {business.description && (
            <Text
              fontSize={isDesktop ? 'md' : 'sm'}
              color="text.secondary"
            >
              {business.description}
            </Text>
          )}
        </Box>
      </Flex>
      <Flex direction={isDesktop ? "row" : "column"} gap={2}>
        {!isDesktop && <HStack flexWrap="wrap">
          {business.showNextAvailable ? (
            <NextAvailablePill business={business} status={status} />
          ) : null}
        </HStack>}

        <ChannelChipRow locations={business.locations} />
      </Flex>

      {!isDesktop && (
        <Box mt={4}>
          <BrandButton size="lg" w="100%" onClick={onBookNow}>
            Book now
          </BrandButton>
        </Box>
      )}
    </Flex>
  );
}
