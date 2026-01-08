import { useState } from "react";
import { type Icon } from "iconsax-react";
import cn from "classnames";
import { CloseIcon, MaximizeIcon, MinimizeIcon } from "@/shared/assets/icons";
import { useScrollDetection } from "@/shared/hooks";

type IconComponent = Icon | React.ComponentType<{ size?: number | string; color?: string; className?: string }>;

interface Props {
  icon: IconComponent;
  children?: React.ReactNode;
  onClose: () => void;
  resize?: boolean;
  onFullScreenChange?: (isFullScreen: boolean) => void;
  hasBackground?: boolean;
  allowCloseInOverlay?: boolean;
  zIndex?: number;
}

export default function ModalForm({
  icon,
  children,
  onClose,
  resize = false,
  onFullScreenChange,
  hasBackground = true,
  allowCloseInOverlay = true,
  zIndex = 10000,
}: Props) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const IconComponent = icon;
  const { scrollRef, hasScroll } = useScrollDetection();

  function handleFullScreenToggle() {
    const newValue = !isFullScreen;
    setIsFullScreen(newValue);
    onFullScreenChange?.(newValue);
  }

  return (
    <div
      className={cn(
        "fixed top-0 left-0 w-screen h-screen p-5 flex justify-end",
        hasBackground && "surface-backdrop blur-level-1",
      )}
      style={{ zIndex }}
      onClick={allowCloseInOverlay ? onClose : undefined}>
      <div
        className={`h-full p-7 surface-base-fill radius-2xl flex flex-col gap-5 ${resize && isFullScreen ? "w-full" : "w-lg"}`}
        onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          <div className="w-10 aspect-square flex justify-center items-center content-base-secondary surface-base-fill button-secondary-normal radius-xs">
            <IconComponent size={20} color="currentColor" />
          </div>

          <div className="flex justify-end items-center gap-2">
            {resize && (
              <button
                className="w-10 aspect-square flex justify-center items-center cursor-pointer"
                onClick={handleFullScreenToggle}>
                <span className="content-base-secondary">{isFullScreen ? <MinimizeIcon /> : <MaximizeIcon />}</span>
              </button>
            )}
            <button
              className="w-10 aspect-square flex justify-center items-center cursor-pointer content-base-secondary"
              onClick={onClose}>
              <CloseIcon />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className={cn("flex-1 overflow-auto page-scroll", hasScroll && "pr-3")}>
          {children}
        </div>
      </div>
    </div>
  );
}
