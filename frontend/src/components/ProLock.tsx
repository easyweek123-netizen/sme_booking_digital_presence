import { Button, Tooltip } from '@chakra-ui/react';
import { useAppDispatch } from '../store/hooks';
import { openUpgradePrompt } from '../store/slices/billingSlice';
import { LockIcon } from './icons';

interface ProLockProps {
  feature: string;
}

/** Inline lock control that opens the standard upgrade modal for a gated entitlement. */
export function ProLock({ feature }: ProLockProps) {
  const dispatch = useAppDispatch();

  return (
    <Tooltip label="Upgrade to Pro to unlock" hasArrow placement="top">
      <Button
        leftIcon={<LockIcon size={18} />}
        variant="outline"
        colorScheme="brand"
        size="md"
        onClick={() =>
          dispatch(
            openUpgradePrompt({
              requiredPlan: 'pro',
              feature,
            }),
          )
        }
      >
        Pro
      </Button>
    </Tooltip>
  );
}
