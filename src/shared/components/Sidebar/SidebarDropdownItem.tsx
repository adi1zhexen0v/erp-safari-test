import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import cn from "classnames";
import { ArrowDown2 } from "iconsax-react";
import type { SidebarDropdown, SidebarLink } from "./types";

export default function SidebarDropdownItem({
  item,
  isOpen,
  onToggle,
  location,
  isCollapsed,
  onExpand,
}: {
  item: SidebarDropdown;
  isOpen: boolean;
  onToggle: () => void;
  location: any;
  isCollapsed?: boolean;
  onExpand?: () => void;
}) {
  const Icon = item.icon;
  const { t } = useTranslation("Sidebar");
  const isActive = item.children.some(
    (child) => location.pathname === child.href || location.pathname.startsWith(child.href + "/"),
  );

  function handleClick() {
    if (isCollapsed && onExpand) {
      onExpand();
    } else {
      onToggle();
    }
  }

  if (isCollapsed) {
    return (
      <button
        onClick={handleClick}
        className={cn(
          "group flex items-center justify-center py-1.5 rounded-lg transition-colors duration-250 cursor-pointer",
          isActive
            ? "text-body-bold-sm bg-primary-500/15 content-action-brand"
            : "text-body-regular-sm content-base-secondary hover:bg-white dark:hover:bg-black",
        )}>
        {Icon && (
          <span className="transition-colors duration-250">
            <Icon size={18} variant={isActive ? "Bulk" : "Linear"} color="currentColor" />
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="flex flex-col">
      <button
        onClick={handleClick}
        className={cn(
          "group flex items-center justify-between pl-3 pr-2 py-1.5 rounded-lg transition-colors duration-250 cursor-pointer",
          isActive
            ? "text-body-bold-sm bg-primary-500/15 content-action-brand"
            : "text-body-regular-sm content-base-secondary hover:bg-white dark:hover:bg-black",
        )}>
        <span className="relative flex gap-2 justify-start items-center">
          {Icon && (
            <span className="transition-colors duration-250">
              <Icon size={18} variant={isActive ? "Bulk" : "Linear"} color="currentColor" />
            </span>
          )}
          <span className="text-left">{t(item.label)}</span>
        </span>

        <span
          className={cn(
            "transition-transform duration-250",
            isActive ? "content-action-brand" : "icon-secondary",
            isOpen && "rotate-180",
          )}>
          <ArrowDown2 size={18} color="currentColor" />
        </span>
      </button>

      <div
        className={cn(
          "flex flex-col ml-4 overflow-hidden transition-[max-height] duration-250",
          isOpen ? "max-h-96" : "max-h-0",
        )}>
        {item.children.map((child: SidebarLink) => {
          const isActive = location.pathname === child.href || location.pathname.startsWith(child.href + "/");

          return (
            <Link
              key={child.label}
              to={child.href}
              className={cn(
                "flex justify-start items-center gap-2 mt-0.5 px-3 py-1.5 rounded-md transition-colors duration-250",
                isActive
                  ? "text-body-bold-xs content-base-primary background-static-white hover:bg-white dark:hover:bg-black"
                  : "text-body-regular-xs content-base-secondary hover:bg-white dark:hover:bg-black",
              )}>
              <span className={isActive ? "icon-primary" : "icon-secondary"}>
                <svg width="2" height="16" viewBox="0 0 2 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M1 14L1 2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>

              {t(child.label)}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

