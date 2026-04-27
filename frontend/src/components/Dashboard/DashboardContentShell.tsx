import type { ReactNode } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { PageHeader } from '../ui/PageHeader';

interface DashboardContentShellProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  backHref?: string;
  /** When true, header stays pinned while body scrolls. Defaults to true. */
  stickyHeader?: boolean;
  children: ReactNode;
}

export function DashboardContentShell({
  title,
  description,
  actions,
  backHref,
  stickyHeader = true,
  children,
}: DashboardContentShellProps) {
  return (
    <Flex direction="column" h="100%" minH={0}>
      <Box
        flexShrink={0}
        position={stickyHeader ? 'sticky' : 'static'}
        top={0}
        zIndex={5}
        bg="surface.page"
        borderBottom="1px solid"
        borderColor="border.subtle"
        px={{ base: 4, md: 6, lg: 8 }}
        pt={{ base: 4 }}
      >
        <PageHeader
          title={title}
          description={description}
          actions={actions}
          backHref={backHref}
        />
      </Box>

      <Box
        flex={1}
        minH={0}
        overflow="auto"
        px={{ base: 4, md: 6, lg: 8 }}
        py={4}
      >
        {children}
      </Box>
    </Flex>
  );
}
