import { Flex } from '@chakra-ui/react';

interface SplitLayoutProps {
  leftPanel: React.ReactNode;
  children: React.ReactNode;
}

export function SplitLayout({ leftPanel, children }: SplitLayoutProps) {
  return (
    <Flex flex={1} h="full" overflow="hidden">
      {/* Left panel - hidden on mobile */}
      <Flex
        display={{ base: 'none', md: 'flex' }}
        w="45%"
        flexShrink={0}
        align="center"
        justify="center"
      >
        {leftPanel}
      </Flex>

      {/* Right panel - conversation area */}
      <Flex
        flex={1}
        justify="center"
        bg="white"
        px={{ base: 2, md: 8 }}
      >
        {children}
      </Flex>
    </Flex>
  );
}

