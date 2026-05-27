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
        bg="whiteAlpha.100"
        color="white"
        borderColor="whiteAlpha.200"
        textAlign="left"
        _placeholder={{ color: 'whiteAlpha.500' }}
        _hover={{ borderColor: 'whiteAlpha.400' }}
        _focus={{ borderColor: 'brand.400', boxShadow: 'none' }}
      />
      {/* <FormControl>
        <FormLabel color="whiteAlpha.800" fontSize="sm" mb={2}>
          Phone <Text as="span" color="whiteAlpha.500" fontWeight="400">(optional)</Text>
        </FormLabel>
        <PhoneField value={state.phone} onChange={(phone) => update({ phone })} />
      </FormControl> */}
    </VStack>
  );
}
