import { Box, Text } from '@chakra-ui/react';
import { SectionHeading } from '../SectionHeading';

interface AboutSectionProps {
  aboutContent: string | null;
}

export function AboutSection({ aboutContent }: AboutSectionProps) {
  return (
    <Box as="section" pt={8}>
      <SectionHeading id="section-about">About</SectionHeading>
      {aboutContent ? (
        <Box
          color="gray.700"
          sx={{
            'p': { mb: 3 },
            'ul, ol': { pl: 5, mb: 3 },
            'li': { mb: 1 },
            'a': { color: 'var(--brand-accent)', textDecoration: 'underline' },
            'strong': { fontWeight: 700 },
          }}
          dangerouslySetInnerHTML={{ __html: aboutContent }}
        />
      ) : (
        <Text color="gray.500">No description yet.</Text>
      )}
    </Box>
  );
}
