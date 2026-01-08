import { baseApi } from "@/shared/api";
import type {
  AnnualLeaveResponse,
  UnpaidLeaveResponse,
  MedicalLeaveResponse,
  CreateAnnualLeaveDto,
  CreateUnpaidLeaveDto,
  CreateMedicalLeaveDto,
  UpdateAnnualLeaveDto,
  UpdateUnpaidLeaveDto,
  UpdateMedicalLeaveDto,
} from "../types";

export const leavesApi = baseApi.injectEndpoints({
  endpoints(builder) {
    return {
      getAnnualLeaves: builder.query<AnnualLeaveResponse[], void>({
        query() {
          return {
            url: "/api/hr/annual-leaves/",
            method: "GET",
            credentials: "include",
          };
        },
        providesTags: [{ type: "LeaveApplications" as const, id: "LIST" }],
      }),
      getUnpaidLeaves: builder.query<UnpaidLeaveResponse[], void>({
        query() {
          return {
            url: "/api/hr/unpaid-leaves/",
            method: "GET",
            credentials: "include",
          };
        },
        providesTags: [{ type: "LeaveApplications" as const, id: "LIST" }],
      }),
      getMedicalLeaves: builder.query<MedicalLeaveResponse[], void>({
        query() {
          return {
            url: "/api/hr/medical-leaves/",
            method: "GET",
            credentials: "include",
          };
        },
        providesTags: [{ type: "LeaveApplications" as const, id: "LIST" }],
      }),
      getAnnualLeave: builder.query<AnnualLeaveResponse, number>({
        query(id) {
          return {
            url: `/api/hr/annual-leaves/${id}/`,
            method: "GET",
            credentials: "include",
          };
        },
        providesTags(_result, _error, id) {
          return [{ type: "LeaveApplications" as const, id }];
        },
      }),
      getUnpaidLeave: builder.query<UnpaidLeaveResponse, number>({
        query(id) {
          return {
            url: `/api/hr/unpaid-leaves/${id}/`,
            method: "GET",
            credentials: "include",
          };
        },
        providesTags(_result, _error, id) {
          return [{ type: "LeaveApplications" as const, id }];
        },
      }),
      getMedicalLeave: builder.query<MedicalLeaveResponse, number>({
        query(id) {
          return {
            url: `/api/hr/medical-leaves/${id}/`,
            method: "GET",
            credentials: "include",
          };
        },
        providesTags(_result, _error, id) {
          return [{ type: "LeaveApplications" as const, id }];
        },
      }),
      createAnnualLeave: builder.mutation<AnnualLeaveResponse, CreateAnnualLeaveDto>({
        query(body) {
          return {
            url: "/api/hr/annual-leaves/",
            method: "POST",
            body,
            credentials: "include",
          };
        },
        invalidatesTags: [{ type: "LeaveApplications" as const, id: "LIST" }],
      }),
      createUnpaidLeave: builder.mutation<UnpaidLeaveResponse, CreateUnpaidLeaveDto>({
        query(body) {
          return {
            url: "/api/hr/unpaid-leaves/",
            method: "POST",
            body,
            credentials: "include",
          };
        },
        invalidatesTags: [{ type: "LeaveApplications" as const, id: "LIST" }],
      }),
      createMedicalLeave: builder.mutation<MedicalLeaveResponse, CreateMedicalLeaveDto>({
        query(body) {
          return {
            url: "/api/hr/medical-leaves/",
            method: "POST",
            body,
            credentials: "include",
          };
        },
        invalidatesTags: [{ type: "LeaveApplications" as const, id: "LIST" }],
      }),
      updateAnnualLeave: builder.mutation<AnnualLeaveResponse, { id: number; data: UpdateAnnualLeaveDto }>({
        query({ id, data }) {
          return {
            url: `/api/hr/annual-leaves/${id}/`,
            method: "PATCH",
            body: data,
            credentials: "include",
          };
        },
        invalidatesTags(_result, _error, { id }) {
          return [
            { type: "LeaveApplications" as const, id },
            { type: "LeaveApplications" as const, id: "LIST" },
          ];
        },
      }),
      updateUnpaidLeave: builder.mutation<UnpaidLeaveResponse, { id: number; data: UpdateUnpaidLeaveDto }>({
        query({ id, data }) {
          return {
            url: `/api/hr/unpaid-leaves/${id}/`,
            method: "PATCH",
            body: data,
            credentials: "include",
          };
        },
        invalidatesTags(_result, _error, { id }) {
          return [
            { type: "LeaveApplications" as const, id },
            { type: "LeaveApplications" as const, id: "LIST" },
          ];
        },
      }),
      updateMedicalLeave: builder.mutation<MedicalLeaveResponse, { id: number; data: UpdateMedicalLeaveDto }>({
        query({ id, data }) {
          return {
            url: `/api/hr/medical-leaves/${id}/`,
            method: "PATCH",
            body: data,
            credentials: "include",
          };
        },
        invalidatesTags(_result, _error, { id }) {
          return [
            { type: "LeaveApplications" as const, id },
            { type: "LeaveApplications" as const, id: "LIST" },
          ];
        },
      }),
      deleteAnnualLeave: builder.mutation<void, number>({
        query(id) {
          return {
            url: `/api/hr/annual-leaves/${id}/`,
            method: "DELETE",
            credentials: "include",
          };
        },
        invalidatesTags: [{ type: "LeaveApplications" as const, id: "LIST" }],
      }),
      deleteUnpaidLeave: builder.mutation<void, number>({
        query(id) {
          return {
            url: `/api/hr/unpaid-leaves/${id}/`,
            method: "DELETE",
            credentials: "include",
          };
        },
        invalidatesTags: [{ type: "LeaveApplications" as const, id: "LIST" }],
      }),
      deleteMedicalLeave: builder.mutation<void, number>({
        query(id) {
          return {
            url: `/api/hr/medical-leaves/${id}/`,
            method: "DELETE",
            credentials: "include",
          };
        },
        invalidatesTags: [{ type: "LeaveApplications" as const, id: "LIST" }],
      }),
      completeAnnualLeave: builder.mutation<{ success: boolean; message: string; data: { id: number; status: string } }, number>({
        query(id) {
          return {
            url: `/api/hr/annual-leaves/${id}/complete/`,
            method: "POST",
            credentials: "include",
          };
        },
        invalidatesTags(_result, _error, id) {
          return [
            { type: "LeaveApplications" as const, id },
            { type: "LeaveApplications" as const, id: "LIST" },
          ];
        },
      }),
      completeUnpaidLeave: builder.mutation<{ success: boolean; message: string; data: { id: number; status: string } }, number>({
        query(id) {
          return {
            url: `/api/hr/unpaid-leaves/${id}/complete/`,
            method: "POST",
            credentials: "include",
          };
        },
        invalidatesTags(_result, _error, id) {
          return [
            { type: "LeaveApplications" as const, id },
            { type: "LeaveApplications" as const, id: "LIST" },
          ];
        },
      }),
      completeMedicalLeave: builder.mutation<{ success: boolean; message: string; data: { id: number; status: string } }, number>({
        query(id) {
          return {
            url: `/api/hr/medical-leaves/${id}/complete/`,
            method: "POST",
            credentials: "include",
          };
        },
        invalidatesTags(_result, _error, id) {
          return [
            { type: "LeaveApplications" as const, id },
            { type: "LeaveApplications" as const, id: "LIST" },
          ];
        },
      }),
    };
  },
});

export const {
  useGetAnnualLeavesQuery,
  useGetUnpaidLeavesQuery,
  useGetMedicalLeavesQuery,
  useGetAnnualLeaveQuery,
  useGetUnpaidLeaveQuery,
  useGetMedicalLeaveQuery,
  useCreateAnnualLeaveMutation,
  useCreateUnpaidLeaveMutation,
  useCreateMedicalLeaveMutation,
  useUpdateAnnualLeaveMutation,
  useUpdateUnpaidLeaveMutation,
  useUpdateMedicalLeaveMutation,
  useDeleteAnnualLeaveMutation,
  useDeleteUnpaidLeaveMutation,
  useDeleteMedicalLeaveMutation,
  useCompleteAnnualLeaveMutation,
  useCompleteUnpaidLeaveMutation,
  useCompleteMedicalLeaveMutation,
} = leavesApi;

