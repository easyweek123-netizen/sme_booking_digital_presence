import { Box, Text , HStack, Button, useClipboard } from "@chakra-ui/react";
import { LinkIcon, CheckIcon, CopyIcon } from "../../icons";
import type { SummaryCard as SummaryCardType } from "@shared";

export function SummaryCard({ card }: { card: SummaryCardType }) {
    const { onCopy, hasCopied } = useClipboard(card.shareUrl ?? '');   // @chakra-ui/react
    if (card.shareUrl) return (
      <Box bg="surface.card" border="1px" borderColor="border.subtle" borderRadius="md" overflow="hidden">
        <Box px={4} py={3} bg="accent.soft" borderBottom="1px" borderColor="border.subtle">
          <Text fontSize="sm" fontWeight="600" color="text.heading">{card.title}</Text>
        </Box>
        <HStack p={3} spacing={2}>
          <HStack flex={1} minW={0} px={3} py={2} bg="surface.alt" border="1px" borderColor="border.subtle" borderRadius="sm">
            <LinkIcon size={12} /><Text fontFamily="mono" fontSize="xs" isTruncated>{card.shareUrl}</Text></HStack>
          <Button size="sm" onClick={onCopy} leftIcon={hasCopied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}>
            {hasCopied ? 'Copied' : 'Copy'}</Button>
        </HStack>
      </Box>
    );
    return (
      <Box bg="surface.card" border="1px" borderColor="border.subtle" borderRadius="md" overflow="hidden">
        <HStack px={3} py={2.5} spacing={2.5} bg="surface.alt" borderBottom="1px" borderColor="border.subtle">
          <Box w={5} h={5} borderRadius="full" bg="success.soft" color="success.primary"
            display="flex" alignItems="center" justifyContent="center"><CheckIcon size={12} /></Box>
          <Text fontSize="sm" fontWeight="600" color="text.heading">{card.title}</Text>
        </HStack>
        {card.detail && <Box px={3} py={2.5}><Text fontSize="xs" color="text.secondary">{card.detail}</Text></Box>}
      </Box>
    );
  }