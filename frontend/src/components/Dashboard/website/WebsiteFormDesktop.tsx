import { Box, GridItem, SimpleGrid } from '@chakra-ui/react';
import { WebsiteFormTabs } from './WebsiteFormTabs';
import { WebsitePreview } from './preview/WebsitePreview';
import type { WebsiteTabKey } from './websiteTabs';
import type { BusinessWithServices } from '../../../types';

interface Props {
  activeTab: WebsiteTabKey;
  business: BusinessWithServices;
}

export function WebsiteFormDesktop({ activeTab, business }: Props) {
  return (
    <SimpleGrid columns={2} gap={6}>
      <GridItem>
        <WebsiteFormTabs activeTab={activeTab} />
      </GridItem>
      <GridItem>
      <Box
        position="sticky"
        top={0}
        display="flex"
        flexDirection="column"
        h="calc(100dvh - var(--chakra-sizes-dashboard-headerOffset))"
        overflow="hidden"
        bg="surface.card"
        p={4}
        borderRadius="lg"
        borderWidth={1}
        borderColor="border.subtle"
      >
          <WebsitePreview business={business} />
        </Box>
      </GridItem>
    </SimpleGrid>
  );
}
