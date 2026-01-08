import { baseApi } from "@/shared/api";
import { type IdDocumentsDto, type IdDocumentsPostResponse, type IdDocumentsResponse } from "./types";

export const idDocumentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getIdDocuments: builder.query<IdDocumentsResponse, string>({
      query: (token) => `/api/hr/apply/${token}/id-documents/`,
      providesTags: ["Completeness"],
    }),

    submitIdDocuments: builder.mutation<IdDocumentsPostResponse, { token: string; body: IdDocumentsDto }>({
      query: ({ token, body }) => {
        const form = new FormData();

        form.append("national_id_number", body.national_id_number);
        form.append("national_id_issue_date", body.national_id_issue_date);
        form.append("national_id_expiry_date", body.national_id_expiry_date);
        form.append("national_id_issued_by", body.national_id_issued_by);
        if (body.national_id_file) {
          form.append("national_id_file", body.national_id_file);
        }
        if (body.military_certificate_file) {
          form.append("military_certificate_file", body.military_certificate_file);
        }

        return {
          url: `/api/hr/apply/${token}/id-documents/`,
          method: "POST",
          body: form,
        };
      },
      invalidatesTags: ["Completeness"],
    }),
  }),
});

export const { useGetIdDocumentsQuery, useSubmitIdDocumentsMutation } = idDocumentsApi;
