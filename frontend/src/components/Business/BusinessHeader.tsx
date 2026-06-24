import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import type { BusinessWithServices } from '../../types';
import { getInitials } from './utils';
import { SmartImage } from '../ui/SmartImage';
import { useDeviceMode } from './context/DeviceModeContext';

interface BusinessHeaderProps {
  business: BusinessWithServices;
}

export function BusinessHeader({
  business,
}: BusinessHeaderProps) {
  const isDesktop = useDeviceMode();
  const avatarSize = '86px';
  return (
    <Flex
      align="center"
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

      <Box flex="1" minW={0} w="100%">
        <Flex justifyContent="space-between">
          <Heading
            as="h4"
            fontWeight={600}
            m={0}
            // lineHeight={1.4}
            color="text.heading"
            flex={1}
          >
            {business.name}
          </Heading>
        </Flex>
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
  );
}
