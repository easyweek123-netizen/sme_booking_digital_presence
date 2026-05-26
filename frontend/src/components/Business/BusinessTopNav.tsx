import { Box, HStack, Image, Text } from '@chakra-ui/react';
import type { Business } from '../../types';
import { BrandButton } from './brand';
import type { SectionTab } from './SectionTabs';
import { getInitials } from './utils';

interface BusinessTopNavProps {
  business: Business;
  visible: boolean;
  isDesktop: boolean;
  tabs: readonly SectionTab[];
  activeId: string;
  onSelect: (id: string) => void;
  onBookNow: () => void;
}

export function BusinessTopNav({
  business,
  visible,
  isDesktop,
  tabs,
  activeId,
  onSelect,
  onBookNow,
}: BusinessTopNavProps) {
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
      borderColor="gray.200"
    >
      <HStack
        maxW="1240px"
        mx="auto"
        px={isDesktop ? 12 : 4}
        py={isDesktop ? 0 : 3}
        minH={isDesktop ? '64px' : '60px'}
        justify="space-between"
        gap={3}
      >
        <HStack spacing={3} minW={0} flex="1">
          <Box
            w="36px"
            h="36px"
            borderRadius="full"
            overflow="hidden"
            flexShrink={0}
            bg="gray.100"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {business.logoUrl ? (
              <Image src={business.logoUrl} alt="" w="100%" h="100%" objectFit="cover" />
            ) : (
              <Text fontSize="13px" fontWeight={700} color="gray.500">
                {getInitials(business.name)}
              </Text>
            )}
          </Box>
          <Box minW={0}>
            <Text fontSize="sm" fontWeight={600} noOfLines={1}>
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
                  color={active ? 'gray.900' : 'gray.500'}
                  whiteSpace="nowrap"
                >
                  {tab.label}
                  {active && (
                    <Box
                      position="absolute"
                      left={0}
                      right={0}
                      bottom={0}
                      h="2px"
                      bg="gray.900"
                    />
                  )}
                </Box>
              );
            })}
          </HStack>
        )}
        <BrandButton size="sm" onClick={onBookNow}>
          Book now
        </BrandButton>
      </HStack>
    </Box>
  );
}
