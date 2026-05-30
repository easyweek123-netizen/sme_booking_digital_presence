import { Input, VStack } from '@chakra-ui/react';
import type { StepProps } from '../types';

export function BusinessFields({ flow }: StepProps) {
  const { state, update } = flow;
  return (
    <VStack spacing={4} align="stretch">
      <Input
        autoFocus
        value={state.name}
        onChange={(e) => update({ name: e.target.value })}
        placeholder="e.g. Mindful Studio"
        size="lg"
        textAlign="left"
      />
      {/* <FormControl>
        <FormLabel color="text.secondary" fontSize="sm" mb={2}>
          Phone <Text as="span" color="text.muted" fontWeight="400">(optional)</Text>
        </FormLabel>
        <PhoneField value={state.phone} onChange={(phone) => update({ phone })} />
      </FormControl> */}
    </VStack>
  );
}
