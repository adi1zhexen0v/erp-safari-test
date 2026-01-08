import { baseApi } from "@/shared/api";
import type { GetWorkersQueryParams, WorkerListItem } from "../types";

export const workersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWorkers: builder.query<WorkerListItem[], GetWorkersQueryParams | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();

        if (params?.status) searchParams.append("status", params.status);
        if (params?.search) searchParams.append("search", params.search);

        return {
          url: `/api/hr/workers/?${searchParams.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["NGOWorkers"],
    }),

    downloadWorkerProfilePreview: builder.mutation<Blob, number>({
      query: (id) => ({
        url: `/api/hr/workers/${id}/preview-profile/`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const { useGetWorkersQuery, useDownloadWorkerProfilePreviewMutation } = workersApi;

