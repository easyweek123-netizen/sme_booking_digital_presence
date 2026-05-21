import {
  FormLabel,
  HStack,
  IconButton,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { InfoIcon } from '../../icons';

export interface FormLabelWithTooltipProps {
  children: ReactNode;
  hint: string;
  suffix?: string;
  htmlFor?: string;
}

export function FormLabelWithTooltip({
  children,
  hint,
  suffix,
  htmlFor,
}: FormLabelWithTooltipProps) {
  return (
    <FormLabel htmlFor={htmlFor}>
      <HStack as="span" spacing={1.5} display="inline-flex" align="center">
        <Text as="span">{children}</Text>
        {suffix ? (
          <Text as="span" fontWeight="400" color="text.muted">
            {suffix}
          </Text>
        ) : null}
        <Tooltip label={hint} hasArrow placement="top" openDelay={200}>
          <IconButton
            aria-label={hint}
            icon={<InfoIcon size={14} />}
            size="xs"
            variant="ghost"
            minW="auto"
            h="auto"
            p={0}
            color="text.muted"
            _hover={{ color: 'accent.primary', bg: 'surface.alt' }}
          />
        </Tooltip>
      </HStack>
    </FormLabel>
  );
}
