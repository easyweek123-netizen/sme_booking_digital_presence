import { Stack, Flex } from '@chakra-ui/react';
import { SectionShell } from './shared/SectionShell';
import { SectionHeader } from './shared/SectionHeader';
import { PersonaChip } from '@/components/LandingV2/shared/PersonaChip';
import { landingV2Content } from '@/pages/landing-v2/content';

export function AudienceStrip() {
  const { headline, subhead, chips, highlightedChip } = landingV2Content.audience;
  return (
    <SectionShell variant="alt">
      <Stack spacing={{ base: 4, md: 8 }} align="center">
        <SectionHeader headline={headline} subhead={subhead} />
        <Flex wrap="wrap" justify="center" gap={2}>
          {chips.map(label => (
            <PersonaChip key={label} active={label === highlightedChip}>{label}</PersonaChip>
          ))}
        </Flex>
      </Stack>
    </SectionShell>
  );
}
