import { Badge, Box, Button, Heading, SimpleGrid, Text, Tooltip, VStack } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetPricingQuery } from '../../store/api/billingApi';
import type { BillingCycle, Plan } from '../../types/billing.types';
import { formatPrice } from '../../utils/format';
import { PlanFeatureList } from './PlanFeatureList';
import { PLAN_LABEL } from '../../utils/billingLabels';
import { buildCheckoutRoute, isPaidPlan } from '../../pages/dashboard/settings/utils/checkoutRoute';

interface PlanCompareGridProps {
  cycle: BillingCycle;
  currentPlan: Plan;
}

const PLAN_ORDER: Plan[] = ['free', 'pro', 'growth'];

function isLowerTier(current: Plan, target: Plan) {
  return PLAN_ORDER.indexOf(current) < PLAN_ORDER.indexOf(target);
}

function isHigherTier(current: Plan, target: Plan) {
  return PLAN_ORDER.indexOf(current) > PLAN_ORDER.indexOf(target);
}

export function PlanCompareGrid({ cycle, currentPlan }: PlanCompareGridProps) {
  const navigate = useNavigate();
  const { data: pricing, isLoading } = useGetPricingQuery();

  const pricingByPlan = useMemo(() => {
    const map: Partial<Record<Plan, { amountCents: number; currency: string; features: string[] }>> = {};
    for (const row of pricing ?? []) {
      if (row.cycle !== cycle) continue;
      map[row.plan] = {
        amountCents: row.amountCents,
        currency: row.currency,
        features: row.features ?? [],
      };
    }
    return map;
  }, [pricing, cycle]);

  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
      {PLAN_ORDER.map((plan) => {
        const isCurrent = currentPlan === plan;
        const canUpgrade = !isCurrent && isLowerTier(currentPlan, plan);
        const isDowngrade = !isCurrent && isHigherTier(currentPlan, plan);

        const priceRow = pricingByPlan[plan];
        const priceLabel =
          plan === 'free'
            ? '€0'
            : priceRow
              ? formatPrice(priceRow.amountCents / 100, priceRow.currency)
              : '—';

        const periodSuffix = plan === 'free' ? '' : cycle === 'monthly' ? '/mo' : '/yr';

        const features = priceRow?.features ?? [];

        const cta = isCurrent ? (
          <Button w="full" isDisabled>
            Current plan
          </Button>
        ) : canUpgrade ? (
          <Button
            w="full"
            colorScheme="brand"
            onClick={() => {
              if (!isPaidPlan(plan)) return;
              navigate(buildCheckoutRoute({ plan, cycle }));
            }}
          >
            Upgrade
          </Button>
        ) : (
          <Tooltip label="Available at period end" hasArrow>
            <Button w="full" isDisabled>
              Downgrade
            </Button>
          </Tooltip>
        );

        return (
          <Box
            key={plan}
            bg="surface.card"
            border="1px solid"
            borderColor={isCurrent ? 'brand.200' : 'border.subtle'}
            borderRadius="xl"
            p={5}
          >
            <VStack align="stretch" spacing={4}>
              <Box>
                <Heading size="md" color="text.primary">
                  {PLAN_LABEL[plan]}{' '}
                  {plan === 'pro' && <Badge ml={2} colorScheme="brand">Popular</Badge>}
                </Heading>
                <Text mt={2} color="text.secondary" fontSize="sm">
                  {isLoading ? 'Loading pricing…' : 'Includes:'}
                </Text>
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

              {cta}

              {isDowngrade && (
                <Text color="text.muted" fontSize="xs">
                  Downgrades are handled at period end.
                </Text>
              )}
            </VStack>
          </Box>
        );
      })}
    </SimpleGrid>
  );
}

