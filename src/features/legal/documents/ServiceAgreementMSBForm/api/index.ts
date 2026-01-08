import { baseApi } from "@/shared/api";
import {
  type ServiceAgreementMSBResponse,
  type ServiceAgreementMSBContract,
  type ServiceAgreementMSBListResponse,
  type SubmitForSigningResponse,
  type ServiceAgreementMSBApiPayload,
} from "../types";

export const serviceAgreementMSBApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitServiceAgreementMSB: builder.mutation<ServiceAgreementMSBResponse, ServiceAgreementMSBApiPayload>({
      query: (body) => ({
        url: "/api/legal/service-agreements-msb/",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "ServiceAgreementsMSB" as const, id: "LIST" }],
    }),

    updateServiceAgreementMSB: builder.mutation<
      ServiceAgreementMSBResponse,
      { id: number; data: ServiceAgreementMSBApiPayload }
    >({
      query: ({ id, data }) => ({
        url: `/api/legal/service-agreements-msb/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "ServiceAgreementsMSB" as const, id },
        { type: "ServiceAgreementsMSB" as const, id: "LIST" },
      ],
    }),

    getServiceAgreementMSB: builder.query<ServiceAgreementMSBResponse, number>({
      query: (id) => ({
        url: `/api/legal/service-agreements-msb/${id}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "ServiceAgreementsMSB" as const, id }],
    }),

    getServiceAgreementMSBList: builder.query<ServiceAgreementMSBContract[], void>({
      query: () => ({
        url: "/api/legal/service-agreements-msb/",
        method: "GET",
      }),
      transformResponse: (response: ServiceAgreementMSBListResponse): ServiceAgreementMSBContract[] => response.results,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "ServiceAgreementsMSB" as const, id })),
              { type: "ServiceAgreementsMSB" as const, id: "LIST" },
            ]
          : [{ type: "ServiceAgreementsMSB" as const, id: "LIST" }],
    }),

    submitServiceAgreementMSBForSigning: builder.mutation<SubmitForSigningResponse, number>({
      query: (id) => ({
        url: `/api/legal/service-agreements-msb/${id}/submit-for-signing/`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "ServiceAgreementsMSB" as const, id },
        { type: "ServiceAgreementsMSB" as const, id: "LIST" },
      ],
    }),

    downloadServiceAgreementMSBPreview: builder.mutation<Blob, number>({
      query: (id) => ({
        url: `/api/legal/service-agreements-msb/${id}/preview/`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),

    deleteServiceAgreementMSB: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/legal/service-agreements-msb/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "ServiceAgreementsMSB" as const, id },
        { type: "ServiceAgreementsMSB" as const, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useSubmitServiceAgreementMSBMutation,
  useUpdateServiceAgreementMSBMutation,
  useGetServiceAgreementMSBQuery,
  useGetServiceAgreementMSBListQuery,
  useSubmitServiceAgreementMSBForSigningMutation,
  useDownloadServiceAgreementMSBPreviewMutation,
  useDeleteServiceAgreementMSBMutation,
} = serviceAgreementMSBApi;
