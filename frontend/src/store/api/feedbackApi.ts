import { baseApi } from './baseApi';

interface SubmitFeedbackRequest {
  email: string;
  message: string;
  source: 'pricing_page' | 'dashboard';
}

interface FeedbackResponse {
  id: number;
  email: string;
  message: string;
  source: string;
  createdAt: string;
}

export const feedbackApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitFeedback: builder.mutation<FeedbackResponse, SubmitFeedbackRequest>({
      query: (data) => ({
        url: '/feedback',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useSubmitFeedbackMutation } = feedbackApi;

