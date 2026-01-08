import { baseApi } from "@/shared/api";
import type {
  JobApplication,
  JobApplicationReviewRequest,
  JobApplicationReviewResponse,
} from "@/features/hr/contracts/types";

export const jobApplicationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    previewJobApplication: builder.mutation<Blob, number>({
      query: (candidateId) => ({
        url: `/api/hr/candidates/${candidateId}/preview-job-application/`,
        method: "GET",
        credentials: "include",
        responseHandler: (response) => response.blob(),
      }),
    }),
    uploadJobApplication: builder.mutation<JobApplication, { candidateId: number; file: File }>({
      query: ({ candidateId, file }) => {
        const formData = new FormData();
        formData.append("signed_pdf", file);
        return {
          url: `/api/hr/candidates/${candidateId}/upload-job-application/`,
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
    reviewJobApplication: builder.mutation<
      JobApplicationReviewResponse,
      { candidateId: number; body: JobApplicationReviewRequest }
    >({
      query: ({ candidateId, body }) => ({
        url: `/api/hr/candidates/${candidateId}/review-job-application/`,
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: (_result, _error, { candidateId }) => [
        { type: "Contracts" as const, id: "LIST" },
        { type: "Applications" as const, id: candidateId },
      ],
    }),
  }),
});

export const {
  usePreviewJobApplicationMutation,
  useUploadJobApplicationMutation,
  useReviewJobApplicationMutation,
} = jobApplicationsApi;
