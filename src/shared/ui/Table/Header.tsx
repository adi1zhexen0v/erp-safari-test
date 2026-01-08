import cn from "classnames";
import { useTableContext } from "./TableContext";

interface Props {
  children: React.ReactNode;
  variant?: "default" | "plain";
}

export function Header({ children, variant = "default" }: Props) {
  const { rounded } = useTableContext();
  return (
    <thead
      className={cn(
        variant === "default" && cn("surface-tertiary-fill border-b border-alpha-black-10", rounded && "[&>tr:first-child>th:first-child]:rounded-tl-[20px] [&>tr:first-child>th:last-child]:rounded-tr-[20px]"),
        variant === "plain" && "bg-transparent border-b border-alpha-black-10",
      )}>
      {children}
    </thead>
  );
}
