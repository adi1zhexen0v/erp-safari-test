import { baseApi } from "@/shared/api";
import {
  type EmergencyContactsDto,
  type EmergencyContactsPatchResponse,
  type EmergencyContactsResponse,
} from "./types";

export const emergencyContactsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmergencyContacts: builder.query<EmergencyContactsResponse, string>({
      query: (token) => `/api/hr/apply/${token}/emergency-contacts/`,
    }),

    updateEmergencyContacts: builder.mutation<
      EmergencyContactsPatchResponse,
      { token: string; body: EmergencyContactsDto }
    >({
      query: ({ token, body }) => ({
        url: `/api/hr/apply/${token}/emergency-contacts/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Completeness"],
    }),
  }),
});

export const { useGetEmergencyContactsQuery, useUpdateEmergencyContactsMutation } = emergencyContactsApi;
