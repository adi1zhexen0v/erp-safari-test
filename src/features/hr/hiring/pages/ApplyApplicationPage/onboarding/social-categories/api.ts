import { baseApi } from "@/shared/api";
import {
  type CreateSocialCategoryDto,
  type CreateSocialCategoryResponse,
  type SocialCategoryRecord,
} from "./types";

export const socialCategoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSocialCategories: builder.query<SocialCategoryRecord[], string>({
      query: (token) => `/api/hr/apply/${token}/social-categories/`,
      providesTags: ["Completeness"],
    }),

    createSocialCategory: builder.mutation<
      CreateSocialCategoryResponse,
      { token: string; body: CreateSocialCategoryDto }
    >({
      query: ({ token, body }) => {
        const formData = new FormData();

        formData.append("category_type", body.category_type);
        formData.append("document_file", body.document_file);
        if (body.issue_date) {
          formData.append("issue_date", body.issue_date);
        }
        if (body.expiry_date) {
          formData.append("expiry_date", body.expiry_date);
        }
        if (body.notes) {
          formData.append("notes", body.notes);
        }

        return {
          url: `/api/hr/apply/${token}/social-categories/`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Completeness"],
    }),

    deleteSocialCategory: builder.mutation<void, { token: string; id: number }>({
      query: ({ token, id }) => ({
        url: `/api/hr/apply/${token}/social-categories/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Completeness"],
    }),
  }),
});

export const {
  useGetSocialCategoriesQuery,
  useCreateSocialCategoryMutation,
  useDeleteSocialCategoryMutation,
} = socialCategoriesApi;

