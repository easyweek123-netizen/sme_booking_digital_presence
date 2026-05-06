import { Box, Text, useToast } from '@chakra-ui/react';
import { lazy, Suspense, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../../components/ui/PageHeader';
import { ErrorState, PageLoading } from '../../../components/ui/states';
import {
  useConfirmCheckoutMutation,
  useStartCheckoutMutation,
} from '../../../store/api/billingApi';
import type { BillingCycle, Plan } from '../../../types/billing.types';
import { ROUTES } from '../../../config/routes';
import { InstantConfirmForm } from '../../../components/billing/InstantConfirmForm';
import { TOAST_DURATION } from '../../../constants';

const StripeEmbeddedCheckout = lazy(
  () => import('../../../components/billing/StripeEmbeddedCheckout'),
);

function isPaidPlan(value: string | null): value is Exclude<Plan, 'free'> {
  return value === 'pro' || value === 'growth';
}

function isCycle(value: string | null): value is BillingCycle {
  return value === 'monthly' || value === 'annual';
}

function absoluteReturnUrl() {
  return `${window.location.origin}${ROUTES.DASHBOARD.SETTINGS_BILLING}?welcome=1`;
}

export function Checkout() {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams] = useSearchParams();

  const planParam = searchParams.get('plan');
  const cycleParam = searchParams.get('cycle');
  const plan = isPaidPlan(planParam) ? planParam : null;
  const cycle = isCycle(cycleParam) ? cycleParam : null;

  const [start, startState] = useStartCheckoutMutation();
  const [confirm, confirmState] = useConfirmCheckoutMutation();
  
  useEffect(() => {
    if (plan && cycle) return;
    toast({
      title: 'Invalid checkout link',
      description: 'Please choose a plan from the Billing page.',
      status: 'warning',
      duration: TOAST_DURATION.SHORT,
      isClosable: true,
      position: 'top',
    });
    navigate(ROUTES.DASHBOARD.SETTINGS_BILLING, { replace: true });
  }, [plan, cycle, navigate, toast]);

  useEffect(() => {
    if (!plan || !cycle) return;
    if (startState.isUninitialized) {
      void start({ plan, cycle, returnUrl: absoluteReturnUrl() });
    }
  }, [plan, cycle, start, startState.isUninitialized]);

  useEffect(() => {
    if (startState.data?.mode === 'redirect' && startState.data.redirectUrl) {
      window.location.href = startState.data.redirectUrl;
    }
  }, [startState.data]);

  if (!plan || !cycle) return null;

  const headerProps = {
    title: 'Checkout',
    description: `Upgrade to ${plan === 'pro' ? 'Pro' : 'Growth'} (${cycle}).`,
    backHref: ROUTES.DASHBOARD.SETTINGS_BILLING,
  };

  if (startState.isLoading || startState.isUninitialized) {
    return <PageLoading variant="form" />;
  }

  if (startState.isError) {
    return (
      <Box>
        <PageHeader {...headerProps} />
        <ErrorState
          description="Unable to start checkout. Please try again."
          onRetry={() =>
            void start({ plan, cycle, returnUrl: absoluteReturnUrl() })
          }
        />
      </Box>
    );
  }

  const response = startState.data;
  if (!response) return <PageLoading variant="form" />;

  const handleConfirm = async () => {
    try {
      await confirm({ sessionId: response.sessionId }).unwrap();
      navigate(`${ROUTES.DASHBOARD.SETTINGS_BILLING}?welcome=1`, {
        replace: true,
      });
    } catch {
      toast({
        title: 'Payment failed',
        description: 'Please try again.',
        status: 'error',
        duration: TOAST_DURATION.SHORT,
        isClosable: true,
        position: 'top',
      });
    }
  };

  return (
    <Box>
      <PageHeader {...headerProps} />

      {response.mode === 'instant' && (
        <InstantConfirmForm
          response={response}
          confirming={confirmState.isLoading}
          onConfirm={handleConfirm}
        />
      )}

      {response.mode === 'embedded' && response.clientSecret && (
        <Suspense fallback={<PageLoading variant="form" />}>
          <StripeEmbeddedCheckout
            clientSecret={response.clientSecret}
            publishableKey={response.publishableKey ?? ''}
          />
        </Suspense>
      )}

      {response.mode === 'redirect' && (
        <Text color="text.secondary" fontSize="sm">
          Redirecting to payment provider…
        </Text>
      )}
    </Box>
  );
}
