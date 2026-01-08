import { baseApi } from "@/shared/api";
import type {
  PremisesHandoverResponse,
  PremisesHandoverAct,
  PremisesHandoverListResponse,
  SubmitForSigningResponse,
  PremisesHandoverApiPayload,
} from "../types";

export const premisesHandoverApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPremisesHandover: builder.query<PremisesHandoverResponse, number>({
      query: (id) => ({
        url: `/api/legal/premises-handovers/${id}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "PremisesHandovers" as const, id }],
    }),

    getPremisesHandoverList: builder.query<PremisesHandoverAct[], void>({
      query: () => ({
        url: `/api/legal/premises-handovers/`,
        method: "GET",
      }),
      transformResponse: (response: PremisesHandoverListResponse): PremisesHandoverAct[] => response.results,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "PremisesHandovers" as const, id })),
              { type: "PremisesHandovers" as const, id: "LIST" },
            ]
          : [{ type: "PremisesHandovers" as const, id: "LIST" }],
    }),

    submitPremisesHandoverForSigning: builder.mutation<SubmitForSigningResponse, number>({
      query: (id) => ({
        url: `/api/legal/premises-handovers/${id}/submit/`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "PremisesHandovers" as const, id },
        { type: "PremisesHandovers" as const, id: "LIST" },
      ],
    }),

    downloadPremisesHandoverPreview: builder.mutation<Blob, number>({
      query: (id) => ({
        url: `/api/legal/premises-handovers/${id}/preview/`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),

    createPremisesHandover: builder.mutation<PremisesHandoverResponse, PremisesHandoverApiPayload>({
      query: (body) => ({
        url: "/api/legal/premises-handovers/",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "PremisesHandovers" as const, id: "LIST" },
        { type: "PremisesLeases" as const, id: "LIST" },
      ],
    }),

    deletePremisesHandover: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/legal/premises-handovers/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "PremisesHandovers" as const, id },
        { type: "PremisesHandovers" as const, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetPremisesHandoverQuery,
  useGetPremisesHandoverListQuery,
  useSubmitPremisesHandoverForSigningMutation,
  useDownloadPremisesHandoverPreviewMutation,
  useCreatePremisesHandoverMutation,
  useDeletePremisesHandoverMutation,
} = premisesHandoverApi;

