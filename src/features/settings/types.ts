export type ZoomLevel = 1.0 | 1.1 | 1.25;
export type Theme = "light" | "dark" | "grayscale";

export interface SettingsState {
  zoom: ZoomLevel;
  theme: Theme;
  showImages: boolean;
}

