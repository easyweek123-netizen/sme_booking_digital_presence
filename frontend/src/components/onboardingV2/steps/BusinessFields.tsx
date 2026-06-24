import {
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import type { KeyboardEvent } from 'react';
import { ArrowRightIcon } from '../../icons';
import type { StepProps } from '../types';

export function BusinessFields({ flow }: StepProps) {
  const { state, update, next } = flow;
  const canContinue = state.name.trim().length > 0;

  function submitBusinessName() {
    if (!canContinue) return;
    next();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter' || e.nativeEvent.isComposing) return;
    e.preventDefault();
    submitBusinessName();
  }

  return (
    <VStack spacing={4} align="stretch">
      <InputGroup size="lg">
        <Input
          autoFocus
          value={state.name}
          onChange={(e) => update({ name: e.target.value })}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Mindful Studio"
          textAlign="left"
          pr={12}
        />
        <InputRightElement h="full" pr={1}>
          <Tooltip label="Press Enter to continue" hasArrow>
            <IconButton
              aria-label="Continue"
              size="sm"
              variant="ghost"
              icon={<ArrowRightIcon size={16} />}
              onClick={submitBusinessName}
              isDisabled={!canContinue}
              color="text.muted"
              _hover={{ bg: 'surface.muted', color: 'text.primary' }}
            />
          </Tooltip>
        </InputRightElement>
      </InputGroup>
    </VStack>
  );
}