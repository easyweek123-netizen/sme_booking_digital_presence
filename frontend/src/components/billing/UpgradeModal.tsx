import {
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Stack,
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
import { formatPrice } from '../../utils/format';
import { planLabel } from '../../utils/billingLabels';
import { SparkleIcon } from '../icons';
import { copyForFeature } from './upgradeCopy';

export function UpgradeModal() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const upgradePrompt = useAppSelector((s) => s.billing.upgradePrompt);

  const requiredPlan = upgradePrompt.requiredPlan;
  const isOpen = upgradePrompt.open && !!requiredPlan;

  const { data: pricing } = useGetPricingQuery(undefined, { skip: !isOpen });

  const planRow = useMemo(() => {
    if (!requiredPlan) return undefined;
    return (pricing ?? []).find(
      (p) => p.plan === requiredPlan && p.cycle === 'monthly',
    );
  }, [pricing, requiredPlan]);

  const features = planRow?.features ?? [];
  const priceLabel = planRow
    ? formatPrice(planRow.amountCents / 100, planRow.currency)
    : undefined;

  const copy = copyForFeature(upgradePrompt.feature);

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
      size={{ base: 'lg' }}
      motionPreset="slideInBottom"
      scrollBehavior="inside"
    >
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <ModalContent
        borderRadius={{ base: 0, md: '2xl' }}
        overflow="hidden"
        my={{ base: 0, md: 'auto' }}
      >

        <ModalBody px={{ base: 5, md: 8 }} py={{ base: 6, md: 7 }}>
          <VStack align="stretch" spacing={6}>
            {/* Headline block */}
            <VStack align="stretch" spacing={2}>
              <Text
                fontSize="xs"
                letterSpacing="0.08em"
                textTransform="uppercase"
                fontWeight="600"
                color="accent.primary"
              >
                {copy.eyebrow}
              </Text>
              <Heading size="lg" color="text.heading">
                {copy.title}
              </Heading>
              <Text color="text.secondary" fontSize="md" lineHeight="1.5">
                {copy.body}
              </Text>
            </VStack>

            {/* Price chip */}
            {requiredPlan && priceLabel && (
              <Flex
                align="center"
                justify="space-between"
                bg="accent.soft"
                border="1px solid"
                borderColor="border.accent"
                borderRadius="lg"
                px={4}
                py={3}
              >
                <Text fontWeight="600" color="text.primary" fontSize="sm">
                  {planLabel(requiredPlan)} plan
                </Text>
                <Text fontWeight="700" color="text.primary" fontSize="md">
                  {priceLabel}
                  <Text
                    as="span"
                    fontWeight="500"
                    color="text.secondary"
                    fontSize="sm"
                    ml={1}
                  >
                    / month
                  </Text>
                </Text>
              </Flex>
            )}

            {/* Feature list */}
            {features.length > 0 && (
              <VStack align="stretch" spacing={3}>
                <Text
                  fontSize="sm"
                  fontWeight="600"
                  color="text.primary"
                  pb={2}
                  borderBottom="1px solid"
                  borderColor="border.subtle"
                >
                  What you get with{' '}
                  {requiredPlan ? planLabel(requiredPlan) : 'Pro'}
                </Text>
                <PlanFeatureList features={features} size="sm" />
              </VStack>
            )}

            {/* CTAs — stack on mobile, inline on desktop */}
            <Stack
              direction={{ base: 'column-reverse', md: 'row' }}
              spacing={3}
              pt={2}
              justify={{ base: 'stretch', md: 'flex-end' }}
            >
              <Button
                variant="ghost"
                onClick={handleClose}
                w={{ base: 'full', md: 'auto' }}
              >
                Maybe later
              </Button>
              <Button
                variant="accent"
                onClick={handleUpgrade}
                w={{ base: 'full', md: 'auto' }}
              >
                {requiredPlan
                  ? `Upgrade to ${planLabel(requiredPlan)}`
                  : 'Upgrade'}
              </Button>
            </Stack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
