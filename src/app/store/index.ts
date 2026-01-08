import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "@/features/auth";
import { workContractSlice } from "@/features/hr/contracts";
import { completenessSlice } from "@/features/hr/hiring";
import { settingsSlice } from "@/features/settings";
import { baseApi } from "@/shared/api";

export const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [completenessSlice.name]: completenessSlice.reducer,
    [baseApi.reducerPath]: baseApi.reducer,
    [workContractSlice.name]: workContractSlice.reducer,
    [settingsSlice.name]: settingsSlice.reducer,
  },
  middleware: (getDefault) => getDefault().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
