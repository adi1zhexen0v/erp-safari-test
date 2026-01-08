import { baseApi } from "@/shared/api";
import type { CreateOrderResponse, UploadOrderResponse } from "../types";

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTerminationOrder: builder.mutation<CreateOrderResponse, number>({
      query: (id) => ({
        url: `/api/hr/resignation-letters/${id}/create-order/`,
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "ResignationLetters" as const, id },
        { type: "ResignationLetters" as const, id: "LIST" },
      ],
    }),

    previewTerminationOrder: builder.mutation<Blob, number>({
      query: (id) => ({
        url: `/api/hr/resignation-letters/${id}/order-preview/`,
        method: "GET",
        credentials: "include",
        responseHandler: (response) => response.blob(),
      }),
    }),

    uploadTerminationOrder: builder.mutation<UploadOrderResponse, { id: number; file: File }>({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: `/api/hr/resignation-letters/${id}/upload-order/`,
          method: "POST",
          body: formData,
          credentials: "include",
        };
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "ResignationLetters" as const, id },
        { type: "ResignationLetters" as const, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateTerminationOrderMutation,
  usePreviewTerminationOrderMutation,
  useUploadTerminationOrderMutation,
} = ordersApi;

