import { HStack, Button } from '@chakra-ui/react';
import { SparkleIcon } from '../../icons';
export function SuggestChips({ chips }: { chips: { label: string; onClick: () => void }[] }) {
  return (
    <HStack spacing={1.5} mt={2} flexWrap="wrap">
      {chips.map((c, i) => (
        <Button key={i} size="xs" variant="outline" borderColor="border.subtle" color="text.secondary"
          _hover={{ bg: 'accent.soft', color: 'accent.primary', borderColor: 'border.accent' }}
          leftIcon={<SparkleIcon size={10} />} onClick={c.onClick} fontWeight="500">{c.label}</Button>
      ))}
    </HStack>
  );
}