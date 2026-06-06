import { useState } from 'react';
import { Box, FormControl, FormLabel, HStack, Text } from '@chakra-ui/react';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { PhoneField, type Country } from '../../../common/PhoneField';
import { DEFAULT_PHONE_COUNTRY } from '../../../../lib/locale/getDefaultPhoneCountry';
import { CheckIcon } from '../../../icons';
import type { PhoneInput } from '@bookeasy/shared';

interface PhonePickerProps {
  value: PhoneInput | null;
  onChange: (next: PhoneInput | null) => void;
}

export function PhonePicker({ value, onChange }: PhonePickerProps) {
  const phoneNumber = value?.phoneNumber ?? '';
  const [country, setCountry] = useState<Country | undefined>(DEFAULT_PHONE_COUNTRY);

  const writePhone = (next: string) => {
    onChange(next ? { phoneNumber: next } : null);
  };

  const isValid = isValidPhoneNumber(phoneNumber, country);
  const showInvalidHint = phoneNumber.length > 0 && !isValid;

  return (
    <Box bg="surface.card" border="1px solid" borderColor="border.subtle" borderRadius="lg" p={4}>
      <FormControl>
        <FormLabel
          fontSize="xs" fontWeight="700" color="text.muted"
          textTransform="uppercase" letterSpacing="0.04em" mb={2}
        >
          Phone number
        </FormLabel>
        <PhoneField
          value={phoneNumber}
          onChange={writePhone}
          onCountryChange={setCountry}
          isInvalid={showInvalidHint}
          placeholder="660 123 4567"
          rightElement={isValid ? <Box color="green.500"><CheckIcon size={20} /></Box> : undefined}
        />
        {showInvalidHint && (
          <Text fontSize="sm" color="red.500" mt={2}>
            Enter a valid phone number for the selected country.
          </Text>
        )}
        {isValid && (
          <HStack spacing={1.5} mt={2}>
            <Box color="green.500"><CheckIcon size={14} /></Box>
            <Text fontSize="sm" color="green.600">Looks good — saved when you create the service.</Text>
          </HStack>
        )}
      </FormControl>
    </Box>
  );
}
