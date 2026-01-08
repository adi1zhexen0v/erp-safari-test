import cn from "classnames";
import { ChevronsReverseIcon } from "@/shared/assets/icons";
import { useTableContext } from "./TableContext";

interface Props {
  children: React.ReactNode;
  sortable?: boolean;
  sortDirection?: "asc" | "desc";
  onSort?: () => void;
  className?: string;
  sticky?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
}

export function HeadCell({ children, sortable, sortDirection, onSort, className, sticky, width, align = "left" }: Props) {
  const { rounded } = useTableContext();
  return (
    <th
      className={cn(
        "py-2 px-3 xl:py-3 xl:px-4",
        rounded && "first:rounded-tl-[20px] last:rounded-tr-[20px]",
        sortable && "cursor-pointer select-none",
        sticky && cn("sticky left-0 z-20 bg-white dark:bg-grey-900", rounded && "rounded-tl-[20px]"),
        width,
        className,
      )}
      onClick={onSort}>
      <div
        className={cn(
          "flex items-center gap-1 text-body-regular-sm content-base-secondary",
          align === "left" && "text-left justify-start",
          align === "center" && "text-center justify-center",
          align === "right" && "text-right justify-end",
        )}>
        {children}
        {sortable && (
          <span className="content-action-neutral">
            {sortDirection === "asc" ? <ChevronsReverseIcon /> : <ChevronsReverseIcon />}
          </span>
        )}
      </div>
    </th>
  );
}
