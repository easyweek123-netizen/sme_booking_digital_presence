import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import { BookingPreview } from '../../../BookingPreview';
import { PreviewUtilityRow } from './PreviewUtilityRow';
import { useWebsiteFormDraft } from '../hooks/useWebsiteFormDraft';
import { useGetBusinessServicesQuery } from '../../../../store/api';
import type { BusinessWithServices } from '../../../../types';

interface Props { business: BusinessWithServices; }

/**
 * Live preview of the website form's current draft, mounted by both
 * `WebsiteFormDesktop` (right rail) and `WebsiteFormMobile` (Preview tab).
 * Viewport-varying styles are encoded with Chakra responsive props — the
 * caller layouts already gate on the `lg` breakpoint via DashboardWebsite,
 * so the same component renders correctly in either context.
 *
 * Categories are fetched against the SAVED business id (not the draft's),
 * because the draft can carry a placeholder id from `emptyBusiness()`
 * before the saved business resolves.
 */
export function WebsitePreview({ business }: Props) {
  const draft = useWebsiteFormDraft(business);
  const { data: categories = [] } = useGetBusinessServicesQuery(business.id);

  return (
    <VStack align="stretch" spacing={2} h="100%" w="100%">
      <HStack
        justify="space-between"
        align="center"
        spacing={5}
        bg={{ base: 'surface.card', lg: 'transparent' }}
        flexShrink={0}
      >
        <Text
          fontSize="xs"
          fontWeight={700}
          color="text.heading"
          letterSpacing="wider"
          display="inline-flex"
          alignItems="center"
          gap={2}
          flexShrink={0}
        >
          <Box as="span" w={2} h={2} borderRadius="full" bg="sage.500" flexShrink={0} />
          PREVIEW
        </Text>
        <PreviewUtilityRow slug={draft.slug} />
      </HStack>

      <Box
        flex={1}
        minH={0}
        overflowY="auto"
        bg="surface.card"
        borderRadius={{ base: 'none', lg: 'md' }}
        css={{
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none', // optional: legacy Edge
        }}
      >
        <BookingPreview business={draft as BusinessWithServices} categories={categories} />
      </Box>
    </VStack>
  );
}
