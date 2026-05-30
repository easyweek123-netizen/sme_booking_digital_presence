import { Box } from '@chakra-ui/react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { DEFAULT_PHONE_COUNTRY } from '../../../lib/locale/getDefaultPhoneCountry';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function PhoneField({ value, onChange, placeholder = 'Phone number' }: Props) {
  return (
    <Box
      sx={{
        '.PhoneInput': {
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'surface.card',
          border: '1px solid',
          borderColor: 'border.strong',
          borderRadius: 'md',
          px: 3,
          py: 2,
          h: '48px',
          transition: 'border-color 0.15s ease',
          _hover: { borderColor: 'gray.500' },
          _focusWithin: { borderColor: 'brand.500' },
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
        },
      }}
    >
      <PhoneInput
        international
        defaultCountry={DEFAULT_PHONE_COUNTRY}
        value={value}
        onChange={(v) => onChange(v ?? '')}
        placeholder={placeholder}
      />
    </Box>
  );
}
