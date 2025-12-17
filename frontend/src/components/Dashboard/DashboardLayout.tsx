import { Box, Flex } from '@chakra-ui/react';
import { Sidebar, SIDEBAR_EXPANDED_WIDTH, SIDEBAR_COLLAPSED_WIDTH } from './Sidebar';
import { MobileNav } from './MobileNav';
import { useSidebarCollapsed } from '../../hooks';

interface DashboardLayoutProps {
  children: React.ReactNode;
  businessName?: string;
}

export function DashboardLayout({ children, businessName }: DashboardLayoutProps) {
  const { isCollapsed } = useSidebarCollapsed();

  const sidebarWidth = isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH;

  return (
    <Flex minH="100vh" bg="gray.50">
      {/* Desktop Sidebar - Fixed */}
      <Box
        display={{ base: 'none', lg: 'block' }}
        w={sidebarWidth}
        flexShrink={0}
        position="fixed"
        top={0}
        left={0}
        h="100vh"
        overflowY="auto"
        transition="width 200ms ease"
      >
        <Sidebar />
      </Box>

      {/* Main content area */}
      <Flex
        direction="column"
        flex={1}
        ml={{ base: 0, lg: sidebarWidth }}
        minH="100vh"
        transition="margin-left 200ms ease"
      >
        {/* Mobile Navigation */}
        <MobileNav businessName={businessName} />

        {/* Page content - fills remaining space */}
        <Box flex={1} position="relative" p={{ base: 4, md: 6, lg: 8 }}>
          {children}
        </Box>
      </Flex>
    </Flex>
  );
}
