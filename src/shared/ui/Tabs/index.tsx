import cn from "classnames";

export interface TabItem {
  id: string;
  label: string;
}

interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ items, activeId, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex gap-8 border-b surface-base-stroke", className)}>
      {items.map((item) => {
        const isActive = item.id === activeId;

        return (
          <button key={item.id} onClick={() => onChange(item.id)} className="pb-3 relative">
            <span
              className={cn(
                "text-body-bold-md transition-colors",
                isActive ? "text-primary-base" : "text-content-tertiary",
              )}>
              {item.label}
            </span>

            <div
              className={cn(
                "absolute left-0 right-0 bottom-0 h-[2px] transition-all",
                isActive ? "bg-primary-base" : "bg-transparent",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
