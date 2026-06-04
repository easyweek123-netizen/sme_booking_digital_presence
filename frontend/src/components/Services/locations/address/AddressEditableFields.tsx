import {
  Box,
  Collapse,
  FormControl,
  FormLabel,
  HStack,
  Input,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ChevronDownIcon, NoteIcon } from '../../../icons';
import type { AddressInput } from '../../../../types/location';

interface Props {
  draft: AddressInput;
  onChange: <K extends keyof AddressInput>(key: K, value: AddressInput[K]) => void;
}

function summary(parts: Array<string | null | undefined>) {
  return parts.map((p) => (p ?? '').trim()).filter(Boolean).join(' · ');
}

function Field({
  label, value, onChange, placeholder,
}: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <FormControl>
      <FormLabel fontSize="xs" color="text.muted" mb={1}>{label}</FormLabel>
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </FormControl>
  );
}

export function AddressEditableFields({ draft, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const headline =
    summary([draft.line1, draft.city, draft.postalCode, draft.countryName ?? draft.countryCode]) ||
    'Add street, city, postal code…';

  return (
    <Box bg="surface.card" border="1px solid" borderColor="border.subtle" borderRadius="lg">
      <HStack
        as="button" type="button" onClick={() => setOpen((v) => !v)} w="100%" px={4} py={3}
        justify="space-between" align="center"
        _hover={{ bg: 'surface.muted' }}
        borderTopRadius="lg" borderBottomRadius={open ? 0 : 'lg'} transition="background 0.15s"
      >
        <HStack spacing={3} align="center" minW={0}>
          <Box color="text.muted" flexShrink={0}><NoteIcon size={20} /></Box>
          <VStack align="flex-start" spacing={0} minW={0}>
            <Text fontWeight="700" fontSize="sm" color="text.heading">Address details</Text>
            <Text fontSize="sm" color="text.muted" noOfLines={1} textAlign="left">{headline}</Text>
          </VStack>
        </HStack>
        <HStack spacing={1} color="brand.600" flexShrink={0}>
          <Text fontWeight="600" fontSize="sm">Edit</Text>
          <Box transition="transform 0.15s" transform={open ? 'rotate(180deg)' : undefined}>
            <ChevronDownIcon size={18} />
          </Box>
        </HStack>
      </HStack>
      <Collapse in={open} animateOpacity>
        <Box px={4} pb={4} pt={1}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <Field label="Street" value={draft.line1} onChange={(v) => onChange('line1', v)} placeholder="Street and number" />
            <Field label="Apartment / Suite / Room" value={draft.line2 ?? ''} onChange={(v) => onChange('line2', v || null)} placeholder="Apt, suite, floor, room (optional)" />
            <Field label="City" value={draft.city} onChange={(v) => onChange('city', v)} placeholder="City" />
            <Field label="ZIP code" value={draft.postalCode ?? ''} onChange={(v) => onChange('postalCode', v || null)} placeholder="ZIP / Postal code" />
            <Field label="Country" value={draft.countryName ?? draft.countryCode} onChange={(v) => onChange('countryName', v)} placeholder="Country" />
          </SimpleGrid>
        </Box>
      </Collapse>
    </Box>
  );
}
