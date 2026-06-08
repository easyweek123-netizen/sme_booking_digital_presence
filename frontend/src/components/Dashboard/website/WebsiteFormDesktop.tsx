import { GridItem, SimpleGrid, VStack } from '@chakra-ui/react';
import { BookingLinkCard } from '../../QRCode';
import { WebsiteCompletionProgress } from '../WebsiteCompletionProgress';
import { WebsiteFormTabs } from './WebsiteFormTabs';
import type { WebsiteTabKey } from './websiteTabs';
import type { BusinessWithServices } from '../../../types';

interface Props {
  activeTab: WebsiteTabKey;
  business: BusinessWithServices;
}

export function WebsiteFormDesktop({ activeTab, business }: Props) {
  return (
    <SimpleGrid columns={12} spacing={4} alignItems="start">
      <GridItem colSpan={8}>
        <WebsiteFormTabs activeTab={activeTab} />
      </GridItem>
      <GridItem colSpan={4}>
        <VStack
          spacing="space.stack.lg"
          align="stretch"
          position="sticky"
          top={4}
          py={4}
        >
          <BookingLinkCard slug={business.slug} />
          <WebsiteCompletionProgress business={business} onScrollToSection={() => undefined} />
        </VStack>
      </GridItem>
    </SimpleGrid>
  );
}
