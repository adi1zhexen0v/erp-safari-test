import { baseApi } from "@/shared/api";
import type { VacationOrder, MedicalLeaveOrder } from "../types";

export const ordersApi = baseApi.injectEndpoints({
  endpoints(builder) {
    return {
      createAnnualOrder: builder.mutation<VacationOrder, number>({
        query(id) {
          return {
            url: `/api/hr/annual-leaves/${id}/create-order/`,
            method: "POST",
            body: {},
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
      createUnpaidOrder: builder.mutation<VacationOrder, number>({
        query(id) {
          return {
            url: `/api/hr/unpaid-leaves/${id}/create-order/`,
            method: "POST",
            body: {},
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
      createMedicalOrder: builder.mutation<MedicalLeaveOrder, number>({
        query(id) {
          return {
            url: `/api/hr/medical-leaves/${id}/create-order/`,
            method: "POST",
            body: {},
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
      previewAnnualOrder: builder.mutation<Blob, number>({
        query(id) {
          return {
            url: `/api/hr/annual-leaves/${id}/preview-order/`,
            method: "GET",
            credentials: "include",
            responseHandler(response) {
              return response.blob();
            },
          };
        },
      }),
      previewUnpaidOrder: builder.mutation<Blob, number>({
        query(id) {
          return {
            url: `/api/hr/unpaid-leaves/${id}/preview-order/`,
            method: "GET",
            credentials: "include",
            responseHandler(response) {
              return response.blob();
            },
          };
        },
      }),
      previewMedicalOrder: builder.mutation<Blob, number>({
        query(id) {
          return {
            url: `/api/hr/medical-leaves/${id}/preview-order/`,
            method: "GET",
            credentials: "include",
            responseHandler(response) {
              return response.blob();
            },
          };
        },
      }),
      uploadVacationOrder: builder.mutation<VacationOrder, { orderId: number; file: File }>({
        query({ orderId, file }) {
          const formData = new FormData();
          formData.append("signed_pdf", file);
          return {
            url: `/api/hr/vacation-orders/${orderId}/upload/`,
            method: "POST",
            body: formData,
            credentials: "include",
          };
        },
        invalidatesTags() {
          return [{ type: "LeaveApplications" as const, id: "LIST" }];
        },
      }),
      uploadMedicalOrder: builder.mutation<MedicalLeaveOrder, { id: number; file: File }>({
        query({ id, file }) {
          const formData = new FormData();
          formData.append("signed_pdf", file);
          return {
            url: `/api/hr/medical-leaves/${id}/upload-order/`,
            method: "POST",
            body: formData,
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
      uploadMedicalCertificate: builder.mutation<
        { success: boolean; message: string; data: { id: number; certificate_pdf_key: string; certificate_uploaded_at: string } },
        { id: number; file: File }
      >({
        query({ id, file }) {
          const formData = new FormData();
          formData.append("certificate", file);
          return {
            url: `/api/hr/medical-leaves/${id}/upload-certificate/`,
            method: "POST",
            body: formData,
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
    };
  },
});

export const {
  useCreateAnnualOrderMutation,
  useCreateUnpaidOrderMutation,
  useCreateMedicalOrderMutation,
  usePreviewAnnualOrderMutation,
  usePreviewUnpaidOrderMutation,
  usePreviewMedicalOrderMutation,
  useUploadVacationOrderMutation,
  useUploadMedicalOrderMutation,
  useUploadMedicalCertificateMutation,
} = ordersApi;

