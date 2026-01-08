import { baseApi } from "@/shared/api";
import type {
  ApplicationStatusResponse,
  ReviewApplicationRequest,
} from "../types";

export const applicationApi = baseApi.injectEndpoints({
  endpoints(builder) {
    return {
      previewApplication: builder.mutation<Blob, number>({
        query(id) {
          return {
            url: `/api/hr/amendments/${id}/preview-application/`,
            method: "GET",
            credentials: "include",
            responseHandler(response) {
              return response.blob();
            },
          };
        },
      }),
      uploadApplication: builder.mutation<ApplicationStatusResponse, { id: number; file: File }>({
        query({ id, file }) {
          const formData = new FormData();
          formData.append("signed_pdf", file);
          return {
            url: `/api/hr/amendments/${id}/upload-application/`,
            method: "POST",
            body: formData,
            credentials: "include",
          };
        },
        invalidatesTags(_result, _error, { id }) {
          return [
            { type: "Amendments" as const, id },
            { type: "Amendments" as const, id: "LIST" },
          ];
        },
      }),
      reviewApplication: builder.mutation<ApplicationStatusResponse, { id: number; data: ReviewApplicationRequest }>({
        query({ id, data }) {
          return {
            url: `/api/hr/amendments/${id}/review-application/`,
            method: "POST",
            body: data,
            credentials: "include",
          };
        },
        invalidatesTags(_result, _error, { id }) {
          return [
            { type: "Amendments" as const, id },
            { type: "Amendments" as const, id: "LIST" },
          ];
        },
      }),
    };
  },
});

export const {
  usePreviewApplicationMutation,
  useUploadApplicationMutation,
  useReviewApplicationMutation,
} = applicationApi;

