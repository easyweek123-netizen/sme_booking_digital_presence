import { Wrap, WrapItem, Button, Text } from '@chakra-ui/react';
import type { Suggestion } from '@shared';

interface SuggestionsProps {
  suggestions: Suggestion[];
  onSelect: (value: string, label: string) => void;
}

export function Suggestions({ suggestions, onSelect }: SuggestionsProps) {
  return (
    <Wrap spacing={2} mt={3}>
      {suggestions.map((suggestion: Suggestion) => {
        const isSelected = suggestion.isSelected === true;
        return (
          <WrapItem key={suggestion.value}>
            <Button
              size="sm"
              variant={isSelected ? 'solid' : suggestion.variant === 'skip' ? 'ghost' : 'outline'}
              colorScheme={isSelected ? 'brand' : undefined}
              borderRadius="full"
              fontWeight="500"
              color={isSelected ? undefined : suggestion.variant === 'skip' ? 'gray.500' : 'gray.700'}
              borderColor={isSelected ? undefined : suggestion.variant === 'skip' ? 'transparent' : 'border.subtle'}
              onClick={() => onSelect(suggestion.value, suggestion.label)}
              _hover={isSelected ? {} : {
                borderColor: suggestion.variant === 'skip' ? 'transparent' : 'brand.500',
                bg: suggestion.variant === 'skip' ? 'gray.100' : 'brand.50',
                color: suggestion.variant === 'skip' ? 'gray.600' : 'brand.600',
              }}
            >
              {suggestion.icon && <Text mr={1}>{suggestion.icon}</Text>}
              {suggestion.label}
            </Button>
          </WrapItem>
        );
      })}
    </Wrap>
  );
}

