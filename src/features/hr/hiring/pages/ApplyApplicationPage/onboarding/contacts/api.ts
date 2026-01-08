import { baseApi } from "@/shared/api";
import { type ContactsDto, type ContactsPatchResponse,type ContactsResponse } from "./types";

export const contactsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getContacts: builder.query<ContactsResponse, string>({
      query: (token) => `/api/hr/apply/${token}/contacts/`,
    }),

    updateContacts: builder.mutation<ContactsPatchResponse, { token: string; body: ContactsDto }>({
      query: ({ token, body }) => ({
        url: `/api/hr/apply/${token}/contacts/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Completeness"],
    }),
  }),
});

export const { useGetContactsQuery, useUpdateContactsMutation } = contactsApi;
