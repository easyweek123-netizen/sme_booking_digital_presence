import { Box, Text } from '@chakra-ui/react';
import { SectionHeading } from '../SectionHeading';
import { AboutContent } from './AboutContent';

interface AboutSectionProps { aboutContent: string | null; }

export function AboutSection({ aboutContent }: AboutSectionProps) {
  return (
    <Box as="section" pt={8}>
      <SectionHeading id="section-about">About</SectionHeading>
      {aboutContent
        ? <AboutContent html={aboutContent} />
        : <Text color="gray.500">No description yet.</Text>}
    </Box>
  );
}
