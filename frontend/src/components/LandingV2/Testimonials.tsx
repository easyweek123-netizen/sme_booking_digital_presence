import { Stack, SimpleGrid } from '@chakra-ui/react';
import { SectionShell } from './shared/SectionShell';
import { SectionHeader } from './shared/SectionHeader';
import { TestimonialCard } from '@/components/LandingV2/shared/TestimonialCard';
import { landingV2Content } from '@/pages/landing-v2/content';

export function Testimonials() {
  const { headline, items } = landingV2Content.testimonials;
  return (
    <SectionShell variant="alt">
      <Stack spacing={{ base: 4, md: 8 }}>
        <SectionHeader headline={headline} />
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          {items.map(t => <TestimonialCard key={t.name} {...t} />)}
        </SimpleGrid>
      </Stack>
    </SectionShell>
  );
}
