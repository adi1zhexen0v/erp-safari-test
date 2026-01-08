import cn from "classnames";

interface Props {
  children: React.ReactNode;
  className?: string;
  selected?: boolean;
  onClick?: () => void;
}

export function Row({ children, selected, className, onClick }: Props) {
  return (
    <tr
      onClick={onClick}
      className={cn("border-b border-alpha-black-10 last:border-none", !selected && "hover:bg-grey-50", className)}>
      {children}
    </tr>
  );
}
