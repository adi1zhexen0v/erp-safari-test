import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/redux";
import { Button, Checkbox } from "@/shared/ui";
import { setZoom, setTheme, toggleImages } from "../slice";
import { selectZoom, selectTheme, selectShowImages } from "../selectors";

function AccessibilityPanelContent() {
  const { t, ready } = useTranslation("AccessibilityPanel");
  const dispatch = useAppDispatch();
  const zoom = useAppSelector(selectZoom);
  const theme = useAppSelector(selectTheme);
  const showImages = useAppSelector(selectShowImages);

  if (!ready) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 p-2 xl:p-4">
      {}
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-label-sm content-base-primary whitespace-nowrap">{t("fontSize")}</h3>
        <div className="flex gap-2">
          {([1.0, 1.1, 1.25] as const).map((zoomLevel) => {
            const isSelected = zoom === zoomLevel;
            return (
              <Button
                key={zoomLevel}
                variant="secondary"
                onClick={() => dispatch(setZoom(zoomLevel))}
                className={cn(
                  "w-10 h-10 aspect-square radius-sm flex items-center justify-center p-0!",
                  "surface-base-fill surface-base-stroke border transition-all",
                  isSelected ? "border-primary-500! border-2!" : "border-alpha-black-10 hover:border-alpha-black-20",
                )}>
                <span className="text-label-md content-base-primary">
                  {zoomLevel === 1.0 ? "A" : zoomLevel === 1.1 ? "A+" : "A++"}
                </span>
              </Button>
            );
          })}
        </div>
      </div>

      {}
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-label-sm content-base-primary whitespace-nowrap">{t("siteColor")}</h3>
        <div className="flex gap-2">
          {(["grayscale", "dark", "light"] as const).map((themeOption) => {
            const isSelected = theme === themeOption;
            const getThemeStyles = () => {
              switch (themeOption) {
                case "grayscale":
                  return isSelected
                    ? "bg-white border-primary-500 border-2 text-black"
                    : "bg-white border-alpha-black-10 text-black hover:border-alpha-black-20";
                case "dark":
                  return isSelected
                    ? "bg-grey-950 border-primary-500 border-2 text-white"
                    : "bg-grey-950 border-alpha-black-10 text-white hover:border-alpha-black-20";
                case "light":
                  return isSelected
                    ? "bg-primary-500 border-primary-600 border-2 text-white"
                    : "bg-primary-200 border-alpha-black-10 text-black hover:border-alpha-black-20";
                default:
                  return "";
              }
            };
            return (
              <button
                key={themeOption}
                onClick={() => dispatch(setTheme(themeOption))}
                className={cn(
                  "w-10 h-10 aspect-square radius-sm flex items-center justify-center cursor-pointer",
                  "border transition-all",
                  getThemeStyles(),
                )}>
                <span className="text-label-md">Ц</span>
              </button>
            );
          })}
        </div>
      </div>

      {}
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-label-sm content-base-primary whitespace-nowrap">{t("showImages")}</h3>
        <div className="flex items-center">
          <Checkbox state={showImages ? "checked" : "unchecked"} onChange={() => dispatch(toggleImages())} />
        </div>
      </div>
    </div>
  );
}

export default function AccessibilityPanel() {
  return (
    <Suspense fallback={null}>
      <AccessibilityPanelContent />
    </Suspense>
  );
}
