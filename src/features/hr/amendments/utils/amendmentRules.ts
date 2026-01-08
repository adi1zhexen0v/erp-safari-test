import React from "react";
import { DocumentText1, Import, DocumentUpload, Edit2, Send } from "iconsax-react";
import { CheckIcon, CloseIcon } from "@/shared/assets/icons";
import type { AmendmentDetailResponse, AmendmentStatus } from "../types";

export type AmendmentAction =
  | "upload_application"
  | "download_application_docx"
  | "approve"
  | "revision"
  | "reject"
  | "create_order"
  | "upload_order"
  | "download_order_docx"
  | "submit_agreement";

export interface ActionConfig {
  id: AmendmentAction;
  label: string;
  variant: "primary" | "secondary" | "danger";
  icon: React.ReactNode;
}

export interface AmendmentActionsConfig {
  actions: ActionConfig[];
  isLoading: boolean;
}

interface IsLoadingState {
  isDownloadingApplication: boolean;
  isReviewing: boolean;
  isCreatingOrder: boolean;
  isDownloadingOrder: boolean;
  isSubmittingAgreement: boolean;
}

export function getAvailableActions(
  amendment: AmendmentDetailResponse,
  isLoading: IsLoadingState,
  t: (key: string) => string,
): AmendmentActionsConfig {
  const status = amendment.status as AmendmentStatus;
  const actions: ActionConfig[] = [];

  const canUploadApplication = status === "app_pending";
  const canReviewApplication = status === "app_review";
  const canCreateOrder = status === "app_approved";
  const canUploadOrder = status === "order_pending";
  const canSubmitAgreement = status === "order_uploaded";
  const canDownloadApplicationDocx =
    canUploadApplication && (!amendment.application_pdf_url || amendment.application_review_status === "revision");
  const canDownloadOrderDocx =
    (status === "order_pending" || status === "agr_pending" || status === "applied") &&
    !amendment.order_signed_pdf_url;

  if (canUploadApplication) {
    actions.push({
      id: "upload_application",
      label: t("amendment.actions.uploadApplicationScan") || "Загрузить скан заявления",
      variant: "primary",
      icon: React.createElement(DocumentText1, { size: 16, color: "currentColor" }),
    });
  }

  if (canDownloadApplicationDocx) {
    actions.push({
      id: "download_application_docx",
      label: isLoading.isDownloadingApplication
        ? t("amendment.actions.downloading") || "Загрузка..."
        : t("amendment.actions.downloadApplicationDocx") || "Скачать заявление (DOCX)",
      variant: "secondary",
      icon: React.createElement(Import, { size: 16, color: "currentColor" }),
    });
  }

  if (canReviewApplication) {
    actions.push(
      {
        id: "approve",
        label: isLoading.isReviewing
          ? t("amendment.actions.reviewing") || "Обработка..."
          : t("amendment.actions.approve") || "Одобрить заявление",
        variant: "primary",
        icon: React.createElement(CheckIcon),
      },
      {
        id: "revision",
        label: t("amendment.actions.revision") || "На доработку",
        variant: "secondary",
        icon: React.createElement(Edit2, { size: 16, color: "currentColor" }),
      },
      {
        id: "reject",
        label: t("amendment.actions.reject") || "Отклонить заявление",
        variant: "danger",
        icon: React.createElement(CloseIcon),
      },
    );
  }

  if (canCreateOrder) {
    actions.push({
      id: "create_order",
      label: isLoading.isCreatingOrder
        ? t("amendment.actions.creating") || "Создание..."
        : t("amendment.actions.createOrder") || "Создать приказ",
      variant: "primary",
      icon: React.createElement(DocumentText1, { size: 16, color: "currentColor" }),
    });
  }

  if (canUploadOrder) {
    actions.push({
      id: "upload_order",
      label: t("amendment.actions.uploadOrder") || "Загрузить приказ",
      variant: "primary",
      icon: React.createElement(DocumentUpload, { size: 16, color: "currentColor" }),
    });
  }

  if (canDownloadOrderDocx) {
    actions.push({
      id: "download_order_docx",
      label: isLoading.isDownloadingOrder
        ? t("amendment.actions.downloading") || "Загрузка..."
        : t("amendment.actions.downloadOrderDocx") || "Скачать приказ (DOCX)",
      variant: "secondary",
      icon: React.createElement(Import, { size: 16, color: "currentColor" }),
    });
  }

  if (canSubmitAgreement) {
    actions.push({
      id: "submit_agreement",
      label: isLoading.isSubmittingAgreement
        ? t("amendment.actions.submitting") || "Отправка..."
        : t("amendment.actions.submitAgreement") || "Отправить дополнение на подписание",
      variant: "primary",
      icon: React.createElement(Send, { size: 16, color: "currentColor" }),
    });
  }

  const isLoadingAny =
    isLoading.isDownloadingApplication ||
    isLoading.isReviewing ||
    isLoading.isCreatingOrder ||
    isLoading.isDownloadingOrder ||
    isLoading.isSubmittingAgreement;

  return {
    actions,
    isLoading: isLoadingAny,
  };
}

