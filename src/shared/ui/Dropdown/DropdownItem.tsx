import cn from "classnames";

interface Props {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export default function DropdownItem({ children, active, onClick, className, disabled }: Props) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={cn(
        "w-full flex items-center text-left gap-2 px-3 py-2 text-label-sm rounded-md transition-colors content-base-primary",
        active
          ? "bg-primary-500 content-on-background-brand"
          : "content-base-primary hover:bg-grey-50 dark:hover:bg-grey-900 cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className,
      )}>
      {children}
    </button>
  );
}
