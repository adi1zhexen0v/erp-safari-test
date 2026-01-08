import { baseApi } from "@/shared/api";
import {
  type GoodsSupplyApiPayload,
  type GoodsSupplyResponse,
  type GoodsSupplyContract,
  type GoodsSupplyListResponse,
  type SubmitForSigningResponse,
} from "../types";

export const goodsSupplyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitGoodsSupply: builder.mutation<GoodsSupplyResponse, GoodsSupplyApiPayload>({
      query: (body) => ({
        url: "/api/legal/goods-supply/",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "GoodsSupply" as const, id: "LIST" }],
    }),

    updateGoodsSupply: builder.mutation<GoodsSupplyResponse, { id: number; data: GoodsSupplyApiPayload }>({
      query: ({ id, data }) => ({
        url: `/api/legal/goods-supply/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "GoodsSupply" as const, id },
        { type: "GoodsSupply" as const, id: "LIST" },
      ],
    }),

    getGoodsSupply: builder.query<GoodsSupplyResponse, number>({
      query: (id) => ({
        url: `/api/legal/goods-supply/${id}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "GoodsSupply" as const, id }],
    }),

    getGoodsSupplyList: builder.query<GoodsSupplyContract[], void>({
      query: () => ({
        url: "/api/legal/goods-supply/",
        method: "GET",
      }),
      transformResponse: (response: GoodsSupplyListResponse): GoodsSupplyContract[] => response.results,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "GoodsSupply" as const, id })),
              { type: "GoodsSupply" as const, id: "LIST" },
            ]
          : [{ type: "GoodsSupply" as const, id: "LIST" }],
    }),

    submitGoodsSupplyForSigning: builder.mutation<SubmitForSigningResponse, number>({
      query: (id) => ({
        url: `/api/legal/goods-supply/${id}/submit/`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "GoodsSupply" as const, id },
        { type: "GoodsSupply" as const, id: "LIST" },
      ],
    }),

    downloadGoodsSupplyPreview: builder.mutation<Blob, number>({
      query: (id) => ({
        url: `/api/legal/goods-supply/${id}/preview/`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),

    deleteGoodsSupply: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/legal/goods-supply/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "GoodsSupply" as const, id },
        { type: "GoodsSupply" as const, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useSubmitGoodsSupplyMutation,
  useUpdateGoodsSupplyMutation,
  useGetGoodsSupplyQuery,
  useGetGoodsSupplyListQuery,
  useSubmitGoodsSupplyForSigningMutation,
  useDownloadGoodsSupplyPreviewMutation,
  useDeleteGoodsSupplyMutation,
} = goodsSupplyApi;
