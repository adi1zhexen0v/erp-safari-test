import { baseApi } from "@/shared/api";
import { type BankingDto, type BankingPostResponse,type BankingResponse } from "./types";

export const bankingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBanking: builder.query<BankingResponse, string>({
      query: (token) => `/api/hr/apply/${token}/banking/`,
      providesTags: ["Completeness"],
    }),

    submitBanking: builder.mutation<BankingPostResponse, { token: string; body: BankingDto }>({
      query: ({ token, body }) => {
        const form = new FormData();
        form.append("bank_name", body.bank_name);
        form.append("iban_account", body.iban_account);
        form.append("bik_number", body.bik_number);
        if (body.bank_certificate_file) {
          form.append("bank_certificate_file", body.bank_certificate_file);
        }

        return {
          url: `/api/hr/apply/${token}/banking/`,
          method: "POST",
          body: form,
        };
      },
      invalidatesTags: ["Completeness"],
    }),
  }),
});

export const { useGetBankingQuery, useSubmitBankingMutation } = bankingApi;
