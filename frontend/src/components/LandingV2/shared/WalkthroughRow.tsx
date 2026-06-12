// frontend/src/components/LandingV2/shared/WalkthroughRow.tsx
import { Box, Grid, GridItem, Stack, Heading, Text } from '@chakra-ui/react';
import { SmartImage } from '@/components/ui/SmartImage';
import { EyebrowLabel } from './EyebrowLabel';

type Props = {
  index: string;
  tag: string;
  title: string;
  body: string;
  image: string;
  side: 'left' | 'right';
};

export function WalkthroughRow({ index, tag, title, body, image, side }: Props) {
  const imageFirst = side === 'left';
  return (
    <Grid
      templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
      gap={{ base: 8, lg: 16 }}
      alignItems="center"
    >
      <GridItem order={{ base: 0, lg: imageFirst ? 0 : 1 }}>
        <Box
          borderRadius="xl"
          borderWidth="1px"
          borderColor="border.subtle"
          boxShadow="md"
          overflow="hidden"
          bg="surface.card"
        >
          <SmartImage
            src={image}
            alt={title}
            ratio={16 / 10}
            objectFit="contain"
            borderRadius="none"
          />
        </Box>
      </GridItem>
      <GridItem order={{ base: 1, lg: imageFirst ? 1 : 0 }}>
        <Stack spacing={4} align="flex-start">
          <Text color="text.muted" fontSize="sm" letterSpacing="wider">{index}</Text>
          <EyebrowLabel>{tag}</EyebrowLabel>
          <Heading
            as="h3"
            color="text.heading"
            fontSize={{ base: '2xl', md: '3xl' }}
            lineHeight="shorter"
          >
            {title}
          </Heading>
          <Text color="text.secondary" fontSize="md" lineHeight="tall">{body}</Text>
        </Stack>
      </GridItem>
    </Grid>
  );
}