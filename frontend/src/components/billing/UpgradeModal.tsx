import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { closeUpgradePrompt } from '../../store/slices/billingSlice';
import { ROUTES } from '../../config/routes';
import { PlanFeatureList } from './PlanFeatureList';
import { useGetPricingQuery } from '../../store/api/billingApi';
import type { Plan } from '../../types/billing.types';
import { planLabel } from '../../utils/billingLabels';

function titleFor(plan: Exclude<Plan, 'free'>) {
  return plan === 'pro' ? 'This is a Pro feature' : 'This is a Growth feature';
}

export function UpgradeModal() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const upgradePrompt = useAppSelector((s) => s.billing.upgradePrompt);

  const requiredPlan = upgradePrompt.requiredPlan;
  const isOpen = upgradePrompt.open && !!requiredPlan;

  const { data: pricing } = useGetPricingQuery(undefined, { skip: !isOpen });

  const features = useMemo(() => {
    if (!requiredPlan) return [];
    const row = (pricing ?? []).find(
      (p) => p.plan === requiredPlan && p.cycle === 'monthly',
    );
    return row?.features ?? [];
  }, [pricing, requiredPlan]);

  const handleClose = () => dispatch(closeUpgradePrompt());

  const handleUpgrade = () => {
    if (!requiredPlan) return;
    handleClose();
    navigate(
      `${ROUTES.DASHBOARD.SETTINGS_CHECKOUT}?plan=${requiredPlan}&cycle=monthly`,
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      isCentered
      size={{ base: 'full', md: 'lg' }}
    >
      <ModalOverlay />
      <ModalContent borderRadius={{ base: 0, md: 'xl' }}>
        <ModalHeader>
          {requiredPlan ? titleFor(requiredPlan) : 'Upgrade required'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="stretch" spacing={4}>
            <Text color="text.secondary">
              To use this feature, you'll need to upgrade your plan.
            </Text>
            {requiredPlan && features.length > 0 ? (
              <PlanFeatureList features={features} />
            ) : (
              <Text color="text.muted" fontSize="sm">
                Feature details are unavailable right now.
              </Text>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <HStack w="full" justify="flex-end" spacing={3}>
            <Button variant="ghost" onClick={handleClose}>Maybe later</Button>
            <Button colorScheme="brand" onClick={handleUpgrade}>
              {requiredPlan ? `Upgrade to ${planLabel(requiredPlan)}` : 'Upgrade'}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
