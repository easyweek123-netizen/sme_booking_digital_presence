import { HStack, IconButton } from '@chakra-ui/react';
import type { MouseEvent } from 'react';
import { EditIcon, TrashIcon } from '../../icons';

interface Props {
  onEdit?: () => void;
  onDelete?: () => void;
}

const iconButtonStyle = {
  size: 'sm' as const,
  variant: 'solid' as const,
  bg: 'blackAlpha.600',
  color: 'white',
};

export function ServiceControls({ onEdit, onDelete }: Props) {
  const stop = (handler?: () => void) => (e: MouseEvent) => {
    e.stopPropagation();
    handler?.();
  };

  return (
    <HStack spacing={1.5} opacity={0} transition="opacity .15s" _groupHover={{ opacity: 1 }}>
      <IconButton
        {...iconButtonStyle}
        aria-label="Edit service"
        icon={<EditIcon size={14} />}
        _hover={{ bg: 'blackAlpha.800' }}
        onClick={stop(onEdit)}
      />
      <IconButton
        {...iconButtonStyle}
        aria-label="Delete service"
        icon={<TrashIcon size={14} />}
        _hover={{ bg: 'alert.500' }}
        onClick={stop(onDelete)}
      />
    </HStack>
  );
}
