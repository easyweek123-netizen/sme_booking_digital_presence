import { Box, GridItem, SimpleGrid } from '@chakra-ui/react';
import { ServiceFormTabs } from './ServiceFormTabs';
import { LivePreviewPane } from './LivePreviewPane';
import type { ServiceTabKey } from './serviceTabs';

export function ServiceFormDesktop({ activeTab }: { activeTab: ServiceTabKey, isEdit: boolean }) {
  return (
    <SimpleGrid columns={2} gap={6}>
      <GridItem>
        <ServiceFormTabs activeTab={activeTab} />
      </GridItem>
      <GridItem>
        <Box
          position="sticky"
          top={4}
          overflowY="auto"
          bg="surface.card"
          p={6}
          borderRadius="lg"
          borderWidth={1}
          borderColor="border.subtle"
        >
          <LivePreviewPane />
        </Box>
      </GridItem>
    </SimpleGrid>
  );
}
