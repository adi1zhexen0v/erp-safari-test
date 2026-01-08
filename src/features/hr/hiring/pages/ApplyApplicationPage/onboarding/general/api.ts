import { baseApi } from "@/shared/api";
import { type PersonalInfoDto, type PersonalInfoPostResponse, type PersonalInfoResponse } from "./types";

export const personalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPersonalInfo: builder.query<PersonalInfoResponse, string>({
      query: (token) => `/api/hr/apply/${token}/personal/`,
      providesTags: ["Completeness"],
    }),

    createPersonalInfo: builder.mutation<PersonalInfoPostResponse, { token: string; body: PersonalInfoDto }>({
      query: ({ token, body }) => {
        const formData = new FormData();

        formData.append("iin", body.iin);
        formData.append("name", body.name);
        formData.append("surname", body.surname);
        formData.append("father_name", body.father_name ?? "");
        formData.append("date_of_birth", body.date_of_birth);
        formData.append("gender", body.gender);
        formData.append("family_status", body.family_status);
        formData.append("city_of_birth_id", String(body.city_of_birth_id));
        formData.append("nationality", body.nationality);
        formData.append("citizenship", body.citizenship);
        formData.append("is_resident", String(body.is_resident));
        formData.append("is_student", String(body.is_student));

        if (body.photo_file) {
          formData.append("photo_file", body.photo_file);
        }

        if (body.enrollment_verification_file) {
          formData.append("enrollment_verification_file", body.enrollment_verification_file);
        }

        return {
          url: `/api/hr/apply/${token}/personal/`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Completeness"],
    }),
  }),
});

export const { useGetPersonalInfoQuery, useCreatePersonalInfoMutation } = personalApi;
