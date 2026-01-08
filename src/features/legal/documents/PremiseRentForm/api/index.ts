import { baseApi } from "@/shared/api";
import type {
  PremiseRentApiPayload,
  PremiseRentResponse,
  PremiseRentContract,
  PremiseRentListResponse,
  SubmitForSigningResponse,
} from "../types";

export const premiseRentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitPremiseRent: builder.mutation<PremiseRentResponse, PremiseRentApiPayload>({
      query: (body) => ({
        url: "/api/legal/premises-leases/",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "PremisesLeases" as const, id: "LIST" }],
    }),

    updatePremiseRent: builder.mutation<PremiseRentResponse, { id: number; data: PremiseRentApiPayload }>({
      query: ({ id, data }) => ({
        url: `/api/legal/premises-leases/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "PremisesLeases" as const, id },
        { type: "PremisesLeases" as const, id: "LIST" },
      ],
    }),

    getPremiseRent: builder.query<PremiseRentResponse, number>({
      query: (id) => ({
        url: `/api/legal/premises-leases/${id}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "PremisesLeases" as const, id }],
    }),

    getPremiseRentList: builder.query<PremiseRentContract[], void>({
      query: () => ({
        url: "/api/legal/premises-leases/",
        method: "GET",
      }),
      transformResponse: (response: PremiseRentListResponse): PremiseRentContract[] => response.results,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "PremisesLeases" as const, id })),
              { type: "PremisesLeases" as const, id: "LIST" },
            ]
          : [{ type: "PremisesLeases" as const, id: "LIST" }],
    }),

    submitPremiseRentForSigning: builder.mutation<SubmitForSigningResponse, number>({
      query: (id) => ({
        url: `/api/legal/premises-leases/${id}/submit-for-signing/`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "PremisesLeases" as const, id },
        { type: "PremisesLeases" as const, id: "LIST" },
      ],
    }),

    downloadPremiseRentPreview: builder.mutation<Blob, number>({
      query: (id) => ({
        url: `/api/legal/premises-leases/${id}/preview/`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),

    deletePremiseRent: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/legal/premises-leases/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "PremisesLeases" as const, id },
        { type: "PremisesLeases" as const, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useSubmitPremiseRentMutation,
  useUpdatePremiseRentMutation,
  useGetPremiseRentQuery,
  useGetPremiseRentListQuery,
  useSubmitPremiseRentForSigningMutation,
  useDownloadPremiseRentPreviewMutation,
  useDeletePremiseRentMutation,
} = premiseRentApi;
