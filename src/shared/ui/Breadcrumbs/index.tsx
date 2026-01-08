import { Link } from "react-router";
import cn from "classnames";
import { ChevronRightIcon } from "@/shared/assets/icons";

export type Crumb = {
  label: string;
  href?: string;
};

interface Props {
  items: Crumb[];
  className?: string;
}

export default function Breadcrumbs({ items, className }: Props) {
  return (
    <nav className={cn("flex flex-wrap items-center gap-1", className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={item.label} className="flex items-center gap-1">
            {isLast ? (
              <span className="text-primary-600 text-label-sm">{item.label}</span>
            ) : item.href ? (
              <Link to={item.href} className="content-action-neutral transition-colors text-label-sm">
                {item.label}
              </Link>
            ) : (
              <span className="content-action-neutral transition-colors text-label-sm">{item.label}</span>
            )}

            {!isLast && (
              <div className="icon-secondary w-5 aspect-square flex items-center justify-center">
                <ChevronRightIcon />
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
