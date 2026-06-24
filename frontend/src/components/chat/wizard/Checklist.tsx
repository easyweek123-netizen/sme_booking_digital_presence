import { Box, HStack, VStack, Text } from '@chakra-ui/react';
import {
  CheckIcon,
  ArrowRightIcon,
  SparkleIcon,
  MapPinIcon,
  ScissorsIcon,
} from '../../icons';
import { type WizardStep } from '@shared';

function StepIcon({ icon, size = 15 }: { icon?: string; size?: number }) {
  switch (icon) {
    case 'sparkle':
      return <SparkleIcon size={size} />;
    case 'map_pin':
      return <MapPinIcon size={size} />;
    case 'scissors':
      return <ScissorsIcon size={size} />;
    default:
      return <Box w={2} h={2} borderRadius="full" bg="text.muted" />;
  }
}

export function Checklist({
  steps,
  onPick,
}: {
  steps: WizardStep[];
  onPick: (id: string) => void;
}) {
  const doneCount = steps.filter((s) => s.done).length;

  return (
    <>
      <Box px={3} py={2.5} bg="surface.alt" borderBottom="1px" borderColor="border.subtle">
        <HStack justify="space-between" mb={2}>
          <Text fontSize="xs" color="text.secondary" fontWeight="600">
            Setup progress
          </Text>
          <Text fontSize="xs" color="text.secondary">
            {doneCount}/{steps.length} complete
          </Text>
        </HStack>
        <HStack spacing={1}>
          {steps.map((s) => (
            <Box
              key={s.id}
              flex={1}
              h="5px"
              borderRadius="full"
              bg={s.done ? 'accent.primary' : 'surface.muted'}
            />
          ))}
        </HStack>
      </Box>

      <VStack align="stretch" spacing={0} p={1.5}>
        {steps.map((s) => (
          <HStack
            as="button"
            type="button"
            key={s.id}
            onClick={() => onPick(s.id)}
            w="full"
            px={3}
            py={2.5}
            spacing={3}
            textAlign="left"
            borderRadius="sm"
            cursor="pointer"
            _hover={{ bg: 'surface.alt' }}
            aria-label={`Open step ${s.label}`}
          >
            <Box
              w={8}
              h={8}
              borderRadius="sm"
              display="flex"
              alignItems="center"
              justifyContent="center"
              border="1px"
              borderColor={s.done ? 'success.soft' : 'border.subtle'}
              bg={s.done ? 'success.soft' : 'surface.card'}
              color={s.done ? 'success.primary' : 'text.muted'}
            >
              {s.done ? <CheckIcon size={15} /> : <StepIcon icon={s.icon} size={15} />}
            </Box>

            <Box flex={1} minW={0}>
              <Text fontSize="sm" fontWeight="600" color="text.heading">
                {s.label}
              </Text>
              <Text fontSize="xs" color="text.secondary">
                {s.hint}
              </Text>
            </Box>

            <VStack spacing={0} align="end">
              <Text fontSize="2xs" color={s.done ? 'success.primary' : 'text.muted'} fontWeight="600">
                {s.done ? 'Done' : 'Next'}
              </Text>
              <Box color="text.muted">
                <ArrowRightIcon size={14} />
              </Box>
            </VStack>
          </HStack>
        ))}
      </VStack>
    </>
  );
}