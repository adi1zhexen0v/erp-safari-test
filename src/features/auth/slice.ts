import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getOrganizationTypeDetails } from "@/shared/utils";
import type { GetMeResponse, User, AuthUser } from "./types";

interface AuthState {
  isAuth: boolean;
  data: {
    user: AuthUser | null;
  } | null;
}

const initialState: AuthState = {
  isAuth: false,
  data: null,
};

function isGetMeResponse(payload: GetMeResponse | User): payload is GetMeResponse {
  return (
    "phone" in payload &&
    "iin" in payload &&
    "job_position_ru" in payload &&
    "job_position_kk" in payload &&
    typeof payload.organization === "object" &&
    "organization_type" in payload.organization
  );
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<GetMeResponse | User>) => {
      state.isAuth = true;
      const payload = action.payload;

      if (isGetMeResponse(payload)) {
        const org = payload.organization;
        const orgTypeDetails = getOrganizationTypeDetails(org.organization_type);

        const userData: AuthUser = {
          id: payload.id,
          email: payload.email,
          full_name: payload.full_name,
          phone: payload.phone,
          iin: payload.iin,
          job_position_ru: payload.job_position_ru,
          job_position_kk: payload.job_position_kk,
          organization: org.name,
          organization_bin: org.bin,
          organization_address_ru: org.address_ru,
          organization_address_kk: org.address_kk,
          organization_registration_date: org.registration_date,
          organization_bank_name: org.bank_name,
          organization_iban: org.iban,
          organization_bik: org.bik,
          organization_type_full_title_ru: org.organization_type_display.ru,
          organization_type_full_title_kk: org.organization_type_display.kk,
          organization_type_short_title_ru: orgTypeDetails.ru.abbreviation,
          organization_type_short_title_kk: orgTypeDetails.kk.abbreviation,
          employer_position_ru: payload.job_position_ru,
          employer_position_kk: payload.job_position_kk,
        };

        state.data = {
          user: userData,
        };
      } else {
        const org = typeof payload.organization === "string" ? null : payload.organization;
        const orgTypeDetails = org ? getOrganizationTypeDetails(org.organization_type) : null;

        const userData: AuthUser = {
          id: payload.id,
          email: payload.email,
          full_name: payload.full_name,
          phone: "",
          iin: payload.iin || "",
          job_position_ru: payload.job_position_ru || "",
          job_position_kk: payload.job_position_kk || "",
          organization: typeof payload.organization === "string" ? payload.organization : payload.organization.name,
          organization_bin: org?.bin || "",
          organization_address_ru: org?.address_ru || "",
          organization_address_kk: org?.address_kk || "",
          organization_registration_date: org?.registration_date || "",
          organization_bank_name: org?.bank_name || "",
          organization_iban: org?.iban || "",
          organization_bik: org?.bik || "",
          organization_type_full_title_ru: org?.organization_type_display?.ru || "",
          organization_type_full_title_kk: org?.organization_type_display?.kk || "",
          organization_type_short_title_ru: orgTypeDetails?.ru.abbreviation || "",
          organization_type_short_title_kk: orgTypeDetails?.kk.abbreviation || "",
          employer_position_ru: payload.job_position_ru || "",
          employer_position_kk: payload.job_position_kk || "",
        };

        state.data = {
          user: userData,
        };
      }
    },
    logout: (state) => {
      state.isAuth = false;
      state.data = null;
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;

