import { baseApi } from './baseApi';
import type {
  BillingCycle,
  CheckoutResponse,
  InvoiceDto,
  Plan,
  PricingResponse,
  SubscriptionSnapshot,
} from '../../types/billing.types';

export const billingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPricing: builder.query<PricingResponse, void>({
      query: () => '/billing/pricing',
      providesTags: ['Pricing'],
    }),
    getSubscription: builder.query<SubscriptionSnapshot | null, void>({
      query: () => '/billing/subscription',
      providesTags: ['Billing'],
    }),
    getInvoices: builder.query<InvoiceDto[], { limit?: number } | void>({
      query: (arg) => ({
        url: '/billing/invoices',
        params: { limit: arg?.limit ?? 10 },
      }),
      providesTags: ['Invoice'],
    }),
    startCheckout: builder.mutation<
      CheckoutResponse,
      { plan: Exclude<Plan, 'free'>; cycle: BillingCycle; returnUrl: string }
    >({
      query: (body) => ({ url: '/billing/checkout', method: 'POST', body }),
    }),
    confirmCheckout: builder.mutation<void, { sessionId: string }>({
      query: (body) => ({
        url: '/billing/checkout/confirm',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Billing', 'Invoice'],
    }),
    cancelSubscription: builder.mutation<void, void>({
      query: () => ({ url: '/billing/cancel', method: 'POST' }),
      invalidatesTags: ['Billing'],
    }),
    resumeSubscription: builder.mutation<void, void>({
      query: () => ({ url: '/billing/resume', method: 'POST' }),
      invalidatesTags: ['Billing'],
    }),
  }),
});

export const {
  useGetPricingQuery,
  useGetSubscriptionQuery,
  useGetInvoicesQuery,
  useStartCheckoutMutation,
  useConfirmCheckoutMutation,
  useCancelSubscriptionMutation,
  useResumeSubscriptionMutation,
} = billingApi;
