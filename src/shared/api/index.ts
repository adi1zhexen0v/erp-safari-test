import {
  type BaseQueryFn,
  createApi,
  type FetchArgs,
  fetchBaseQuery,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { logout } from "@/features/auth/slice";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    headers.set("ngrok-skip-browser-warning", "true");
    return headers;
  },
});

type RefreshResult = Awaited<ReturnType<typeof rawBaseQuery>>;

let refreshPromise: Promise<RefreshResult> | null = null;

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!refreshPromise) {
      refreshPromise = (async () => {
        try {
          const refreshResult = await rawBaseQuery(
            {
              url: "/api/hr/auth/refresh/",
              method: "POST",
            },
            api,
            extraOptions,
          );
          refreshPromise = null;
          return refreshResult;
        } catch (error) {
          refreshPromise = null;
          throw error;
        }
      })();
    }

    const refreshResult = await refreshPromise;

    if (refreshResult.data) {
      await new Promise((resolve) => setTimeout(resolve, 75));
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      if (import.meta.env.DEV) {
        console.warn(
          "[Auth] Refresh failed with suspected cookie loss. Possible Safari ITP / third-party cookie issue",
        );
      }
      api.dispatch(logout());
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

