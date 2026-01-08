import { baseApi } from "@/shared/api";
import type { OrderOnHiringResponse, CompleteHiringResponse } from "@/features/hr/contracts/types";

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrderOnHiring: builder.mutation<OrderOnHiringResponse, number>({
      query: (candidateId) => ({
        url: `/api/hr/candidates/${candidateId}/create-order/`,
        method: "POST",
        body: {},
        credentials: "include",
      }),
      invalidatesTags: () => [{ type: "Contracts" as const, id: "LIST" }],
    }),
    // NOTE: All order-on-hiring endpoints use candidateId, not orderId
    // This differs from documentation but matches actual backend behavior
    previewOrderOnHiring: builder.mutation<Blob, number>({
      query: (candidateId) => ({
        url: `/api/hr/orders-on-hiring/${candidateId}/preview/`,
        method: "GET",
        credentials: "include",
        responseHandler: (response) => response.blob(),
      }),
    }),
    uploadOrderOnHiring: builder.mutation<OrderOnHiringResponse, { candidateId: number; file: File }>({
      query: ({ candidateId, file }) => {
        const formData = new FormData();
        formData.append("signed_pdf", file);
        return {
          url: `/api/hr/orders-on-hiring/${candidateId}/upload/`,
          method: "POST",
          body: formData,
          credentials: "include",
        };
      },
      invalidatesTags: (_result, _error, { candidateId }) => [
        { type: "Contracts" as const, id: "LIST" },
        { type: "Applications" as const, id: candidateId },
      ],
    }),
    completeHiring: builder.mutation<CompleteHiringResponse, number>({
      query: (candidateId) => ({
        url: `/api/hr/orders-on-hiring/${candidateId}/complete/`,
        method: "POST",
        body: {},
        credentials: "include",
      }),
      invalidatesTags: () => [{ type: "Contracts" as const, id: "LIST" }],
    }),
  }),
});

export const {
  useCreateOrderOnHiringMutation,
  usePreviewOrderOnHiringMutation,
  useUploadOrderOnHiringMutation,
  useCompleteHiringMutation,
} = ordersApi;
