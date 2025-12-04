import { baseApi } from './baseApi';

export interface HealthResponse {
  status: string;
  timestamp: string;
}

export const healthApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHealth: builder.query<HealthResponse, void>({
      query: () => '/health',
    }),
  }),
});

export const { useGetHealthQuery } = healthApi;

