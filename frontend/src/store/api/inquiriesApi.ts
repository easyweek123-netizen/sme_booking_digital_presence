import { baseApi } from './baseApi';

export interface SubmitInquiryRequest {
  name: string;
  email: string;
  company?: string;
  budget: 'under_5k' | '5_15k' | '15_50k' | '50k_plus' | 'not_sure';
  message: string;
}

export interface InquiryResponse {
  id: number;
  name: string;
  email: string;
  company: string | null;
  budget: string;
  message: string;
  source: string;
  createdAt: string;
}

export const inquiriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitInquiry: builder.mutation<InquiryResponse, SubmitInquiryRequest>({
      query: (data) => ({
        url: '/inquiries',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useSubmitInquiryMutation } = inquiriesApi;
