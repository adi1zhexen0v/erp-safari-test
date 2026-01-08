import { baseApi } from "@/shared/api";
import {
  type VehicleRentApiPayload,
  type VehicleRentResponse,
  type VehicleRentContract,
  type VehicleRentListResponse,
  type SubmitForSigningResponse,
} from "../types";

export const vehicleRentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitVehicleRent: builder.mutation<VehicleRentResponse, VehicleRentApiPayload>({
      query: (body) => ({
        url: "/api/legal/vehicle-rentals/",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "VehicleRentals" as const, id: "LIST" }],
    }),

    updateVehicleRent: builder.mutation<VehicleRentResponse, { id: number; data: VehicleRentApiPayload }>({
      query: ({ id, data }) => ({
        url: `/api/legal/vehicle-rentals/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "VehicleRentals" as const, id },
        { type: "VehicleRentals" as const, id: "LIST" },
      ],
    }),

    getVehicleRent: builder.query<VehicleRentResponse, number>({
      query: (id) => ({
        url: `/api/legal/vehicle-rentals/${id}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "VehicleRentals" as const, id }],
    }),

    getVehicleRentList: builder.query<VehicleRentContract[], void>({
      query: () => ({
        url: `/api/legal/vehicle-rentals/`,
        method: "GET",
      }),
      transformResponse: (response: VehicleRentListResponse): VehicleRentContract[] => response.results,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "VehicleRentals" as const, id })),
              { type: "VehicleRentals" as const, id: "LIST" },
            ]
          : [{ type: "VehicleRentals" as const, id: "LIST" }],
    }),

    submitVehicleRentForSigning: builder.mutation<SubmitForSigningResponse, number>({
      query: (id) => ({
        url: `/api/legal/vehicle-rentals/${id}/submit-for-signing/`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "VehicleRentals" as const, id },
        { type: "VehicleRentals" as const, id: "LIST" },
      ],
    }),

    downloadVehicleRentPreview: builder.mutation<Blob, number>({
      query: (id) => ({
        url: `/api/legal/vehicle-rentals/${id}/preview/`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),

    deleteVehicleRent: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/legal/vehicle-rentals/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "VehicleRentals" as const, id },
        { type: "VehicleRentals" as const, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useSubmitVehicleRentMutation,
  useUpdateVehicleRentMutation,
  useGetVehicleRentQuery,
  useGetVehicleRentListQuery,
  useSubmitVehicleRentForSigningMutation,
  useDownloadVehicleRentPreviewMutation,
  useDeleteVehicleRentMutation,
} = vehicleRentApi;
