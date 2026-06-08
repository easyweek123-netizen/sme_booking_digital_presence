import { Box } from '@chakra-ui/react';
import { WebsiteFormTabs } from './WebsiteFormTabs';
import type { WebsiteTabKey } from './websiteTabs';

interface Props {
  activeTab: WebsiteTabKey;
}

/**
 * Mobile layout: single column, no right rail (BookingLinkCard +
 * WebsiteCompletionProgress are desktop-only). Phase 7's right-rail
 * preview will replace the desktop rail; mobile gets a tab toggle
 * mirroring `ServiceFormMobile`.
 */
export function WebsiteFormMobile({ activeTab }: Props) {
  return (
    <Box pb={4}>
      <WebsiteFormTabs activeTab={activeTab} />
    </Box>
  );
}
