import { useState, useRef, useEffect } from 'react';
import { Box, Input, IconButton, HStack } from '@chakra-ui/react';
import { ArrowRightIcon } from '../icons';

interface ChatInputProps {
  placeholder?: string;
  onSubmit: (value: string) => void;
  disabled?: boolean;
}

export function ChatInput({ placeholder, onSubmit, disabled }: ChatInputProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const hasValue = value.trim().length > 0;

  return (
    <Box
      bg="white"
      borderRadius="xl"
      border="1px solid"
      borderColor="gray.200"
      boxShadow="0 2px 8px rgba(0, 0, 0, 0.04)"
      transition="all 0.2s"
      _focusWithin={{
        borderColor: 'brand.300',
        boxShadow: '0 2px 12px rgba(46, 182, 125, 0.12)',
      }}
    >
      <HStack spacing={0} p={1}>
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          size="lg"
          border="none"
          bg="transparent"
          px={3}
          _focus={{ boxShadow: 'none' }}
          _placeholder={{ color: 'gray.400' }}
        />
        <IconButton
          aria-label="Send"
          icon={<ArrowRightIcon size={18} />}
          size="md"
          colorScheme={hasValue ? 'brand' : 'gray'}
          variant={hasValue ? 'solid' : 'ghost'}
          borderRadius="lg"
          onClick={handleSubmit}
          isDisabled={!hasValue || disabled}
          transition="all 0.2s"
          mr={1}
        />
      </HStack>
    </Box>
  );
}
