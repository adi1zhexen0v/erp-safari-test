import { baseApi } from "@/shared/api";
import type {
  ServiceContractApiPayload,
  ServiceContractResponse,
  ServiceContractContract,
  ServiceContractListResponse,
  SubmitForSigningResponse,
} from "../types";

export const serviceContractApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitServiceContract: builder.mutation<ServiceContractResponse, ServiceContractApiPayload>({
      query: (body) => ({
        url: "/api/legal/service-agreements-individual/",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "ServiceAgreementsIndividual" as const, id: "LIST" }],
    }),

    updateServiceContract: builder.mutation<
      ServiceContractResponse,
      { id: number; data: ServiceContractApiPayload }
    >({
      query: ({ id, data }) => ({
        url: `/api/legal/service-agreements-individual/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "ServiceAgreementsIndividual" as const, id },
        { type: "ServiceAgreementsIndividual" as const, id: "LIST" },
      ],
    }),

    getServiceContract: builder.query<ServiceContractResponse, number>({
      query: (id) => ({
        url: `/api/legal/service-agreements-individual/${id}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "ServiceAgreementsIndividual" as const, id }],
    }),

    getServiceContractList: builder.query<ServiceContractContract[], void>({
      query: () => ({
        url: `/api/legal/service-agreements-individual/`,
        method: "GET",
      }),
      transformResponse: (response: ServiceContractListResponse): ServiceContractContract[] =>
        response.results,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "ServiceAgreementsIndividual" as const, id })),
              { type: "ServiceAgreementsIndividual" as const, id: "LIST" },
            ]
          : [{ type: "ServiceAgreementsIndividual" as const, id: "LIST" }],
    }),

    submitServiceContractForSigning: builder.mutation<SubmitForSigningResponse, number>({
      query: (id) => ({
        url: `/api/legal/service-agreements-individual/${id}/submit-for-signing/`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "ServiceAgreementsIndividual" as const, id },
        { type: "ServiceAgreementsIndividual" as const, id: "LIST" },
      ],
    }),

    downloadServiceContractPreview: builder.mutation<Blob, number>({
      query: (id) => ({
        url: `/api/legal/service-agreements-individual/${id}/preview/`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),

    deleteServiceContract: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/legal/service-agreements-individual/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "ServiceAgreementsIndividual" as const, id },
        { type: "ServiceAgreementsIndividual" as const, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useSubmitServiceContractMutation,
  useUpdateServiceContractMutation,
  useGetServiceContractQuery,
  useGetServiceContractListQuery,
  useSubmitServiceContractForSigningMutation,
  useDownloadServiceContractPreviewMutation,
  useDeleteServiceContractMutation,
} = serviceContractApi;

