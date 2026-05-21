import { useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Select,
  FormErrorMessage,
  HStack,
  Input,
  IconButton,
  Text,
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon, PlusIcon } from '../../icons';
import { FormLabelWithTooltip } from './FormLabelWithTooltip';

export interface CategoryOption {
  id: number;
  name: string;
}

export interface CategorySelectProps {
  value: number | null;
  onChange: (id: number | null) => void;
  categories: CategoryOption[];
  isLoading?: boolean;
  label?: string;
  labelHint?: string;
  errorMessage?: string;
  onBlur?: () => void;
  allowCreate?: boolean;
  isCreating?: boolean;
  onCreate?: (name: string) => Promise<CategoryOption | void>;
}

export function CategorySelect({
  value,
  onChange,
  categories,
  isLoading = false,
  label = 'Category',
  labelHint,
  errorMessage,
  onBlur,
  allowCreate = false,
  isCreating = false,
  onCreate,
}: CategorySelectProps) {
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');

  const handleCreate = async () => {
    if (!onCreate) return;
    const trimmed = newName.trim();
    if (!trimmed) return;
    const created = await onCreate(trimmed);
    if (created && 'id' in created) onChange(created.id);
    setAdding(false);
    setNewName('');
  };

  return (
    <FormControl isInvalid={!!errorMessage}>
      {labelHint ? (
        <FormLabelWithTooltip hint={labelHint}>{label}</FormLabelWithTooltip>
      ) : (
        <FormLabel>{label}</FormLabel>
      )}
      <Select
        placeholder={isLoading ? 'Loading…' : 'Select a category'}
        value={value == null ? '' : String(value)}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === '' ? null : Number(v));
        }}
        onBlur={onBlur}
        isDisabled={isLoading}
      >
        {categories.map((c) => (
          <option key={c.id} value={String(c.id)}>
            {c.name}
          </option>
        ))}
      </Select>

      {allowCreate && !adding && (
        <Box
          as="button"
          type="button"
          mt={1.5}
          display="flex"
          alignItems="center"
          gap={1}
          color="brand.500"
          fontSize="xs"
          fontWeight="500"
          _hover={{ color: 'brand.600' }}
          onClick={() => setAdding(true)}
        >
          <PlusIcon size={12} />
          <Text as="span">Add new category</Text>
        </Box>
      )}

      {allowCreate && adding && (
        <HStack mt={2} spacing={1}>
          <Input
            size="sm"
            autoFocus
            placeholder="Category name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                void handleCreate();
              }
              if (e.key === 'Escape') {
                setAdding(false);
                setNewName('');
              }
            }}
          />
          <IconButton
            aria-label="Save category"
            icon={<CheckIcon size={14} />}
            size="sm"
            colorScheme="brand"
            isLoading={isCreating}
            onClick={() => void handleCreate()}
          />
          <IconButton
            aria-label="Cancel"
            icon={<CloseIcon size={14} />}
            size="sm"
            variant="ghost"
            onClick={() => {
              setAdding(false);
              setNewName('');
            }}
          />
        </HStack>
      )}

      {errorMessage && <FormErrorMessage>{errorMessage}</FormErrorMessage>}
    </FormControl>
  );
}
