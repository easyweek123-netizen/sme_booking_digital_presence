import { Stack } from '@chakra-ui/react';
import { SectionShell } from './shared/SectionShell';
import { SectionHeader } from './shared/SectionHeader';
import { WalkthroughRow } from '@/components/LandingV2/shared/WalkthroughRow';
import { landingV2Content } from '@/pages/landing-v2/content';

export function ProductWalkthrough() {
  const { eyebrow, headline, rows } = landingV2Content.walkthrough;
  return (
    <SectionShell variant="page">
      <Stack spacing={{ base: 4 }}>
        <SectionHeader eyebrow={eyebrow} headline={headline} />
        <Stack spacing={{ base: 8 }}>
          {rows.map(row => <WalkthroughRow key={row.index} {...row} />)}
        </Stack>
      </Stack>
    </SectionShell>
  );
}
