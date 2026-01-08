import { baseApi } from "@/shared/api";
import type {
  ContractDetailResponse,
  ListContractsResponse,
  SubmitForSigningResponse,
  CreateContractDto,
  CreateContractResponse,
  CreateContractAlreadyExistsResponse,
  ContractClausesResponse,
} from "@/features/hr/contracts/types";

export const contractsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createContract: builder.mutation<CreateContractResponse | CreateContractAlreadyExistsResponse, CreateContractDto>({
      query: ({ application_id, ...body }) => ({
        url: `/api/hr/applications/${application_id}/create-contract/`,
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: [{ type: "Contracts" as const, id: "LIST" }, "Applications"],
    }),
    getContractDetail: builder.query<ContractDetailResponse, number>({
      query: (id) => ({
        url: `/api/hr/contracts/${id}/`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (_result, _error, id) => [{ type: "Contracts" as const, id }],
    }),
    getContracts: builder.query<ListContractsResponse[], void>({
      query: () => ({
        url: `/api/hr/contracts/`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: [{ type: "Contracts" as const, id: "LIST" }],
    }),
    submitContractForSigning: builder.mutation<SubmitForSigningResponse, number>({
      query: (id) => ({
        url: `/api/hr/contracts/${id}/submit-for-signing/`,
        method: "POST",
        body: {},
        credentials: "include",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Contracts" as const, id },
        { type: "Contracts" as const, id: "LIST" },
      ],
    }),
    downloadWorkContractPreview: builder.mutation<Blob, number>({
      query: (id) => ({
        url: `/api/hr/contracts/${id}/preview/`,
        method: "GET",
        credentials: "include",
        responseHandler: (response) => response.blob(),
      }),
    }),
    getContractClauses: builder.query<ContractClausesResponse, void>({
      query: () => ({
        url: `/api/hr/contract-clauses/`,
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useCreateContractMutation,
  useGetContractDetailQuery,
  useLazyGetContractDetailQuery,
  useGetContractsQuery,
  useSubmitContractForSigningMutation,
  useDownloadWorkContractPreviewMutation,
  useGetContractClausesQuery,
} = contractsApi;

