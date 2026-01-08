import {
  Bank,
  Judge,
  Briefcase,
  Data2,
  Home,
  LikeShapes,
  Math,
  MessageQuestion,
  Profile2User,
  Setting,
  TaskSquare,
} from "iconsax-react";
import { TengeCircleIcon } from "@/shared/assets/icons";
import {
  HR_CONTRACTS_PAGE_ROUTE,
  HR_EMPLOYEES_PAGE_ROUTE,
  HR_HIRING_PAGE_ROUTE,
  LEGAL_CONSULTATION_PAGE_ROUTE,
  LEGAL_TEMPLATES_PAGE_ROUTE,
  LEGAL_APPLICATIONS_PAGE_ROUTE,
  HR_LEAVES_PAGE_ROUTE,
  ACCOUNTING_TIMESHEETS_PAGE_ROUTE,
  ACCOUNTING_PAYROLLS_PAGE_ROUTE,
} from "@/shared/utils";
import type { SidebarSection } from "./types";

function withIcon(Component: React.ElementType) {
  return Component;
}

export const sidebarConfig: SidebarSection[] = [
  {
    label: "main",
    items: [
      {
        type: "link",
        label: "home",
        icon: withIcon(Home),
        href: "/",
      },
    ],
  },

  {
    label: "social",
    items: [
      {
        type: "link",
        label: "impact",
        icon: withIcon(LikeShapes),
        href: "/impact",
      },
    ],
  },

  {
    label: "workflows",
    items: [
      {
        type: "link",
        label: "requests",
        icon: withIcon(TaskSquare),
        href: "/requests",
      },
      {
        type: "link",
        label: "projects",
        icon: withIcon(Data2),
        href: "/projects",
      },
      {
        type: "link",
        label: "socialBank",
        icon: withIcon(Bank),
        href: "/social-bank",
      },
    ],
  },

  {
    label: "finance",
    items: [
      {
        type: "dropdown",
        label: "accounting",
        icon: withIcon(Math),
        children: [
          { type: "link", label: "accounting.timesheets", href: ACCOUNTING_TIMESHEETS_PAGE_ROUTE },
          { type: "link", label: "accounting.payrolls", href: ACCOUNTING_PAYROLLS_PAGE_ROUTE },
        ],
      },
      {
        type: "link",
        label: "financePage",
        icon: withIcon(TengeCircleIcon),
        href: "/finance",
      },
    ],
  },

  {
    label: "legal",
    items: [
      {
        type: "dropdown",
        label: "legal.help",
        icon: withIcon(Judge),
        children: [
          { type: "link", label: "legal.consultation", href: LEGAL_CONSULTATION_PAGE_ROUTE },
          { type: "link", label: "legal.templates", href: LEGAL_TEMPLATES_PAGE_ROUTE },
          { type: "link", label: "legal.applications", href: LEGAL_APPLICATIONS_PAGE_ROUTE },
          { type: "link", label: "legal.cases", href: "/legal/cases" },
        ],
      },
    ],
  },

  {
    label: "people",
    items: [
      {
        type: "dropdown",
        label: "hr",
        icon: withIcon(Briefcase),
        children: [
          { type: "link", label: "hr.employees", href: HR_EMPLOYEES_PAGE_ROUTE },
          { type: "link", label: "hr.hiring", href: HR_HIRING_PAGE_ROUTE },
          { type: "link", label: "hr.contracts", href: HR_CONTRACTS_PAGE_ROUTE },
          { type: "link", label: "hr.vacations", href: HR_LEAVES_PAGE_ROUTE },
        ],
      },
      {
        type: "link",
        label: "team",
        icon: withIcon(Profile2User),
        href: "/team",
      },
    ],
  },
];

export const settingsSidebarSection: SidebarSection = {
  label: "support",
  items: [
    {
      type: "link",
      label: "settings",
      icon: withIcon(Setting),
      href: "/settings",
    },
    {
      type: "link",
      label: "supportCenter",
      icon: withIcon(MessageQuestion),
      href: "/support",
    },
  ],
};
