import { type ReactNode } from 'react';
import { Box } from '@chakra-ui/react';
import PhoneInput, { type Country } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { DEFAULT_PHONE_COUNTRY } from '../../lib/locale/getDefaultPhoneCountry';

export type { Country };

interface Props {
  value: string;
  onChange: (value: string) => void;
  onCountryChange?: (country: Country | undefined) => void;
  placeholder?: string;
  isInvalid?: boolean;
  rightElement?: ReactNode;
}

export function PhoneField({
  value,
  onChange,
  onCountryChange,
  placeholder = 'Phone number',
  isInvalid = false,
  rightElement,
}: Props) {
  const borderColor = isInvalid ? 'red.500' : 'border.strong';

  return (
    <Box position="relative">
      <Box
        sx={{
          '.PhoneInput': {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'surface.card',
            border: '1px solid',
            borderColor,
            borderRadius: 'md',
            px: 3,
            py: 2,
            h: '48px',
            pr: rightElement ? 10 : 3,
            transition: 'border-color 0.15s ease',
            _hover: { borderColor: isInvalid ? 'red.500' : 'gray.500' },
            // _focusWithin: { borderColor: focusBorderColor },
          },
          '.PhoneInputCountry': { display: 'flex', alignItems: 'center', gap: '4px' },
          '.PhoneInputCountryIcon': { width: '24px', height: '18px', boxShadow: 'none' },
          '.PhoneInputCountrySelectArrow': { color: 'text.muted', opacity: 1 },
          '.PhoneInputInput': {
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'text.primary',
            fontSize: 'md',
            flex: 1,
            textAlign: 'left',
            _placeholder: { color: 'text.muted' },
            _focus: { boxShadow: 'none' },
          },
        }}
      >
        <PhoneInput
          international
          defaultCountry={DEFAULT_PHONE_COUNTRY}
          value={value}
          onChange={(v) => onChange(v ?? '')}
          onCountryChange={onCountryChange}
          placeholder={placeholder}
        />
      </Box>
      {rightElement && (
        <Box
          position="absolute"
          right={3}
          top="50%"
          transform="translateY(-50%)"
          pointerEvents="none"
        >
          {rightElement}
        </Box>
      )}
    </Box>
  );
}
