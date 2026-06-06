import {
  Button,
  Collapse,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from '@chakra-ui/react';
import { CloseIcon, LinkIcon } from '../../../icons';
import type { ImageField } from './types';

export interface UrlPasteProps {
  field: ImageField;
  placeholder?: string;
  clearAriaLabel?: string;
}

export function UrlPaste({
  field,
  placeholder = 'https://example.com/image.jpg',
  clearAriaLabel = 'Clear image URL',
}: UrlPasteProps) {
  return (
    <VStack align="flex-start" spacing={2} w="full">
      <Button
        leftIcon={<LinkIcon size={16} />}
        size="sm"
        variant="ghost"
        color={field.urlMode ? 'brand.500' : 'text.secondary'}
        onClick={field.toggleUrlMode}
      >
        Paste URL
      </Button>
      <Collapse in={field.urlMode} animateOpacity style={{ width: '100%' }}>
        <InputGroup size="sm">
          <Input
            placeholder={placeholder}
            value={field.value ?? ''}
            onChange={(e) => field.setUrl(e.target.value)}
            pr={field.value ? 10 : 4}
            autoFocus
          />
          {field.value && (
            <InputRightElement h="full">
              <IconButton
                aria-label={clearAriaLabel}
                icon={<CloseIcon size={14} />}
                size="xs"
                variant="ghost"
                color="text.faint"
                _hover={{ color: 'text.secondary' }}
                onClick={field.clear}
              />
            </InputRightElement>
          )}
        </InputGroup>
      </Collapse>
    </VStack>
  );
}
