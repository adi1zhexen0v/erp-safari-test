import { baseApi } from "@/shared/api";
import type {
  VehicleHandoverResponse,
  VehicleHandoverAct,
  VehicleHandoverListResponse,
  SubmitForSigningResponse,
  VehicleHandoverApiPayload,
} from "../types";

export const vehicleHandoverApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVehicleHandover: builder.query<VehicleHandoverResponse, number>({
      query: (id) => ({
        url: `/api/legal/vehicle-handovers/${id}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "VehicleHandovers" as const, id }],
    }),

    getVehicleHandoverList: builder.query<VehicleHandoverAct[], void>({
      query: () => ({
        url: `/api/legal/vehicle-handovers/`,
        method: "GET",
      }),
      transformResponse: (response: VehicleHandoverListResponse): VehicleHandoverAct[] => response.results,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "VehicleHandovers" as const, id })),
              { type: "VehicleHandovers" as const, id: "LIST" },
            ]
          : [{ type: "VehicleHandovers" as const, id: "LIST" }],
    }),

    submitVehicleHandoverForSigning: builder.mutation<SubmitForSigningResponse, number>({
      query: (id) => ({
        url: `/api/legal/vehicle-handovers/${id}/submit/`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "VehicleHandovers" as const, id },
        { type: "VehicleHandovers" as const, id: "LIST" },
      ],
    }),

    downloadVehicleHandoverPreview: builder.mutation<Blob, number>({
      query: (id) => ({
        url: `/api/legal/vehicle-handovers/${id}/preview/`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),

    createVehicleHandover: builder.mutation<VehicleHandoverResponse, VehicleHandoverApiPayload>({
      query: (body) => ({
        url: "/api/legal/vehicle-handovers/",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "VehicleHandovers" as const, id: "LIST" },
        { type: "VehicleRentals" as const, id: "LIST" },
      ],
    }),

    deleteVehicleHandover: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/legal/vehicle-handovers/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "VehicleHandovers" as const, id },
        { type: "VehicleHandovers" as const, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetVehicleHandoverQuery,
  useGetVehicleHandoverListQuery,
  useSubmitVehicleHandoverForSigningMutation,
  useDownloadVehicleHandoverPreviewMutation,
  useCreateVehicleHandoverMutation,
  useDeleteVehicleHandoverMutation,
} = vehicleHandoverApi;

