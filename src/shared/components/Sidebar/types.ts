

export type SidebarLink = {
  type: "link";
  label: string;
  icon?: React.ElementType;
  href: string;
};

export type SidebarDropdown = {
  type: "dropdown";
  label: string;
  icon?: React.ElementType;
  children: SidebarLink[];
};

export type SidebarItem = SidebarLink | SidebarDropdown;

export interface SidebarSection {
  label: string;
  items: SidebarItem[];
}
