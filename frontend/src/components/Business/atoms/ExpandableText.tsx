import { Box, Button, Text } from '@chakra-ui/react';
import { useState } from 'react';

interface ExpandableTextProps {
  text: string;
  lines?: number;
}

export function ExpandableText({ text, lines = 4 }: ExpandableTextProps) {
  const [open, setOpen] = useState(false);
  return (
    <Box>
      <Text
        color="gray.700"
        whiteSpace="pre-wrap"
        noOfLines={open ? undefined : lines}
      >
        {text}
      </Text>
      <Button
        variant="link"
        size="sm"
        color="var(--brand-accent)"
        mt={1}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? 'See less' : 'See more'}
      </Button>
    </Box>
  );
}
