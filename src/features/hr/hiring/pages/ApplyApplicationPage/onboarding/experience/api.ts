import { baseApi } from "@/shared/api";
import {
  type CreateExperienceDto,
  type CreateExperienceResponse,
  type ExperienceRecord,
  type WorkProofStatus,
  type WorkProofUploadResponse,
} from "./types";

export const experienceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExperience: builder.query<ExperienceRecord[], string>({
      query: (token) => `/api/hr/apply/${token}/experience/`,
      providesTags: ["Completeness"],
    }),

    createExperience: builder.mutation<CreateExperienceResponse, { token: string; body: CreateExperienceDto }>({
      query: ({ token, body }) => ({
        url: `/api/hr/apply/${token}/experience/`,
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["Completeness"],
    }),

    getWorkProofStatus: builder.query<WorkProofStatus, string>({
      query: (token) => `/api/hr/apply/${token}/work-proof/`,
      providesTags: ["Completeness"],
    }),

    uploadWorkProof: builder.mutation<WorkProofUploadResponse, { token: string; file: File }>({
      query: ({ token, file }) => {
        const form = new FormData();
        form.append("work_proof_file", file);

        return {
          url: `/api/hr/apply/${token}/work-proof/`,
          method: "POST",
          body: form,
        };
      },
      invalidatesTags: ["Completeness"],
    }),

    deleteExperience: builder.mutation<void, { token: string; id: number }>({
      query: ({ token, id }) => ({
        url: `/api/hr/apply/${token}/experience/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Completeness"],
    }),
  }),
});

export const {
  useGetExperienceQuery,
  useCreateExperienceMutation,
  useGetWorkProofStatusQuery,
  useUploadWorkProofMutation,
  useDeleteExperienceMutation,
} = experienceApi;
