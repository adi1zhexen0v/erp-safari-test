import cn from "classnames";
import { useTableContext } from "./TableContext";

interface Props {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
  isBold?: boolean;
  sticky?: boolean;
  width?: string;
  colSpan?: number;
  onDragOver?: (e: React.DragEvent<HTMLTableCellElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLTableCellElement>) => void;
  onClick?: () => void;
}

export function Cell({
  children,
  className,
  align = "left",
  isBold,
  sticky,
  width,
  colSpan,
  onDragOver,
  onDrop,
  onClick,
}: Props) {
  const { rounded } = useTableContext();
  return (
    <td
      colSpan={colSpan}
      className={cn(
        "py-2 px-3 xl:py-3 xl:px-4 content-base-primary text-body-regular-sm",
        rounded && "[tr:last-child>&:first-child]:rounded-bl-[20px] [tr:last-child>&:last-child]:rounded-br-[20px]",
        align === "center" && "text-center",
        align === "right" && "text-right",
        isBold && "text-label-sm",
        sticky && cn("sticky left-0 z-10 bg-white dark:bg-grey-900", rounded && "[tr:last-child>&]:rounded-bl-[20px]"),
        width,
        className,
      )}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={onClick}>
      {children}
    </td>
  );
}

