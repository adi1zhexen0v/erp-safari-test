import { baseApi } from "@/shared/api";
import type { CompletenessResponse, ValidateTokenResponse, DraftData } from "@/features/hr/hiring";
import { setCompleteness, setError, setLoading } from "@/features/hr/hiring/slice";

export const applyApplicationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCompleteness: builder.query<CompletenessResponse, string>({
      query: (token) => `/api/hr/apply/${token}/completeness/`,
      providesTags: ["Completeness"],
      async onQueryStarted(token, { dispatch, queryFulfilled }) {
        try {
          dispatch(setLoading());
          const { data } = await queryFulfilled;
          dispatch(setCompleteness(data));
        } catch {
          dispatch(setError("Ошибка при загрузке данных"));
        }
      },
    }),
    submitApplication: builder.mutation<{ success: boolean; message: string }, string>({
      query: (token) => ({
        url: `/api/hr/apply/${token}/submit/`,
        method: "POST",
      }),
      invalidatesTags: ["Completeness"],
    }),
    validateToken: builder.query<ValidateTokenResponse, string>({
      query: (token) => `/api/hr/validate-token/${token}/`,
    }),
  }),
});

export const {
  useGetCompletenessQuery: useApplyApplicationGetCompletenessQuery,
  useSubmitApplicationMutation: useApplyApplicationSubmitMutation,
  useValidateTokenQuery: useApplyApplicationValidateTokenQuery,
} = applyApplicationApi;

export type { CompletenessResponse, ValidateTokenResponse, DraftData };

