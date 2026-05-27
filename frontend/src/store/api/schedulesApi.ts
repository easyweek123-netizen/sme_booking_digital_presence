import { baseApi } from './baseApi';
import type { Schedule } from '../../types';
import type { AvailabilityInput } from '../../types';

interface ScheduleCreateRequest {
  name: string;
  timezone?: string | null;
  availability?: AvailabilityInput[];
}

interface SchedulePatchRequest {
  name?: string;
  timezone?: string | null;
  availability?: AvailabilityInput[];
}

export const schedulesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSchedule: builder.query<Schedule, number>({
      query: (id) => `/schedules/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Schedule', id }],
    }),
    createSchedule: builder.mutation<Schedule, ScheduleCreateRequest>({
      query: (data) => ({ url: '/schedules', method: 'POST', body: data }),
      invalidatesTags: ['Schedule'],
    }),
    updateSchedule: builder.mutation<Schedule, { id: number; data: SchedulePatchRequest }>({
      query: ({ id, data }) => ({ url: `/schedules/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Schedule', id }],
    }),
  }),
});

export const {
  useGetScheduleQuery,
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
} = schedulesApi;
