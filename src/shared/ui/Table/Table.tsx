import React from "react";
import cn from "classnames";
import { TableContext } from "./TableContext";

interface Props {
  children: React.ReactNode;
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
  fullWidth?: boolean;
  scrollable?: boolean;
  variant?: "default" | "plain";
  rounded?: boolean;
}

export function Table({
  children,
  className,
  striped = true,
  hoverable = true,
  fullWidth = true,
  scrollable = false,
  variant = "default",
  rounded = true,
}: Props) {
  return (
    <TableContext.Provider value={{ rounded }}>
      <div
        className={cn(
          variant === "default" && cn("border surface-base-stroke bg-transparent table-fixed", rounded && "rounded-[20px]"),
          variant === "plain" && cn("border-0 bg-transparent", rounded && "rounded-[20px]"),
          fullWidth && "min-w-full w-fit",
          scrollable && "overflow-x-auto page-scroll",
          striped && " [&>table>tbody>tr:nth-child(even)]:bg-grey-50 dark:[&>table>tbody>tr:nth-child(even)]:bg-grey-900",
          hoverable && " [&>table>tbody>tr:hover]:bg-grey-50 dark:[&>table>tbody>tr:hover]:bg-grey-800! [&>table>thead>tr:hover]:!bg-inherit",
          className,
        )}>
        <table className={cn("border-collapse text-sm leading-5 w-full")}>{children}</table>
      </div>
    </TableContext.Provider>
  );
}
