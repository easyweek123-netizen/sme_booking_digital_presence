import { Box, Flex, HStack, Heading, Image, Text } from '@chakra-ui/react';
import { ClockIcon, MapPinIcon, ShareIcon, HeartIcon } from '../icons';
import { RoundIconButton } from './atoms';
import { BrandButton } from './brand';
import type { Business } from '../../types';
import type { OpenStatus } from './utils';
import { getInitials } from './utils';

interface BusinessHeaderProps {
  business: Business;
  status: OpenStatus;
  isDesktop: boolean;
  businessType?: string;
  coverEnabled: boolean;
  onBookNow: () => void;
}

export function BusinessHeader({
  business,
  status,
  isDesktop,
  businessType,
  coverEnabled,
  onBookNow,
}: BusinessHeaderProps) {
  const avatarSize = isDesktop ? '144px' : '104px';
  const overlap = coverEnabled ? (isDesktop ? '-64px' : '-52px') : '0';

  return (
    <Flex
      direction={isDesktop ? 'row' : 'column'}
      align={isDesktop ? 'flex-end' : 'flex-start'}
      gap={isDesktop ? 6 : 3}
      position="relative"
      mt={overlap}
    >
      <Box
        w={avatarSize}
        h={avatarSize}
        borderRadius="full"
        border="4px solid white"
        bg="gray.100"
        boxShadow="md"
        overflow="hidden"
        flexShrink={0}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {business.logoUrl ? (
          <Image src={business.logoUrl} alt="" w="100%" h="100%" objectFit="cover" />
        ) : (
          <Text
            fontSize={isDesktop ? '40px' : '32px'}
            fontWeight={700}
            color="gray.500"
            letterSpacing="-0.02em"
          >
            {getInitials(business.name)}
          </Text>
        )}
      </Box>

      <Box flex="1" minW={0} pb={isDesktop ? 2 : 0} w="100%">
        <Flex align="flex-start" justify="space-between" gap={4} flexWrap="nowrap">
          <Box minW={0} flex="1">
            <Heading
              as="h1"
              fontSize={isDesktop ? '36px' : '24px'}
              fontWeight={700}
              letterSpacing="-0.025em"
              m={0}
              lineHeight={1.1}
              color="gray.900"
            >
              {business.name}
            </Heading>
            <HStack mt={2.5} fontSize="sm" color="gray.700" flexWrap="wrap" spacing={2.5}>
              <HStack as="span" spacing={1.5} color={status.open ? 'green.600' : 'orange.500'} fontWeight={500}>
                <ClockIcon size={14} />
                <Text as="span">{status.line}</Text>
              </HStack>
              {(business.address || business.city) && (
                <>
                  <Text as="span" color="gray.300">·</Text>
                  <HStack as="span" spacing={1.5}>
                    <MapPinIcon size={14} />
                    <Text as="span">
                      {[business.address, business.city].filter(Boolean).join(', ')}
                    </Text>
                  </HStack>
                </>
              )}
            </HStack>
            {businessType && (
              <Box mt={2.5}>
                <Text
                  as="span"
                  display="inline-flex"
                  px={2.5}
                  py={1}
                  bg="gray.100"
                  borderRadius="full"
                  color="gray.700"
                  fontWeight={500}
                  fontSize="13px"
                >
                  {businessType}
                </Text>
              </Box>
            )}
          </Box>

          {/* <HStack spacing={2} flexShrink={0} align="center">
            {isDesktop ? (
              <>
                <BrandButton brandVariant="outline" size="md" leftIcon={<ShareIcon size={16} />}>
                  Share
                </BrandButton>
                <BrandButton brandVariant="outline" size="md" leftIcon={<HeartIcon size={16} />}>
                  Save
                </BrandButton>
              </>
            ) : (
              <>
                <RoundIconButton aria-label="Share" icon={<ShareIcon size={16} />} size="sm" />
                <RoundIconButton aria-label="Save" icon={<HeartIcon size={16} />} size="sm" />
              </>
            )}
          </HStack> */}
        </Flex>

        {!isDesktop && (
          <Box mt={4}>
            <BrandButton size="lg" w="100%" onClick={onBookNow}>
              Book now
            </BrandButton>
          </Box>
        )}
      </Box>
    </Flex>
  );
}
