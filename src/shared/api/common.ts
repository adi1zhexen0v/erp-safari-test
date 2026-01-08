import { baseApi } from "@/shared/api";

export interface CityResponse {
  id: number;
  name_ru: string;
  name_kk: string;
  region_ru: string;
  region_kk: string;
}

export const commonApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCities: builder.query<CityResponse[], void>({
      query: () => ({
        url: "/api/cities/",
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const { useGetCitiesQuery } = commonApi;

