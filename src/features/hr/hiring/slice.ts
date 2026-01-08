import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CompletenessResponse } from "@/features/hr/hiring";

interface CompletenessState {
  loading: boolean;
  error: string | null;
  data: CompletenessResponse | null;
  gender: "male" | "female" | null;
  is_resident: boolean | null;
  is_student: boolean | null;
  socialCategoriesWasOpened: boolean;
}

const initialState: CompletenessState = {
  loading: false,
  error: null,
  data: null,
  gender: null,
  is_resident: null,
  is_student: null,
  socialCategoriesWasOpened: false,
};

export const completenessSlice = createSlice({
  name: "completeness",
  initialState,
  reducers: {
    setLoading(state) {
      state.loading = true;
      state.error = null;
    },
    setError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    setCompleteness(state, action: PayloadAction<CompletenessResponse>) {
      state.loading = false;
      state.error = null;
      const payload = { ...action.payload };
      if (state.socialCategoriesWasOpened && !payload.sections.social_categories) {
        payload.sections = {
          ...payload.sections,
          social_categories: {
            complete: true,
            missing_fields: [],
            missing_files: [],
          },
        };
      }
      state.data = payload;
    },
    resetCompleteness(state) {
      state.loading = false;
      state.error = null;
      state.data = null;
      state.gender = null;
      state.is_resident = null;
      state.is_student = null;
      state.socialCategoriesWasOpened = false;
    },
    setGender(state, action: PayloadAction<"male" | "female" | null>) {
      state.gender = action.payload;
    },
    setIsResident(state, action: PayloadAction<boolean | null>) {
      state.is_resident = action.payload;
    },
    setIsStudent(state, action: PayloadAction<boolean | null>) {
      state.is_student = action.payload;
    },
    setSocialCategoriesOpened(state) {
      state.socialCategoriesWasOpened = true;
      if (state.data && !state.data.sections.social_categories) {
        state.data = {
          ...state.data,
          sections: {
            ...state.data.sections,
            social_categories: {
              complete: true,
              missing_fields: [],
              missing_files: [],
            },
          },
        };
      }
    },
  },
});

export const {
  setLoading,
  setError,
  setCompleteness,
  resetCompleteness,
  setGender,
  setIsResident,
  setIsStudent,
  setSocialCategoriesOpened,
} = completenessSlice.actions;

