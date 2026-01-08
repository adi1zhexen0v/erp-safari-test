import { baseApi } from "@/shared/api";
import type {
  UploadApplicationResponse,
  ReviewApplicationRequest,
  ReviewApplicationResponse,
} from "../types";

export const applicationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    previewResignationApplication: builder.mutation<Blob, number>({
      query: (id) => ({
        url: `/api/hr/resignation-letters/${id}/preview/`,
        method: "GET",
        credentials: "include",
        responseHandler: (response) => response.blob(),
      }),
    }),

    uploadResignationApplication: builder.mutation<UploadApplicationResponse, { id: number; file: File }>({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: `/api/hr/resignation-letters/${id}/upload-application/`,
          method: "POST",
          body: formData,
          credentials: "include",
        };
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "ResignationLetters" as const, id },
        { type: "ResignationLetters" as const, id: "LIST" },
      ],
    }),

    reviewResignationApplication: builder.mutation<
      ReviewApplicationResponse,
      { id: number; data: ReviewApplicationRequest }
    >({
      query: ({ id, data }) => ({
        url: `/api/hr/resignation-letters/${id}/review-application/`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "ResignationLetters" as const, id },
        { type: "ResignationLetters" as const, id: "LIST" },
      ],
    }),
  }),
});

export const {
  usePreviewResignationApplicationMutation,
  useUploadResignationApplicationMutation,
  useReviewResignationApplicationMutation,
} = applicationApi;

