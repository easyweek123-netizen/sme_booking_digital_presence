import { HStack, IconButton, Text, Tooltip, useToast, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { CopyIcon, ExternalLinkIcon } from '../../../icons';
import { TOAST_DURATION } from '../../../../constants';

interface PreviewUtilityRowProps {
  slug: string;
}

export function PreviewUtilityRow({ slug }: PreviewUtilityRowProps) {
  const toast = useToast();
  const { url, display } = useMemo(
    () => ({
      url: `${window.location.origin}/book/${slug}`,
      display: `${window.location.host}/book/${slug}`,
    }),
    [slug],
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: 'Link copied', status: 'success', duration: TOAST_DURATION.SHORT });
    } catch {
      toast({ title: 'Copy failed', status: 'error', duration: TOAST_DURATION.SHORT });
    }
  };

  return (
    <HStack
      spacing={1}
      align="center"
    >
      <Box flex={1} minW={0}>
        <Text fontSize="sm" color="text.body" noOfLines={1}>
          {display}
        </Text>
      </Box>
      <Tooltip label="Copy link">
        <IconButton
          aria-label="Copy link"
          icon={<CopyIcon />}
          size="sm"
          variant="ghost"
          onClick={copy}
        />
      </Tooltip>
      <Tooltip label="Open in new tab">
        <IconButton
          as="a"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open in new tab"
          icon={<ExternalLinkIcon />}
          size="sm"
          variant="ghost"
        />
      </Tooltip>
    </HStack>
  );
}
