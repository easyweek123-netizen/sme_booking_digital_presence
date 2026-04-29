import { Box, Divider, Heading, useToast, VStack } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../../components/ui/PageHeader';
import type { BillingCycle, Plan } from '../../../types/billing.types';
import { CurrentPlanCard } from '../../../components/billing/CurrentPlanCard';
import { InvoiceList } from '../../../components/billing/InvoiceList';
import { PlanComparisonSection } from '../../../components/billing/PlanComparisonSection';
import {
  useCancelSubscriptionMutation,
  useGetInvoicesQuery,
  useGetPricingQuery,
  useGetSubscriptionQuery,
  useResumeSubscriptionMutation,
} from '../../../store/api/billingApi';
import { TOAST_DURATION } from '../../../constants';

export function Billing() {
  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  const compareRef = useRef<HTMLDivElement | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();

  const subscriptionQuery = useGetSubscriptionQuery();
  const invoicesQuery = useGetInvoicesQuery({ limit: 10 });
  const pricingQuery = useGetPricingQuery();

  const [cancel, cancelState] = useCancelSubscriptionMutation();
  const [resume, resumeState] = useResumeSubscriptionMutation();

  const currentPlan: Plan = subscriptionQuery.data?.plan ?? 'free';

  useEffect(() => {
    if (searchParams.get('welcome') !== '1') return;
    toast({
      title: 'Welcome!',
      description: 'Your plan is now active.',
      status: 'success',
      duration: TOAST_DURATION.MEDIUM,
      isClosable: true,
      position: 'top',
    });
    const next = new URLSearchParams(searchParams);
    next.delete('welcome');
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams, toast]);

  const handleCancel = async () => {
    try {
      await cancel().unwrap();
    } catch {
      toast({
        title: 'Could not cancel subscription',
        status: 'error',
        duration: TOAST_DURATION.SHORT,
        isClosable: true,
        position: 'top',
      });
    }
  };

  const handleResume = async () => {
    try {
      await resume().unwrap();
    } catch {
      toast({
        title: 'Could not resume subscription',
        status: 'error',
        duration: TOAST_DURATION.SHORT,
        isClosable: true,
        position: 'top',
      });
    }
  };

  const handleUpgradeScroll = () =>
    compareRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <VStack align="stretch" spacing={6}>
      <PageHeader
        title="Billing"
        description="Manage your plan, payments, and invoices."
      />

      <CurrentPlanCard
        subscription={subscriptionQuery.data ?? null}
        loading={subscriptionQuery.isLoading}
        error={subscriptionQuery.isError}
        canceling={cancelState.isLoading}
        resuming={resumeState.isLoading}
        onUpgradeClick={handleUpgradeScroll}
        onCancel={handleCancel}
        onResume={handleResume}
      />

      <Box>
        <Heading size="sm" mb={3} color="text.primary">Invoices</Heading>
        <InvoiceList
          invoices={invoicesQuery.data ?? []}
          loading={invoicesQuery.isLoading}
          error={invoicesQuery.isError}
        />
      </Box>

      <Divider borderColor="border.subtle" />

      <Box ref={compareRef}>
        <PlanComparisonSection
          pricing={pricingQuery.data ?? []}
          currentPlan={currentPlan}
          cycle={cycle}
          onCycleChange={setCycle}
        />
      </Box>
    </VStack>
  );
}
