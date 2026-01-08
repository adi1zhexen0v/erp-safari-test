import { baseApi } from "@/shared/api";
import type {
  GenerateTimesheetDto,
  UpdateTimesheetEntryDto,
  TimesheetResponse,
  TimesheetEntryResponse,
} from "../types";

export const timesheetsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTimesheets: builder.query<TimesheetResponse[], void>({
      query: () => ({
        url: `/api/accounting/timesheets/`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: [{ type: "Timesheets" as const, id: "LIST" }],
    }),
    getTimesheetDetail: builder.query<TimesheetResponse, number>({
      query: (id) => ({
        url: `/api/accounting/timesheets/${id}/`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (_result, _error, id) => [{ type: "Timesheets" as const, id }],
    }),
    generateTimesheet: builder.mutation<TimesheetResponse, GenerateTimesheetDto>({
      query: (body) => ({
        url: `/api/accounting/timesheets/generate/`,
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: [{ type: "Timesheets" as const, id: "LIST" }],
    }),
    approveTimesheet: builder.mutation<TimesheetResponse, number>({
      query: (id) => ({
        url: `/api/accounting/timesheets/${id}/approve/`,
        method: "POST",
        body: {},
        credentials: "include",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Timesheets" as const, id },
        { type: "Timesheets" as const, id: "LIST" },
      ],
    }),
    deleteTimesheet: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/accounting/timesheets/${id}/`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: [{ type: "Timesheets" as const, id: "LIST" }],
    }),
    updateTimesheetEntry: builder.mutation<TimesheetEntryResponse, { id: number; body: UpdateTimesheetEntryDto }>({
      query: ({ id, body }) => ({
        url: `/api/accounting/timesheet-entries/${id}/`,
        method: "PATCH",
        body,
        credentials: "include",
      }),
      invalidatesTags: () => {
        return [{ type: "Timesheets" as const, id: "LIST" }];
      },
    }),
    downloadTimesheetPreview: builder.mutation<Blob, number>({
      query: (id) => ({
        url: `/api/accounting/timesheets/${id}/preview/`,
        method: "GET",
        credentials: "include",
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useGetTimesheetsQuery,
  useGetTimesheetDetailQuery,
  useLazyGetTimesheetDetailQuery,
  useGenerateTimesheetMutation,
  useApproveTimesheetMutation,
  useDeleteTimesheetMutation,
  useUpdateTimesheetEntryMutation,
  useDownloadTimesheetPreviewMutation,
} = timesheetsApi;

