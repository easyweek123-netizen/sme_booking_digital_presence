import { useState, useRef, useEffect, useCallback } from 'react';
import { Box, Textarea, IconButton, HStack } from '@chakra-ui/react';
import { ArrowRightIcon } from '../icons';

interface ChatInputProps {
  placeholder?: string;
  onSubmit: (value: string) => void;
  disabled?: boolean;
}

export function ChatInput({ placeholder, onSubmit, disabled }: ChatInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 150)}px`;
  }, []);

  useEffect(() => {
    if (!disabled) {
      textareaRef.current?.focus();
    }
  }, [disabled]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setValue('');
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    autoResize();
  };

  const hasValue = value.trim().length > 0;

  return (
    <Box
      bg="white"
      borderRadius="2xl"
      border="1px solid"
      borderColor="gray.200"
      boxShadow="0 2px 8px rgba(0, 0, 0, 0.04)"
      transition="all 0.2s"
      _focusWithin={{
        borderColor: 'brand.300',
        boxShadow: '0 2px 12px rgba(46, 182, 125, 0.12)',
      }}
    >
      <HStack spacing={0} p={2} align="end">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          resize="none"
          border="none"
          bg="transparent"
          px={3}
          py={2}
          minH="unset"
          maxH="150px"
          overflow="auto"
          fontSize="sm"
          lineHeight="tall"
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
          flexShrink={0}
        />
      </HStack>
    </Box>
  );
}
