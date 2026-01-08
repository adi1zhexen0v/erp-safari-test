import React from "react";
import { Edit2 } from "iconsax-react";
import type { GetApplicationsResponse } from "@/features/hr/hiring";
import { CheckIcon, CloseIcon } from "@/shared/assets/icons";

export type HiringAction =
  | "approve"
  | "request_revision"
  | "reject"
  | "create_contract"
  | "view_details";

export interface ActionConfig {
  id: HiringAction;
  label: string;
  variant: "primary" | "secondary" | "danger" | "destructive" | "tertiary";
  icon?: React.ReactNode;
}

export interface ApplicationActions {
  actions: ActionConfig[];
  isLoading: boolean;
}

export function getAvailableActions(
  application: GetApplicationsResponse,
  isLoading: boolean,
  t: (key: string) => string,
): ApplicationActions {
  const { status, has_contract } = application;

  const actions: ActionConfig[] = [];

  if (status === "submitted") {
    actions.push(
      {
        id: "approve",
        label: t("actions.approve"),
        variant: "primary",
        icon: React.createElement(CheckIcon),
      },
      {
        id: "request_revision",
        label: t("actions.requestRevision"),
        variant: "secondary",
        icon: React.createElement(Edit2, { size: 16, color: "currentColor" }),
      },
      {
        id: "reject",
        label: t("actions.reject"),
        variant: "danger",
        icon: React.createElement(CloseIcon),
      },
    );
  } else if (status === "approved" && !has_contract) {
    actions.push({
      id: "create_contract",
      label: t("actions.createContract"),
      variant: "primary",
    });
  }

  actions.push({
    id: "view_details",
    label: t("actions.viewDetails"),
    variant: "tertiary",
  });

  return {
    actions,
    isLoading,
  };
}

