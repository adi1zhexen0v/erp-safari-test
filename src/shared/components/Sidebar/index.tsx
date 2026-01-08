import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { Grid4 } from "iconsax-react";
import ngoLogo from "@/shared/assets/img/ngo-logo.png";
import { Button } from "@/shared/ui";
import { settingsSidebarSection, sidebarConfig } from "./config";
import ProfileButton from "./ProfileButton";
import SidebarDropdownItem from "./SidebarDropdownItem";
import SidebarLinkItem from "./SidebarLinkItem";
import type { SidebarItem, SidebarSection } from "./types";

const SIDEBAR_COLLAPSED_KEY = "sidebar-collapsed";

export default function Sidebar() {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    return saved === "true";
  });
  const location = useLocation();
  const { t } = useTranslation("Sidebar");

  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(isCollapsed));
  }, [isCollapsed]);

  function toggleDropdown(label: string) {
    setOpen((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  function toggleCollapse() {
    setIsCollapsed((prev) => !prev);
  }

  function handleExpand() {
    setIsCollapsed(false);
  }

  return (
    <nav className="relative h-screen p-5">
      <div className={`absolute z-20 ${isCollapsed ? "top-7 right-7" : "top-12 right-10"}`}>
        <Button
          variant={isCollapsed ? "primary" : "secondary"}
          className="w-8 h-8 flex justify-center items-center p-1! rounded-md!"
          onClick={toggleCollapse}>
          <span className={isCollapsed ? "content-on-background-brand" : "content-base-secondary"}>
            <Grid4 size={16} color="currentColor" />
          </span>
        </Button>
      </div>

      <div
        className={`h-full flex flex-col gap-12 justify-between surface-base-fill transition-all duration-250 ${
          isCollapsed ? "min-w-[48px] p-2 radius-sm" : "min-w-[280px] p-5 radius-2xl"
        }`}>
        <div className={`flex flex-col gap-5 h-full overflow-auto no-scrollbar ${isCollapsed ? "pt-16" : ""}`}>
          {!isCollapsed && (
            <div>
              <img src={ngoLogo} className="h-12" alt="Logo" />
            </div>
          )}

          <div className="flex flex-col gap-3">
            {sidebarConfig.map((section: SidebarSection) => (
              <div key={section.label} className="flex flex-col">
                {!isCollapsed && <div className="px-3 py-2 text-label-xs text-grey-400">{t(section.label)}</div>}

                {section.items.map((item: SidebarItem) =>
                  item.type === "dropdown" ? (
                    <SidebarDropdownItem
                      key={item.label}
                      item={item}
                      isOpen={!!open[item.label]}
                      onToggle={() => toggleDropdown(item.label)}
                      location={location}
                      isCollapsed={isCollapsed}
                      onExpand={handleExpand}
                    />
                  ) : (
                    <SidebarLinkItem key={item.label} item={item} location={location} isCollapsed={isCollapsed} />
                  ),
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {!isCollapsed && (
            <div className="flex flex-col">
              <div className="px-3 py-2 text-label-xs text-grey-400">{t(settingsSidebarSection.label)}</div>

              {settingsSidebarSection.items.map((item: SidebarItem) =>
                item.type === "dropdown" ? (
                  <SidebarDropdownItem
                    key={item.label}
                    item={item}
                    isOpen={!!open[item.label]}
                    onToggle={() => toggleDropdown(item.label)}
                    location={location}
                    isCollapsed={isCollapsed}
                    onExpand={handleExpand}
                  />
                ) : (
                  <SidebarLinkItem key={item.label} item={item} location={location} isCollapsed={isCollapsed} />
                ),
              )}
            </div>
          )}
          <ProfileButton isCollapsed={isCollapsed} />
        </div>
      </div>
    </nav>
  );
}
