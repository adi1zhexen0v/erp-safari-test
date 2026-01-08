import AccessibilityPanel from "./components/AccessibilityPanel";
import AccessibilitySwitcher from "./components/AccessibilitySwitcher";
import LanguageSwitcher from "./components/LanguageSwitcher";

export { settingsSlice, setZoom, setTheme, toggleImages } from "./slice";
export type { ZoomLevel, Theme, SettingsState } from "./types";
export { selectZoom, selectTheme, selectShowImages } from "./selectors";

export { AccessibilityPanel, AccessibilitySwitcher, LanguageSwitcher };
