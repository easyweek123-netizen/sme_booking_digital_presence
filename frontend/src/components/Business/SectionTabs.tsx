import { Box, HStack } from '@chakra-ui/react';

export interface SectionTab {
  id: string;
  label: string;
}

interface SectionTabsProps {
  tabs: readonly SectionTab[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function SectionTabs({ tabs, activeId, onSelect }: SectionTabsProps) {
  return (
    <HStack
      spacing={7}
      borderBottom="1px solid"
      borderColor="gray.200"
      mt={6}
      mb={0}
    >
      {tabs.map((tab) => {
        const active = tab.id === activeId;
        return (
          <Box
            key={tab.id}
            as="button"
            onClick={() => onSelect(tab.id)}
            position="relative"
            py={3.5}
            px={0.5}
            fontSize="15px"
            fontWeight={active ? 600 : 500}
            color={active ? 'gray.900' : 'gray.500'}
          >
            {tab.label}
            {active && (
              <Box
                position="absolute"
                left={0}
                right={0}
                bottom="-1px"
                h="2px"
                bg="gray.900"
                borderRadius="1px"
              />
            )}
          </Box>
        );
      })}
    </HStack>
  );
}
