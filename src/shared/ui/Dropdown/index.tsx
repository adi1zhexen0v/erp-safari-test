import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import cn from "classnames";

interface Props {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  align?: "left" | "right";
  width?: string;
  direction?: "bottom" | "top";
  fullWidth?: boolean;
}

export default function Dropdown({
  open,
  onClose,
  children,
  className,
  align = "right",
  width = "w-max",
  direction = "bottom",
  fullWidth = false,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number; width?: number } | null>(null);
  const [isPositioned, setIsPositioned] = useState(false);

  const [trigger, ...items] = Array.isArray(children) ? children : [children];

  useEffect(() => {
    if (!open || !containerRef.current) {
      setPosition(null);
      setIsPositioned(false);
      return;
    }

    function updatePosition() {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const dropdownRect = dropdownRef.current?.getBoundingClientRect();

      let top = 0;
      let left = 0;

      if (direction === "bottom") {
        top = rect.bottom + 8;
      } else {
        top = rect.top - (dropdownRect?.height || 0) - 8;
      }

      if (align === "right") {
        left = rect.right - (dropdownRect?.width || rect.width);
      } else {
        left = rect.left;
      }

      setPosition({ top, left, width: fullWidth ? rect.width : undefined });
    }

    // Устанавливаем начальную позицию (для layout, но ещё не видим)
    updatePosition();

    // После рендера dropdown измеряем реальные размеры и показываем
    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        updatePosition();
        setIsPositioned(true);
      });
    });

    const handleScroll = () => updatePosition();
    const handleResize = () => updatePosition();

    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      setIsPositioned(false);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [open, align, direction, fullWidth]);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  const dropdownContent = open && position && (
    <div
      ref={dropdownRef}
      className={cn(
        "fixed rounded-lg background-static-white p-1 z-[10100] shadow-[0_6px_12px_0_var(--color-alpha-black-05),0_1px_1px_0_var(--color-alpha-black-10),0_0_0_1px_var(--color-alpha-black-10)]",
        isPositioned && "animate-fadeIn",
        !position.width && width,
        className,
      )}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        visibility: isPositioned ? "visible" : "hidden",
        ...(position.width && { width: `${position.width}px` }),
      }}>
      {items}
    </div>
  );

  return (
    <>
      <div ref={containerRef} className={cn("relative", fullWidth ? "w-full min-w-0" : "inline-block")}>
        {trigger}
      </div>
      {typeof document !== "undefined" && dropdownContent && createPortal(dropdownContent, document.body)}
    </>
  );
}
