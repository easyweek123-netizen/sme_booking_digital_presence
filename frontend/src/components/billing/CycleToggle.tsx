import { Button, ButtonGroup } from '@chakra-ui/react';
import type { BillingCycle } from '../../types/billing.types';

interface CycleToggleProps {
  value: BillingCycle;
  onChange: (value: BillingCycle) => void;
}

export function CycleToggle({ value, onChange }: CycleToggleProps) {
  return (
    <ButtonGroup isAttached variant="outline" size="sm">
      <Button
        onClick={() => onChange('monthly')}
        bg={value === 'monthly' ? 'brand.50' : 'transparent'}
        color={value === 'monthly' ? 'brand.700' : 'text.secondary'}
        borderColor="border.subtle"
        _hover={{ bg: value === 'monthly' ? 'brand.50' : 'surface.muted' }}
      >
        Monthly
      </Button>
      <Button
        onClick={() => onChange('annual')}
        bg={value === 'annual' ? 'brand.50' : 'transparent'}
        color={value === 'annual' ? 'brand.700' : 'text.secondary'}
        borderColor="border.subtle"
        _hover={{ bg: value === 'annual' ? 'brand.50' : 'surface.muted' }}
      >
        Annual
      </Button>
    </ButtonGroup>
  );
}

