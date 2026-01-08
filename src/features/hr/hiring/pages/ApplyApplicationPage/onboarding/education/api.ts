import { baseApi } from "@/shared/api";
import { type CreateEducationDto, type CreateEducationResponse, type EducationRecord } from "./types";

export const educationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEducation: builder.query<EducationRecord[], string>({
      query: (token) => `/api/hr/apply/${token}/education/`,
      providesTags: ["Completeness"],
    }),

    createEducation: builder.mutation<CreateEducationResponse, { token: string; body: CreateEducationDto }>({
      query: ({ token, body }) => {
        const form = new FormData();
        form.append("degree", body.degree);
        form.append("university_name", body.university_name);
        form.append("specialty", body.specialty);
        form.append("graduation_year", body.graduation_year);
        form.append("diploma_number", body.diploma_number);
        if (body.diploma_file) {
          form.append("diploma_file", body.diploma_file);
        }
        if (body.diploma_transcript_file) {
          form.append("diploma_transcript_file", body.diploma_transcript_file);
        }

        return {
          url: `/api/hr/apply/${token}/education/`,
          method: "POST",
          body: form,
        };
      },
      invalidatesTags: ["Completeness"],
    }),

    deleteEducation: builder.mutation<void, { token: string; id: number }>({
      query: ({ token, id }) => ({
        url: `/api/hr/apply/${token}/education/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Completeness"],
    }),
  }),
});

export const { useGetEducationQuery, useCreateEducationMutation, useDeleteEducationMutation } = educationApi;
