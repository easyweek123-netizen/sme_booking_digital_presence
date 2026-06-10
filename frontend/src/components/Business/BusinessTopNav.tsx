import { Box, HStack, Text } from '@chakra-ui/react';
import type { Business } from '../../types';
import { BrandButton } from './brand';
import type { SectionTab } from './SectionTabs';
import { getInitials } from './utils';
import { SmartImage } from '../ui/SmartImage';
import { BusinessPageContainer } from './atoms/BusinessPageContainer';
import { useDeviceMode } from './context/DeviceModeContext';

interface BusinessTopNavProps {
  business: Business;
  visible: boolean;
  tabs: readonly SectionTab[];
  activeId: string;
  onSelect: (id: string) => void;
  onBookNow: () => void;
}

export function BusinessTopNav({
  business,
  visible,
  tabs,
  activeId,
  onSelect,
  onBookNow,
}: BusinessTopNavProps) {
  const isDesktop = useDeviceMode();
  if (!visible) return null;

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={30}
      bg="whiteAlpha.900"
      backdropFilter="blur(10px)"
      borderBottom="1px solid"
      borderColor="border.subtle"
    >
      <BusinessPageContainer
        as={HStack}
        py={isDesktop ? 0 : 3}
        minH={isDesktop ? '64px' : '60px'}
        justifyContent="space-between"
        gap={3}
      >
        <HStack spacing={3} minW={0} flex="1">
          <Box w="36px" h="36px" borderRadius="full" overflow="hidden" flexShrink={0}>
            <SmartImage
              src={business.logoUrl}
              alt=""
              ratio={1}
              borderRadius="full"
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
                  <Text fontSize="13px" fontWeight={700} color="text.muted">
                    {getInitials(business.name)}
                  </Text>
                </Box>
              }
            />
          </Box>
          <Box minW={0}>
            <Text fontSize="sm" fontWeight={600} noOfLines={1} color="text.heading">
              {business.name}
            </Text>
          </Box>
        </HStack>

        {isDesktop && (
          <HStack spacing={6} overflowX="auto">
            {tabs.map((tab) => {
              const active = tab.id === activeId;
              return (
                <Box
                  key={tab.id}
                  as="button"
                  onClick={() => onSelect(tab.id)}
                  py={4}
                  px={0.5}
                  position="relative"
                  fontSize="sm"
                  fontWeight={active ? 600 : 500}
                  color={active ? 'text.heading' : 'text.muted'}
                  whiteSpace="nowrap"
                >
                  {tab.label}
                  {active && (
                    <Box position="absolute" left={0} right={0} bottom={0} h="2px" bg="text.heading" />
                  )}
                </Box>
              );
            })}
          </HStack>
        )}

        <BrandButton size="sm" onClick={onBookNow}>
          Book now
        </BrandButton>
      </BusinessPageContainer>
    </Box>
  );
}
