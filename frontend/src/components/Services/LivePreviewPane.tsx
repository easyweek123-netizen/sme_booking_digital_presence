import {
  Box,
  Button,
  ButtonGroup,
  HStack,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import type { ServiceTypeValue } from '../../types';
import {
  AppointmentCardPreview,
  BookerPreview,
  ConfirmationPreview,
  GroupCardPreview,
} from './preview';
import type { ServiceDraft } from './preview';

type PreviewMode = 'card' | 'booker' | 'confirmation';

export function LivePreviewPane() {
  const { control } = useFormContext();
  const draft = (useWatch({ control }) as ServiceDraft) ?? {};
  const [mode, setMode] = useState<PreviewMode>('card');

  const type: ServiceTypeValue =
    draft.type === 'GROUP' ? 'GROUP' : 'APPOINTMENT';

  return (
    <Box>
      <HStack justify="space-between" align="center" mb={4}>
        <HStack spacing={2}>
          <Box w={2} h={2} borderRadius="full" bg="success.primary" />
          <Text
            fontSize="xs"
            fontWeight="700"
            color="text.heading"
            letterSpacing="wider"
          >
            LIVE PREVIEW
          </Text>
        </HStack>
        <ButtonGroup size="xs" isAttached variant="outline">
          <Button
            onClick={() => setMode('card')}
            bg={mode === 'card' ? 'surface.muted' : undefined}
            fontWeight={mode === 'card' ? '600' : '400'}
          >
            Card
          </Button>
          <Button
            onClick={() => setMode('booker')}
            bg={mode === 'booker' ? 'surface.muted' : undefined}
            fontWeight={mode === 'booker' ? '600' : '400'}
          >
            Booker
          </Button>
          <Button
            onClick={() => setMode('confirmation')}
            bg={mode === 'confirmation' ? 'surface.muted' : undefined}
            fontWeight={mode === 'confirmation' ? '600' : '400'}
          >
            Confirmation
          </Button>
        </ButtonGroup>
      </HStack>

      {mode === 'card' &&
        (type === 'GROUP' ? (
          <GroupCardPreview draft={draft} />
        ) : (
          <AppointmentCardPreview draft={draft} />
        ))}
      {mode === 'booker' && <BookerPreview draft={draft} />}
      {mode === 'confirmation' && <ConfirmationPreview draft={draft} />}

      <Box
        mt={4}
        p={3}
        borderRadius="md"
        bg="brand.50"
        borderWidth={1}
        borderColor="brand.100"
      >
        <Text fontSize="xs" color="text.secondary">
          ℹ︎ Preview refreshes as you edit · same component your clients see.
        </Text>
      </Box>
    </Box>
  );
}
