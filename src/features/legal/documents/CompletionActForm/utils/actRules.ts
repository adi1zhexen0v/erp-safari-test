import type { CompletionAct, CompletionActAction } from "../types";

export interface ActionConfig {
  id: CompletionActAction;
  label: string;
  variant: "primary" | "secondary" | "danger" | "tertiary";
}

export interface CompletionActActions {
  actions: ActionConfig[];
  canEdit: boolean;
  canDelete: boolean;
  canUpload: boolean;
  canSubmit: boolean;
  canApprove: boolean;
  canReject: boolean;
  canViewDocument: boolean;
}

export function getAvailableActions(
  act: CompletionAct,
  t: (key: string) => string,
): CompletionActActions {
  const actions: ActionConfig[] = [];

  const canEdit = act.can_edit && act.status === "draft";
  const canDelete = act.status === "draft";
  const canUpload = act.status === "draft";
  const canSubmit = act.can_submit && act.status === "draft" && act.has_document;
  const canApprove = act.can_approve && act.status === "pending_review";
  const canReject = act.status === "pending_review";
  const canViewDocument = act.has_document;

  if (canSubmit) {
    actions.push({
      id: "submit",
      label: t("actions.submit"),
      variant: "primary",
    });
  }

  if (canApprove) {
    actions.push({
      id: "approve",
      label: t("actions.approve"),
      variant: "primary",
    });
  }

  if (canReject) {
    actions.push({
      id: "reject",
      label: t("actions.reject"),
      variant: "danger",
    });
  }

  if (canUpload && !act.has_document) {
    actions.push({
      id: "upload_document",
      label: t("actions.uploadDocument"),
      variant: "secondary",
    });
  }

  if (canViewDocument) {
    actions.push({
      id: "view_document",
      label: t("actions.viewDocument"),
      variant: "tertiary",
    });
  }

  return {
    actions,
    canEdit,
    canDelete,
    canUpload,
    canSubmit,
    canApprove,
    canReject,
    canViewDocument,
  };
}

