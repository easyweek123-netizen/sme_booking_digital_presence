import { Badge, Box, Button, Heading, SimpleGrid, Text, Tooltip, VStack } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type {
  BillingCycle,
  Plan,
  PricingItem,
} from '../../types/billing.types';
import { formatPrice } from '../../utils/format';
import { planLabel } from '../../utils/billingLabels';
import { isHigherTier, isLowerTier, PLAN_ORDER } from '../../utils/billingPlanTier';
import { ROUTES } from '../../config/routes';
import { CycleToggle } from './CycleToggle';
import { PlanFeatureList } from './PlanFeatureList';

interface PlanComparisonSectionProps {
  pricing: PricingItem[];
  currentPlan: Plan;
  cycle: BillingCycle;
  onCycleChange: (cycle: BillingCycle) => void;
}

export function PlanComparisonSection({
  pricing,
  currentPlan,
  cycle,
  onCycleChange,
}: PlanComparisonSectionProps) {
  const navigate = useNavigate();

  const pricingByPlan = useMemo(() => {
    const map: Partial<Record<Plan, PricingItem>> = {};
    for (const row of pricing) {
      if (row.cycle === cycle) map[row.plan] = row;
    }
    return map;
  }, [pricing, cycle]);

  return (
    <VStack align="stretch" spacing={4}>
      <Heading size="md" color="text.primary">
        Compare plans
      </Heading>
      <CycleToggle value={cycle} onChange={onCycleChange} />
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
        {PLAN_ORDER.map((plan) => (
          <PlanCard
            key={plan}
            plan={plan}
            currentPlan={currentPlan}
            cycle={cycle}
            pricing={pricingByPlan[plan]}
            onUpgrade={() =>
              navigate(`${ROUTES.DASHBOARD.SETTINGS_CHECKOUT}?plan=${plan}&cycle=${cycle}`)
            }
          />
        ))}
      </SimpleGrid>
    </VStack>
  );
}

interface PlanCardProps {
  plan: Plan;
  currentPlan: Plan;
  cycle: BillingCycle;
  pricing?: PricingItem;
  onUpgrade: () => void;
}

function PlanCard({ plan, currentPlan, cycle, pricing, onUpgrade }: PlanCardProps) {
  const isCurrent = currentPlan === plan;
  const canUpgrade = !isCurrent && isLowerTier(currentPlan, plan);
  const isDowngrade = !isCurrent && isHigherTier(currentPlan, plan);

  const priceLabel =
    plan === 'free'
      ? '€0'
      : pricing
        ? formatPrice(pricing.amountCents / 100, pricing.currency)
        : '—';

  const periodSuffix = plan === 'free' ? '' : cycle === 'monthly' ? '/mo' : '/yr';
  const features = pricing?.features ?? [];

  return (
    <Box
      bg="surface.card"
      border="1px solid"
      borderColor={isCurrent ? 'brand.200' : 'border.subtle'}
      borderRadius="xl"
      p={5}
    >
      <VStack align="stretch" spacing={4}>
        <Box>
          <Heading size="md" color="text.primary">
            {planLabel(plan)}{' '}
            {plan === 'pro' && (
              <Badge ml={2} colorScheme="brand">Popular</Badge>
            )}
          </Heading>
        </Box>

        <Box>
          <Text fontSize="3xl" fontWeight="700" color="text.primary">
            {priceLabel}
            <Text as="span" fontSize="md" fontWeight="600" color="text.secondary">
              {periodSuffix}
            </Text>
          </Text>
        </Box>

        {features.length > 0 ? (
          <PlanFeatureList features={features} size="sm" />
        ) : (
          <Text color="text.muted" fontSize="sm">
            {plan === 'free' ? 'Basic access to get started.' : 'Feature list unavailable.'}
          </Text>
        )}

        {isCurrent && (
          <Button w="full" isDisabled>Current plan</Button>
        )}
        {canUpgrade && (
          <Button w="full" colorScheme="brand" onClick={onUpgrade}>
            Upgrade
          </Button>
        )}
        {isDowngrade && (
          <>
            <Tooltip label="Available at period end" hasArrow>
              <Button w="full" isDisabled>Downgrade</Button>
            </Tooltip>
            <Text color="text.muted" fontSize="xs">
              Downgrades are handled at period end.
            </Text>
          </>
        )}
      </VStack>
    </Box>
  );
}
