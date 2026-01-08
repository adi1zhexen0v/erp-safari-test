import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SettingsState, ZoomLevel, Theme } from "./types";

const STORAGE_KEY = "accessibility_settings";

function loadSettingsFromStorage(): SettingsState | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as SettingsState;
      if (
        typeof parsed.zoom === "number" &&
        [1.0, 1.1, 1.25].includes(parsed.zoom) &&
        typeof parsed.theme === "string" &&
        ["light", "dark", "grayscale"].includes(parsed.theme) &&
        typeof parsed.showImages === "boolean"
      ) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Failed to load settings from localStorage:", error);
  }
  return null;
}

function saveSettingsToStorage(state: SettingsState) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save settings to localStorage:", error);
  }
}

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";

  try {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  } catch (error) {
    console.error("Failed to detect system theme:", error);
    return "light";
  }
}

const storedSettings = loadSettingsFromStorage();
const initialState: SettingsState = storedSettings || {
  zoom: 1.0,
  theme: getSystemTheme(),
  showImages: true,
};

function applyThemeEffects(theme: Theme) {
  if (typeof document === "undefined") return;

  if (theme === "dark") {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }

  if (theme === "grayscale") {
    document.body.style.filter = "grayscale(1)";
  } else {
    document.body.style.filter = "";
  }
}

function applyZoomEffects(zoom: ZoomLevel) {
  if (typeof document === "undefined") return;

  const zoomMap: Record<ZoomLevel, string> = {
    1.0: "100%",
    1.1: "110%",
    1.25: "125%",
  };
  document.documentElement.style.fontSize = zoomMap[zoom];
}

function applyImageVisibilityEffects(showImages: boolean) {
  if (typeof document === "undefined") return;

  if (showImages) {
    document.body.classList.remove("no-images");
  } else {
    document.body.classList.add("no-images");
  }
}

if (typeof document !== "undefined") {
  applyThemeEffects(initialState.theme);
  applyZoomEffects(initialState.zoom);
  applyImageVisibilityEffects(initialState.showImages);
}

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setZoom: (state, action: PayloadAction<ZoomLevel>) => {
      state.zoom = action.payload;
      applyZoomEffects(action.payload);
      saveSettingsToStorage(state);
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      applyThemeEffects(action.payload);
      saveSettingsToStorage(state);
    },
    toggleImages: (state) => {
      state.showImages = !state.showImages;
      applyImageVisibilityEffects(state.showImages);
      saveSettingsToStorage(state);
    },
  },
});

export const { setZoom, setTheme, toggleImages } = settingsSlice.actions;
export default settingsSlice.reducer;
