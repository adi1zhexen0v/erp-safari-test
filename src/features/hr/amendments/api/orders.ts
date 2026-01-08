import { baseApi } from "@/shared/api";
import type { AmendmentOrderResponse, SubmitAgreementResponse } from "../types";

export const ordersApi = baseApi.injectEndpoints({
  endpoints(builder) {
    return {
      createAmendmentOrder: builder.mutation<AmendmentOrderResponse, number>({
        query(id) {
          return {
            url: `/api/hr/amendments/${id}/create-order/`,
            method: "POST",
            body: {},
            credentials: "include",
          };
        },
        invalidatesTags(_result, _error, id) {
          return [
            { type: "Amendments" as const, id },
            { type: "Amendments" as const, id: "LIST" },
          ];
        },
      }),
      previewAmendmentOrder: builder.mutation<Blob, number>({
        query(id) {
          return {
            url: `/api/hr/amendments/${id}/preview-order/`,
            method: "GET",
            credentials: "include",
            responseHandler(response) {
              return response.blob();
            },
          };
        },
      }),
      uploadAmendmentOrder: builder.mutation<AmendmentOrderResponse, { orderId: number; file: File }>({
        query({ orderId, file }) {
          const formData = new FormData();
          formData.append("signed_pdf", file);
          return {
            url: `/api/hr/amendment-orders/${orderId}/upload/`,
            method: "POST",
            body: formData,
            credentials: "include",
          };
        },
        invalidatesTags() {
          return [{ type: "Amendments" as const, id: "LIST" }];
        },
      }),
      submitAgreement: builder.mutation<SubmitAgreementResponse, number>({
        query(id) {
          return {
            url: `/api/hr/amendments/${id}/submit-agreement/`,
            method: "POST",
            body: {},
            credentials: "include",
          };
        },
        invalidatesTags(_result, _error, id) {
          return [
            { type: "Amendments" as const, id },
            { type: "Amendments" as const, id: "LIST" },
          ];
        },
      }),
      previewAgreement: builder.mutation<Blob, number>({
        query(id) {
          return {
            url: `/api/hr/amendments/${id}/preview-agreement/`,
            method: "GET",
            credentials: "include",
            responseHandler(response) {
              return response.blob();
            },
          };
        },
      }),
    };
  },
});

export const {
  useCreateAmendmentOrderMutation,
  usePreviewAmendmentOrderMutation,
  useUploadAmendmentOrderMutation,
  useSubmitAgreementMutation,
  usePreviewAgreementMutation,
} = ordersApi;

