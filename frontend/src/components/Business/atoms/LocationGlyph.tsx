import { Center } from '@chakra-ui/react';
import { MapPinIcon } from '../../icons';

export function LocationGlyph() {
  return (
    <Center boxSize={10} borderRadius="full" bg="var(--brand-accent-soft)" color="var(--brand-accent)">
      <MapPinIcon size={20} />
    </Center>
  );
}
