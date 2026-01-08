import { baseApi } from "@/shared/api";
import type {
  PayrollListResponse,
  PayrollDetailResponse,
  GeneratePayrollDto,
  ApprovePayrollDto,
  MarkPaidDto,
  GPHPayment,
} from "../types";

export const payrollApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayrolls: builder.query<PayrollListResponse[], void>({
      query: () => ({
        url: `/api/accounting/payrolls/`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: [{ type: "Payrolls" as const, id: "LIST" }],
    }),

    getPayrollDetail: builder.query<PayrollDetailResponse, number>({
      query: (id) => ({
        url: `/api/accounting/payrolls/${id}/`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (_result, _error, id) => [{ type: "Payrolls" as const, id }],
    }),

    generatePayroll: builder.mutation<PayrollDetailResponse, GeneratePayrollDto>({
      query: (body) => ({
        url: `/api/accounting/payrolls/generate/`,
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: [{ type: "Payrolls" as const, id: "LIST" }],
    }),

    approvePayroll: builder.mutation<PayrollDetailResponse, { id: number; body?: ApprovePayrollDto }>({
      query: ({ id, body = {} }) => ({
        url: `/api/accounting/payrolls/${id}/approve/`,
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Payrolls" as const, id },
        { type: "Payrolls" as const, id: "LIST" },
      ],
    }),

    markPayrollPaid: builder.mutation<PayrollDetailResponse, { id: number; body?: MarkPaidDto }>({
      query: ({ id, body = {} }) => ({
        url: `/api/accounting/payrolls/${id}/mark-paid/`,
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Payrolls" as const, id },
        { type: "Payrolls" as const, id: "LIST" },
      ],
    }),

    deletePayroll: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/accounting/payrolls/${id}/`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: [{ type: "Payrolls" as const, id: "LIST" }],
    }),

    recalculatePayroll: builder.mutation<PayrollDetailResponse, number>({
      query: (id) => ({
        url: `/api/accounting/payrolls/${id}/recalculate/`,
        method: "POST",
        body: {},
        credentials: "include",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Payrolls" as const, id },
        { type: "Payrolls" as const, id: "LIST" },
      ],
    }),

    markGPHPaid: builder.mutation<GPHPayment, { id: number; body?: MarkPaidDto }>({
      query: ({ id, body = {} }) => ({
        url: `/api/accounting/gph-payments/${id}/mark-paid/`,
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: () => {
        return [{ type: "Payrolls" as const }];
      },
    }),
  }),
});

export const {
  useGetPayrollsQuery,
  useGetPayrollDetailQuery,
  useLazyGetPayrollDetailQuery,
  useGeneratePayrollMutation,
  useApprovePayrollMutation,
  useMarkPayrollPaidMutation,
  useDeletePayrollMutation,
  useRecalculatePayrollMutation,
  useMarkGPHPaidMutation,
} = payrollApi;
