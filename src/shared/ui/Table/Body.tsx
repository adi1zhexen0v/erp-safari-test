import cn from "classnames";
import { useTableContext } from "./TableContext";

interface Props {
  children: React.ReactNode;
}

export function Body({ children }: Props) {
  const { rounded } = useTableContext();
  return (
    <tbody className={cn(rounded && "[&>tr:last-child>td:first-child]:rounded-bl-[20px] [&>tr:last-child>td:last-child]:rounded-br-[20px]")}>
      {children}
    </tbody>
  );
}
