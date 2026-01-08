import { baseApi } from "@/shared/api";
import { type AddressesDto, type AddressesPatchResponse,type AddressesResponse } from "./types";

export const addressesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAddresses: builder.query<AddressesResponse, string>({
      query: (token) => `/api/hr/apply/${token}/addresses/`,
    }),

    updateAddresses: builder.mutation<AddressesPatchResponse, { token: string; body: AddressesDto }>({
      query: ({ token, body }) => ({
        url: `/api/hr/apply/${token}/addresses/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Completeness"],
    }),
  }),
});

export const { useGetAddressesQuery, useUpdateAddressesMutation } = addressesApi;
