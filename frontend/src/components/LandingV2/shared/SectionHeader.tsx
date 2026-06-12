import { Stack, Heading, Text } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { EyebrowLabel } from './EyebrowLabel';

type Props = {
  eyebrow?: string;
  headline: ReactNode;
  subhead?: string;
  align?: 'center' | 'left';
};

export function SectionHeader({ eyebrow, headline, subhead, align = 'center' }: Props) {
  return (
    <Stack
      spacing={{ base: 4, md: 5 }}
      textAlign={align}
      align={align === 'center' ? 'center' : 'flex-start'}
      maxW="760px"
      mx={align === 'center' ? 'auto' : 0}
    >
      {eyebrow && <EyebrowLabel>{eyebrow}</EyebrowLabel>}
      <Heading
        as="h2"
        color="text.heading"
        fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
        lineHeight="shorter"
        whiteSpace="pre-line"
      >
        {headline}
      </Heading>
      {subhead && (
        <Text color="text.secondary" fontSize={{ base: 'md', md: 'lg' }} lineHeight="tall">
          {subhead}
        </Text>
      )}
    </Stack>
  );
}
