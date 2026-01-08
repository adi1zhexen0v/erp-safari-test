import { baseApi } from "@/shared/api";
import type { ApplicationStatusResponse, ReviewApplicationRequest } from "../types";

export const applicationApi = baseApi.injectEndpoints({
  endpoints(builder) {
    return {
      previewAnnualApplication: builder.mutation<Blob, number>({
        query(id) {
          return {
            url: `/api/hr/annual-leaves/${id}/preview-application/`,
            method: "GET",
            credentials: "include",
            responseHandler(response) {
              return response.blob();
            },
          };
        },
      }),
      previewUnpaidApplication: builder.mutation<Blob, number>({
        query(id) {
          return {
            url: `/api/hr/unpaid-leaves/${id}/preview-application/`,
            method: "GET",
            credentials: "include",
            responseHandler(response) {
              return response.blob();
            },
          };
        },
      }),
      previewMedicalApplication: builder.mutation<Blob, number>({
        query(id) {
          return {
            url: `/api/hr/medical-leaves/${id}/preview-application/`,
            method: "GET",
            credentials: "include",
            responseHandler(response) {
              return response.blob();
            },
          };
        },
      }),
      uploadAnnualApplication: builder.mutation<ApplicationStatusResponse, { id: number; file: File }>({
        query({ id, file }) {
          const formData = new FormData();
          formData.append("signed_pdf", file);
          return {
            url: `/api/hr/annual-leaves/${id}/upload-application/`,
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
      uploadUnpaidApplication: builder.mutation<ApplicationStatusResponse, { id: number; file: File }>({
        query({ id, file }) {
          const formData = new FormData();
          formData.append("signed_pdf", file);
          return {
            url: `/api/hr/unpaid-leaves/${id}/upload-application/`,
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
      uploadMedicalApplication: builder.mutation<ApplicationStatusResponse, { id: number; file: File }>({
        query({ id, file }) {
          const formData = new FormData();
          formData.append("signed_pdf", file);
          return {
            url: `/api/hr/medical-leaves/${id}/upload-application/`,
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
      getAnnualApplicationStatus: builder.query<ApplicationStatusResponse, number>({
        query(id) {
          return {
            url: `/api/hr/annual-leaves/${id}/application/`,
            method: "GET",
            credentials: "include",
          };
        },
        providesTags(_result, _error, id) {
          return [{ type: "LeaveApplications" as const, id }];
        },
      }),
      getUnpaidApplicationStatus: builder.query<ApplicationStatusResponse, number>({
        query(id) {
          return {
            url: `/api/hr/unpaid-leaves/${id}/application/`,
            method: "GET",
            credentials: "include",
          };
        },
        providesTags(_result, _error, id) {
          return [{ type: "LeaveApplications" as const, id }];
        },
      }),
      getMedicalApplicationStatus: builder.query<ApplicationStatusResponse, number>({
        query(id) {
          return {
            url: `/api/hr/medical-leaves/${id}/application/`,
            method: "GET",
            credentials: "include",
          };
        },
        providesTags(_result, _error, id) {
          return [{ type: "LeaveApplications" as const, id }];
        },
      }),
      reviewAnnualApplication: builder.mutation<ApplicationStatusResponse, { id: number; data: ReviewApplicationRequest }>({
        query({ id, data }) {
          return {
            url: `/api/hr/annual-leaves/${id}/review-application/`,
            method: "POST",
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
      reviewUnpaidApplication: builder.mutation<ApplicationStatusResponse, { id: number; data: ReviewApplicationRequest }>({
        query({ id, data }) {
          return {
            url: `/api/hr/unpaid-leaves/${id}/review-application/`,
            method: "POST",
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
      reviewMedicalApplication: builder.mutation<ApplicationStatusResponse, { id: number; data: ReviewApplicationRequest }>({
        query({ id, data }) {
          return {
            url: `/api/hr/medical-leaves/${id}/review-application/`,
            method: "POST",
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
    };
  },
});

export const {
  usePreviewAnnualApplicationMutation,
  usePreviewUnpaidApplicationMutation,
  usePreviewMedicalApplicationMutation,
  useUploadAnnualApplicationMutation,
  useUploadUnpaidApplicationMutation,
  useUploadMedicalApplicationMutation,
  useGetAnnualApplicationStatusQuery,
  useGetUnpaidApplicationStatusQuery,
  useGetMedicalApplicationStatusQuery,
  useReviewAnnualApplicationMutation,
  useReviewUnpaidApplicationMutation,
  useReviewMedicalApplicationMutation,
} = applicationApi;

