import {
  type BaseQueryFn,
  createApi,
  type FetchArgs,
  fetchBaseQuery,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    headers.set("ngrok-skip-browser-warning", "true");
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshResult = await rawBaseQuery(
      {
        url: "/api/hr/auth/refresh/",
        method: "POST",
      },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch({ type: "auth/logout" });
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Auth",
    "Applications",
    "Completeness",
    "Contracts",
    "NGOWorkers",
    "VehicleRentals",
    "PremisesLeases",
    "LegalDocuments",
    "ServiceAgreementsIndividual",
    "VehicleHandovers",
    "PremisesHandovers",
    "ServiceAgreementsMSB",
    "GoodsSupply",
    "CompletionActs",
    "AvailableServices",
    "LeaveApplications",
    "ResignationLetters",
    "Amendments",
    "Timesheets",
    "Payrolls",
  ],
  endpoints: () => ({}),
});

