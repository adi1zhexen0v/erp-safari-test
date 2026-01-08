import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import cn from "classnames";
import type { SidebarLink } from "./types";

export default function SidebarLinkItem({
  item,
  location,
  isCollapsed,
}: {
  item: SidebarLink;
  location: any;
  isCollapsed?: boolean;
}) {
  const Icon = item.icon;
  const isActive = location.pathname === item.href;
  const { t } = useTranslation("Sidebar");

  if (isCollapsed) {
    return (
      <Link
        to={item.href}
        className={cn(
          "group flex items-center justify-center py-1.5 rounded-lg transition-colors duration-250",
          isActive
            ? "text-body-bold-sm background-brand-subtle content-action-brand"
            : "text-body-regular-sm content-base-secondary hover:bg-white dark:hover:bg-black",
        )}>
        {Icon && (
          <span className="transition-colors duration-250">
            <Icon size={18} variant={isActive ? "Bulk" : "Linear"} color="currentColor" />
          </span>
        )}
      </Link>
    );
  }

  return (
    <Link
      to={item.href}
      className={cn(
        "group flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors duration-250",
        isActive
          ? "text-body-bold-sm background-brand-subtle content-action-brand"
          : "text-body-regular-sm content-base-secondary hover:bg-white dark:hover:bg-black",
      )}>
      {Icon && (
        <span className="transition-colors duration-250">
          <Icon size={18} variant={isActive ? "Bulk" : "Linear"} color="currentColor" />
        </span>
      )}
      {t(item.label)}
    </Link>
  );
}
