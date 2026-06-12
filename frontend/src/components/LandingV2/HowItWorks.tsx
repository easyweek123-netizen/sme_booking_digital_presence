import { Stack, SimpleGrid } from '@chakra-ui/react';
import { SectionShell } from './shared/SectionShell';
import { SectionHeader } from './shared/SectionHeader';
import { StepCard } from '@/components/LandingV2/shared/StepCard';
import { landingV2Content } from '@/pages/landing-v2/content';

export function HowItWorks() {
  const { eyebrow, headline, steps } = landingV2Content.howItWorks;
  return (
    <SectionShell variant="page" id="how-it-works">
      <Stack spacing={{ base: 4, md: 8 }}>
        <SectionHeader eyebrow={eyebrow} headline={headline} />
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
          {steps.map(s => <StepCard key={s.n} {...s} />)}
        </SimpleGrid>
      </Stack>
    </SectionShell>
  );
}
