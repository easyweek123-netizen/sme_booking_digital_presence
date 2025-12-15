import { useState, useRef, useEffect } from 'react';
import { InputGroup, Input, InputRightElement, IconButton } from '@chakra-ui/react';
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
    inputRef.current?.focus();
  }, []);

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

  return (
    <InputGroup size="lg">
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        bg="white"
        border="2px solid"
        borderColor="gray.200"
        borderRadius="xl"
        pr="50px"
        _focus={{
          borderColor: 'brand.500',
          boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
        }}
        _placeholder={{ color: 'gray.400' }}
      />
      <InputRightElement h="full" pr={1}>
        <IconButton
          aria-label="Send"
          icon={<ArrowRightIcon size={20} />}
          size="sm"
          colorScheme="brand"
          borderRadius="lg"
          onClick={handleSubmit}
          isDisabled={!value.trim() || disabled}
        />
      </InputRightElement>
    </InputGroup>
  );
}

