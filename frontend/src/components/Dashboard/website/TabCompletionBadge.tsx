import { BrandPillBadge } from '../../ui';
import { Badge } from '@chakra-ui/react';
import { CheckIcon } from '../../icons';

interface Props {
  done: number;
  total: number;
}

export function TabCompletionBadge({ done, total }: Props) {
  const complete = done === total;
  if (complete) {
    return (
      <BrandPillBadge leftIcon={<CheckIcon size={10} aria-hidden />}>
        {total}/{total}
      </BrandPillBadge>
    );
  }
  return (
    <Badge
      variant="subtle"
      colorScheme="gray"
      borderRadius="full"
      fontSize="2xs"
      fontWeight="600"
      px={2}
    >
      {done}/{total}
    </Badge>
  );
}
