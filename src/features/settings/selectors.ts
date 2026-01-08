import type { RootState } from "@/app/store";

export const selectZoom = (state: RootState) => state.settings.zoom;
export const selectTheme = (state: RootState) => state.settings.theme;
export const selectShowImages = (state: RootState) => state.settings.showImages;

