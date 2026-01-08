import { baseApi } from "@/shared/api";
import type {
  CreatePositionAmendmentDto,
  CreateSalaryAmendmentDto,
  CreateOtherAmendmentDto,
  CreateAmendmentResponse,
  AmendmentDetailResponse,
  AmendmentListResponse,
} from "../types";

export const amendmentsApi = baseApi.injectEndpoints({
  endpoints(builder) {
    return {
      getAmendments: builder.query<AmendmentListResponse[], void>({
        query() {
          return {
            url: "/api/hr/amendments/",
            method: "GET",
            credentials: "include",
          };
        },
        providesTags: [{ type: "Amendments" as const, id: "LIST" }],
      }),
      getAmendmentDetail: builder.query<AmendmentDetailResponse, number>({
        query(id) {
          return {
            url: `/api/hr/amendments/${id}/`,
            method: "GET",
            credentials: "include",
          };
        },
        providesTags(_result, _error, id) {
          return [{ type: "Amendments" as const, id }];
        },
      }),
      createPositionAmendment: builder.mutation<CreateAmendmentResponse, CreatePositionAmendmentDto>({
        query(body) {
          return {
            url: "/api/hr/amendments/position/",
            method: "POST",
            body,
            credentials: "include",
          };
        },
        invalidatesTags: [
          { type: "Amendments" as const, id: "LIST" },
          { type: "Contracts" as const, id: "LIST" },
        ],
      }),
      createSalaryAmendment: builder.mutation<CreateAmendmentResponse, CreateSalaryAmendmentDto>({
        query(body) {
          return {
            url: "/api/hr/amendments/salary/",
            method: "POST",
            body,
            credentials: "include",
          };
        },
        invalidatesTags: [
          { type: "Amendments" as const, id: "LIST" },
          { type: "Contracts" as const, id: "LIST" },
        ],
      }),
      createOtherAmendment: builder.mutation<CreateAmendmentResponse, CreateOtherAmendmentDto>({
        query(body) {
          return {
            url: "/api/hr/amendments/other/",
            method: "POST",
            body,
            credentials: "include",
          };
        },
        invalidatesTags: [
          { type: "Amendments" as const, id: "LIST" },
          { type: "Contracts" as const, id: "LIST" },
        ],
      }),
    };
  },
});

export const {
  useGetAmendmentsQuery,
  useGetAmendmentDetailQuery,
  useCreatePositionAmendmentMutation,
  useCreateSalaryAmendmentMutation,
  useCreateOtherAmendmentMutation,
} = amendmentsApi;

