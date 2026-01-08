import { baseApi } from "@/shared/api";
import type {
  CompletionAct,
  CompletionActListItem,
  CompletionActCreatePayload,
  CompletionActUpdatePayload,
  CompletionActRejectPayload,
  CompletionActApproveResponse,
  AvailableServiceItem,
  DocumentUrlResponse,
} from "../types";

export const completionActApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCompletionActList: builder.query<CompletionActListItem[], void>({
      query: () => ({
        url: "/api/legal/completion-acts/",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "CompletionActs" as const, id })),
              { type: "CompletionActs" as const, id: "LIST" },
            ]
          : [{ type: "CompletionActs" as const, id: "LIST" }],
    }),

    getCompletionAct: builder.query<CompletionAct, number>({
      query: (id) => ({
        url: `/api/legal/completion-acts/${id}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "CompletionActs" as const, id }],
    }),

    createCompletionAct: builder.mutation<CompletionAct, CompletionActCreatePayload>({
      query: (body) => ({
        url: "/api/legal/completion-acts/",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, payload) => [
        { type: "CompletionActs" as const, id: "LIST" },
        { type: "ServiceAgreementsIndividual" as const, id: "LIST" },
        { type: "AvailableServices" as const, id: payload.parent_contract },
        { type: "AvailableServices" as const, id: "LIST" },
      ],
    }),

    updateCompletionAct: builder.mutation<CompletionAct, { id: number; payload: CompletionActUpdatePayload }>({
      query: ({ id, payload }) => ({
        url: `/api/legal/completion-acts/${id}/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (result, error, { id, payload }) => {
        const contractId = result?.parent_contract?.id;
        if (contractId) {
          return [
            { type: "CompletionActs" as const, id },
            { type: "CompletionActs" as const, id: "LIST" },
            { type: "AvailableServices" as const, id: contractId },
            { type: "AvailableServices" as const, id: "LIST" },
          ];
        }
        return [
          { type: "CompletionActs" as const, id },
          { type: "CompletionActs" as const, id: "LIST" },
        ];
      },
    }),

    deleteCompletionAct: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/legal/completion-acts/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "CompletionActs" as const, id },
        { type: "CompletionActs" as const, id: "LIST" },
        { type: "AvailableServices" as const, id: "LIST" },
      ],
    }),

    uploadCompletionActDocument: builder.mutation<CompletionAct, { id: number; file: File }>({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: `/api/legal/completion-acts/${id}/upload-document/`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "CompletionActs" as const, id },
        { type: "CompletionActs" as const, id: "LIST" },
      ],
    }),

    submitCompletionAct: builder.mutation<CompletionAct, number>({
      query: (id) => ({
        url: `/api/legal/completion-acts/${id}/submit/`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => {
        const contractId = result?.parent_contract?.id;
        if (contractId) {
          return [
            { type: "CompletionActs" as const, id },
            { type: "CompletionActs" as const, id: "LIST" },
            { type: "AvailableServices" as const, id: contractId },
            { type: "AvailableServices" as const, id: "LIST" },
          ];
        }
        return [
          { type: "CompletionActs" as const, id },
          { type: "CompletionActs" as const, id: "LIST" },
        ];
      },
    }),

    approveCompletionAct: builder.mutation<CompletionActApproveResponse, number>({
      query: (id) => ({
        url: `/api/legal/completion-acts/${id}/approve/`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => {
        const contractId = result?.act?.parent_contract?.id;
        if (contractId) {
          return [
            { type: "CompletionActs" as const, id },
            { type: "CompletionActs" as const, id: "LIST" },
            { type: "AvailableServices" as const, id: contractId },
            { type: "AvailableServices" as const, id: "LIST" },
          ];
        }
        return [
          { type: "CompletionActs" as const, id },
          { type: "CompletionActs" as const, id: "LIST" },
        ];
      },
    }),

    rejectCompletionAct: builder.mutation<CompletionAct, { id: number; payload: CompletionActRejectPayload }>({
      query: ({ id, payload }) => ({
        url: `/api/legal/completion-acts/${id}/reject/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => {
        const contractId = result?.parent_contract?.id;
        if (contractId) {
          return [
            { type: "CompletionActs" as const, id },
            { type: "CompletionActs" as const, id: "LIST" },
            { type: "AvailableServices" as const, id: contractId },
            { type: "AvailableServices" as const, id: "LIST" },
          ];
        }
        return [
          { type: "CompletionActs" as const, id },
          { type: "CompletionActs" as const, id: "LIST" },
        ];
      },
    }),

    getCompletionActDocument: builder.query<DocumentUrlResponse, { id: number; download?: boolean }>({
      query: ({ id, download = false }) => ({
        url: `/api/legal/completion-acts/${id}/document/?download=${download}`,
        method: "GET",
      }),
    }),

    getAvailableServices: builder.query<AvailableServiceItem[], number>({
      query: (contractId) => ({
        url: `/api/legal/completion-acts/available-services/${contractId}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, contractId) => [
        { type: "AvailableServices" as const, id: contractId },
        { type: "AvailableServices" as const, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetCompletionActListQuery,
  useGetCompletionActQuery,
  useCreateCompletionActMutation,
  useUpdateCompletionActMutation,
  useDeleteCompletionActMutation,
  useUploadCompletionActDocumentMutation,
  useSubmitCompletionActMutation,
  useApproveCompletionActMutation,
  useRejectCompletionActMutation,
  useGetCompletionActDocumentQuery,
  useLazyGetCompletionActDocumentQuery,
  useGetAvailableServicesQuery,
} = completionActApi;
