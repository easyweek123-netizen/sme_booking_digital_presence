import { Wrap, WrapItem, Button, Text } from '@chakra-ui/react';
import type { Suggestion } from '../../types/chat.types';

interface SuggestionsProps {
  suggestions: Suggestion[];
  onSelect: (value: string) => void;
}

export function Suggestions({ suggestions, onSelect }: SuggestionsProps) {
  return (
    <Wrap spacing={2} mt={3}>
      {suggestions.map((suggestion) => (
        <WrapItem key={suggestion.value}>
          <Button
            size="sm"
            variant={suggestion.variant === 'skip' ? 'ghost' : 'outline'}
            borderRadius="full"
            fontWeight="500"
            color={suggestion.variant === 'skip' ? 'gray.500' : 'gray.700'}
            borderColor={suggestion.variant === 'skip' ? 'transparent' : 'gray.200'}
            onClick={() => onSelect(suggestion.value)}
            _hover={{
              borderColor: suggestion.variant === 'skip' ? 'transparent' : 'brand.500',
              bg: suggestion.variant === 'skip' ? 'gray.100' : 'brand.50',
              color: suggestion.variant === 'skip' ? 'gray.600' : 'brand.600',
            }}
          >
            {suggestion.icon && <Text mr={1}>{suggestion.icon}</Text>}
            {suggestion.label}
          </Button>
        </WrapItem>
      ))}
    </Wrap>
  );
}

