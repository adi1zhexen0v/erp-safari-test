import { baseApi } from "@/shared/api";
import type {
  ApplicationDetailResponse,
  CreateCandidateDto,
  CreateCandidateResponse,
  GetApplicationsResponse,
  RejectApplicationDto,
  RejectApplicationResponse,
  ReviewApplicationDto,
  ReviewApplicationResponse,
} from "@/features/hr/hiring";

export const hiringApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCandidate: builder.mutation<CreateCandidateResponse, CreateCandidateDto>({
      query: (body) => ({
        url: "/api/hr/invitations/",
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: [{ type: "Applications" as const, id: "LIST" }],
    }),

    getApplications: builder.query<GetApplicationsResponse[], { stage?: string; status?: string }>({
      query: ({ stage, status }) => {
        const params = new URLSearchParams();
        if (stage) params.append("stage", stage);
        if (status) params.append("status", status);

        return {
          url: `/api/hr/applications/?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: [{ type: "Applications" as const, id: "LIST" }],
    }),

    getApplicationDetail: builder.query<ApplicationDetailResponse, number>({
      query: (id) => ({
        url: `/api/hr/applications/${id}/`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (_result, _error, id) => [{ type: "Applications" as const, id }],
    }),

    reviewHiringApplication: builder.mutation<ReviewApplicationResponse, ReviewApplicationDto>({
      query: ({ id, action, notes }) => ({
        url: `/api/hr/applications/${id}/review/`,
        method: "POST",
        body: { action, ...(notes ? { notes } : {}) },
        credentials: "include",
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Applications" as const, id },
        { type: "Applications" as const, id: "LIST" },
      ],
    }),

    rejectHiringApplication: builder.mutation<RejectApplicationResponse, RejectApplicationDto>({
      query: ({ id, rejection_reason }) => ({
        url: `/api/hr/applications/${id}/reject/`,
        method: "POST",
        body: { rejection_reason },
        credentials: "include",
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Applications" as const, id },
        { type: "Applications" as const, id: "LIST" },
      ],
    }),

    downloadApplicationProfilePreview: builder.mutation<Blob, number>({
      query: (id) => ({
        url: `/api/hr/applications/${id}/preview-profile/`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useCreateCandidateMutation: useHiringCreateCandidateMutation,
  useGetApplicationsQuery: useHiringGetApplicationsQuery,
  useGetApplicationDetailQuery: useHiringGetApplicationDetailQuery,
  useReviewHiringApplicationMutation: useHiringReviewApplicationMutation,
  useRejectHiringApplicationMutation: useHiringRejectApplicationMutation,
  useDownloadApplicationProfilePreviewMutation: useHiringDownloadApplicationProfilePreviewMutation,
} = hiringApi;

