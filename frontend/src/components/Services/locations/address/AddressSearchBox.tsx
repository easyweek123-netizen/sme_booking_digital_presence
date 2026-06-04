import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import {
  Box,
  Input,
  InputGroup,
  InputRightElement,
  List,
  ListItem,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '../../../icons';
import type { AddressCandidate } from '../../../../types/location';

interface Props {
  value: string;
  onQueryChange: (q: string) => void;
  onSelect: (candidate: AddressCandidate) => void;
  candidates: AddressCandidate[];
  isFetching: boolean;
  placeholder?: string;
}

function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <Text as="strong" fontWeight="700">{text.slice(idx, idx + query.length)}</Text>
      {text.slice(idx + query.length)}
    </>
  );
}

export function AddressSearchBox({
  value,
  onQueryChange,
  onSelect,
  candidates,
  isFetching,
  placeholder = 'Search for an address',
}: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isOpen = isFocused && candidates.length > 0;
  const isFloating = isFocused || value.length > 0;
  const safeHighlightedIndex = Math.min(highlightedIndex, Math.max(candidates.length - 1, 0));

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, candidates.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const picked = candidates[safeHighlightedIndex];
      if (picked) {
        onSelect(picked);
        inputRef.current?.blur();
        setIsFocused(false);
      }
    } else if (e.key === 'Escape') {
      inputRef.current?.blur();
      setIsFocused(false);
    }
  };

  return (
    <Box ref={containerRef} position="relative" w="100%">
      <Box position="relative">
        <Text
          as="label"
          position="absolute"
          left={4}
          top={isFloating ? '6px' : '50%'}
          transform={isFloating ? 'translateY(0)' : 'translateY(-50%)'}
          fontSize={isFloating ? 'xs' : 'sm'}
          color="text.muted"
          pointerEvents="none"
          transition="all 0.15s ease"
          zIndex={1}
          bg="surface.card"
          px={1}
          ml={-1}
        >
          {placeholder}
        </Text>
        <InputGroup>
          <Input
            ref={inputRef}
            value={value}
            onChange={(e) => {
              onQueryChange(e.target.value);
              setHighlightedIndex(0);
              setIsFocused(true);
            }}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            pt={isFloating ? '20px' : undefined}
            pb={isFloating ? '6px' : undefined}
            h="60px"
            bg="surface.card"
            borderColor="border.subtle"
            _hover={{ borderColor: 'border.strong' }}
            _focus={{ borderColor: 'brand.500', boxShadow: 'none' }}
            borderRadius="lg"
            autoComplete="off"
          />
          <InputRightElement h="60px" pr={2}>
            {isFetching ? (
              <Spinner size="sm" color="brand.500" />
            ) : (
              <Box
                color="text.muted"
                transition="transform 0.15s ease"
                transform={isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}
              >
                <ChevronDownIcon size={20} />
              </Box>
            )}
          </InputRightElement>
        </InputGroup>
      </Box>

      {isOpen && (
        <Box
          mt={1}
          bg="surface.card"
          border="1px solid"
          borderColor="border.subtle"
          borderRadius="lg"
          boxShadow="md"
          overflow="hidden"
        >
          <List>
            {candidates.map((c, i) => (
              <ListItem
                key={`${c.latitude}-${c.longitude}-${i}`}
                px={4}
                py={3}
                cursor="pointer"
                fontSize="sm"
                color="text.primary"
                bg={i === safeHighlightedIndex ? 'surface.muted' : 'transparent'}
                _hover={{ bg: 'surface.muted' }}
                onMouseEnter={() => setHighlightedIndex(i)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onSelect(c);
                  setIsFocused(false);
                }}
              >
                <HighlightedText text={c.displayName} query={value} />
              </ListItem>
            ))}
          </List>
          <Box px={4} py={2} borderTop="1px solid" borderColor="border.subtle">
            <Text fontSize="xs" color="text.muted" textAlign="center">
              powered by OpenStreetMap
            </Text>
          </Box>
        </Box>
      )}
    </Box>
  );
}
