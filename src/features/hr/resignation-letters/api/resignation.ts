import { baseApi } from "@/shared/api";
import type {
  CreateResignationLetterDto,
  ResignationLetterResponse,
  UpdateResignationLetterDto,
  SubmitResponse,
  CancelResponse,
} from "../types";

export const resignationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getResignationLetters: builder.query<ResignationLetterResponse[], void>({
      query: () => ({
        url: "/api/hr/resignation-letters/",
        method: "GET",
        credentials: "include",
      }),
      providesTags: [{ type: "ResignationLetters" as const, id: "LIST" }],
    }),

    getResignationLetter: builder.query<ResignationLetterResponse, number>({
      query: (id) => ({
        url: `/api/hr/resignation-letters/${id}/`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (_result, _error, id) => [{ type: "ResignationLetters" as const, id }],
    }),

    createResignationLetter: builder.mutation<ResignationLetterResponse, CreateResignationLetterDto>({
      query: (body) => ({
        url: "/api/hr/resignation-letters/",
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: [
        { type: "NGOWorkers" as const, id: "LIST" },
        { type: "ResignationLetters" as const, id: "LIST" },
      ],
    }),

    updateResignationLetter: builder.mutation<
      ResignationLetterResponse,
      { id: number; data: UpdateResignationLetterDto }
    >({
      query: ({ id, data }) => ({
        url: `/api/hr/resignation-letters/${id}/`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "ResignationLetters" as const, id },
        { type: "ResignationLetters" as const, id: "LIST" },
      ],
    }),

    deleteResignationLetter: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/hr/resignation-letters/${id}/`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: [
        { type: "ResignationLetters" as const, id: "LIST" },
        { type: "NGOWorkers" as const, id: "LIST" },
      ],
    }),

    submitResignationLetter: builder.mutation<SubmitResponse, number>({
      query: (id) => ({
        url: `/api/hr/resignation-letters/${id}/submit/`,
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "ResignationLetters" as const, id },
        { type: "ResignationLetters" as const, id: "LIST" },
      ],
    }),

    cancelResignationLetter: builder.mutation<CancelResponse, number>({
      query: (id) => ({
        url: `/api/hr/resignation-letters/${id}/cancel/`,
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "ResignationLetters" as const, id },
        { type: "ResignationLetters" as const, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetResignationLettersQuery,
  useGetResignationLetterQuery,
  useLazyGetResignationLetterQuery,
  useCreateResignationLetterMutation,
  useUpdateResignationLetterMutation,
  useDeleteResignationLetterMutation,
  useSubmitResignationLetterMutation,
  useCancelResignationLetterMutation,
} = resignationApi;

