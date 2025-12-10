import { Box, Button, ButtonGroup, Container } from '@chakra-ui/react';

export type TabId = 'services' | 'about';

interface BookingTabsProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  brandColor?: string | null;
}

export function BookingTabs({ activeTab, onTabChange, brandColor }: BookingTabsProps) {
  const tabs: { id: TabId; label: string }[] = [
    { id: 'services', label: 'Services' },
    { id: 'about', label: 'About' },
  ];

  return (
    <Box 
      bg="white" 
      borderBottom="1px" 
      borderColor="gray.100"
      position="sticky"
      top={0}
      zIndex={10}
      py={3}
      px={4}
    >
      <Container maxW="lg" px={0}>
        <ButtonGroup 
          isAttached 
          size="sm"
          bg="gray.100"
          borderRadius="lg"
          p="3px"
          w="100%"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <Button
                key={tab.id}
                flex={1}
                onClick={() => onTabChange(tab.id)}
                bg={isActive ? 'white' : 'transparent'}
                color={isActive ? (brandColor || 'gray.900') : 'gray.500'}
                fontWeight={isActive ? '600' : '500'}
                fontSize="sm"
                px={4}
                py={2}
                borderRadius="md"
                boxShadow={isActive ? 'sm' : 'none'}
                _hover={{
                  bg: isActive ? 'white' : 'gray.50',
                  color: isActive ? (brandColor || 'gray.900') : 'gray.700',
                }}
                transition="all 0.2s"
              >
                {tab.label}
              </Button>
            );
          })}
        </ButtonGroup>
      </Container>
    </Box>
  );
}

