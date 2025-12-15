import { Box, Flex } from '@chakra-ui/react';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';

interface DashboardLayoutProps {
  children: React.ReactNode;
  businessName?: string;
}

export function DashboardLayout({ children, businessName }: DashboardLayoutProps) {
  return (
    <Flex minH="100vh" bg="gray.50">
      {/* Desktop Sidebar - Fixed */}
      <Box
        display={{ base: 'none', lg: 'block' }}
        w="240px"
        flexShrink={0}
        position="fixed"
        top={0}
        left={0}
        h="100vh"
        overflowY="auto"
      >
        <Sidebar />
      </Box>

      {/* Main content area */}
      <Flex
        direction="column"
        flex={1}
        ml={{ base: 0, lg: '240px' }}
        minH="100vh"
      >
        {/* Mobile Navigation */}
        <MobileNav businessName={businessName} />

        {/* Page content - fills remaining space */}
        <Box flex={1} display="flex" flexDirection="column" p={{ base: 4, md: 6, lg: 8 }}>
          {children}
        </Box>
      </Flex>
    </Flex>
  );
}

