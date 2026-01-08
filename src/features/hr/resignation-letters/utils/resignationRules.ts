import React from "react";
import { DocumentText1, Import, DocumentUpload, Edit2, Send, CloseCircle, Trash } from "iconsax-react";
import { CheckIcon, CloseIcon } from "@/shared/assets/icons";
import type { ResignationLetterResponse, ResignationStatus } from "../types";

export type ResignationAction =
  | "submit"
  | "upload_application"
  | "download_application_docx"
  | "approve"
  | "revision"
  | "reject"
  | "create_order"
  | "upload_order"
  | "download_order_docx"
  | "edit"
  | "cancel"
  | "delete";

export interface ActionConfig {
  id: ResignationAction;
  label: string;
  variant: "primary" | "secondary" | "danger";
  icon: React.ReactNode;
}

export interface ResignationActionsConfig {
  actions: ActionConfig[];
  isLoading: boolean;
}

interface IsLoadingState {
  isSubmitting: boolean;
  isDownloadingApplication: boolean;
  isReviewing: boolean;
  isCreatingOrder: boolean;
  isDownloadingOrder: boolean;
  isUpdating: boolean;
  isCancelling: boolean;
  isDeleting: boolean;
}

export function getAvailableActions(
  resignation: ResignationLetterResponse,
  isLoading: IsLoadingState,
  t: (key: string) => string,
): ResignationActionsConfig {
  const status = resignation.status as ResignationStatus;
  const actions: ActionConfig[] = [];

  const canSubmit = status === "draft";
  const canUploadApplication = status === "app_pending";
  const canReviewApplication = status === "app_review";
  const canCreateOrder = status === "app_approved";
  const canUploadOrder = status === "order_pending";
  const canEdit = status === "draft";
  const canCancel =
    status === "app_pending" ||
    status === "app_review" ||
    status === "app_approved" ||
    status === "order_pending";
  const canDelete = status === "draft";
  const canDownloadApplicationDocx =
    status === "draft" ||
    (canUploadApplication && !resignation.application_signed_pdf_url) ||
    (status === "app_review" && resignation.application_review_status === "revision");
  const canDownloadOrderDocx =
    (status === "order_pending" || status === "completed") &&
    resignation.order &&
    !resignation.order.signed_pdf_url;

  if (canSubmit) {
    actions.push({
      id: "submit",
      label: isLoading.isSubmitting
        ? t("resignationLetter.actions.submitting") || "Отправка..."
        : t("resignationLetter.actions.submit") || "Отправить на подпись",
      variant: "primary",
      icon: React.createElement(Send, { size: 16, color: "currentColor" }),
    });
  }

  if (canUploadApplication) {
    actions.push({
      id: "upload_application",
      label: t("resignationLetter.actions.uploadApplication") || "Загрузить скан заявления",
      variant: "primary",
      icon: React.createElement(DocumentUpload, { size: 16, color: "currentColor" }),
    });
  }

  if (canDownloadApplicationDocx) {
    actions.push({
      id: "download_application_docx",
      label: isLoading.isDownloadingApplication
        ? t("resignationLetter.actions.downloading") || "Загрузка..."
        : t("resignationLetter.actions.downloadApplicationDocx") || "Скачать заявление DOCX",
      variant: "secondary",
      icon: React.createElement(Import, { size: 16, color: "currentColor" }),
    });
  }

  if (canReviewApplication) {
    actions.push(
      {
        id: "approve",
        label: t("resignationLetter.actions.approve") || "Одобрить",
        variant: "primary",
        icon: React.createElement(CheckIcon),
      },
      {
        id: "revision",
        label: t("resignationLetter.actions.revision") || "На доработку",
        variant: "secondary",
        icon: React.createElement(Edit2, { size: 16, color: "currentColor" }),
      },
      {
        id: "reject",
        label: t("resignationLetter.actions.reject") || "Отклонить",
        variant: "danger",
        icon: React.createElement(CloseIcon),
      },
    );
  }

  if (canCreateOrder) {
    actions.push({
      id: "create_order",
      label: isLoading.isCreatingOrder
        ? t("resignationLetter.actions.creatingOrder") || "Создание..."
        : t("resignationLetter.actions.createOrder") || "Создать приказ",
      variant: "primary",
      icon: React.createElement(DocumentText1, { size: 16, color: "currentColor" }),
    });
  }

  if (canUploadOrder) {
    actions.push({
      id: "upload_order",
      label: t("resignationLetter.actions.uploadOrder") || "Загрузить скан приказа",
      variant: "primary",
      icon: React.createElement(DocumentUpload, { size: 16, color: "currentColor" }),
    });
  }

  if (canDownloadOrderDocx) {
    actions.push({
      id: "download_order_docx",
      label: isLoading.isDownloadingOrder
        ? t("resignationLetter.actions.downloading") || "Загрузка..."
        : t("resignationLetter.actions.downloadOrderDocx") || "Скачать приказ DOCX",
      variant: "secondary",
      icon: React.createElement(Import, { size: 16, color: "currentColor" }),
    });
  }

  if (canEdit) {
    actions.push({
      id: "edit",
      label: t("resignationLetter.actions.edit") || "Редактировать",
      variant: "secondary",
      icon: React.createElement(Edit2, { size: 16, color: "currentColor" }),
    });
  }

  if (canCancel) {
    actions.push({
      id: "cancel",
      label: t("resignationLetter.actions.cancel") || "Отменить заявление",
      variant: "danger",
      icon: React.createElement(CloseCircle, { size: 16, color: "currentColor" }),
    });
  }

  if (canDelete) {
    actions.push({
      id: "delete",
      label: t("resignationLetter.actions.delete") || "Удалить",
      variant: "danger",
      icon: React.createElement(Trash, { size: 16, color: "currentColor" }),
    });
  }

  const isLoadingAny =
    isLoading.isSubmitting ||
    isLoading.isDownloadingApplication ||
    isLoading.isReviewing ||
    isLoading.isCreatingOrder ||
    isLoading.isDownloadingOrder ||
    isLoading.isUpdating ||
    isLoading.isCancelling ||
    isLoading.isDeleting;

  return {
    actions,
    isLoading: isLoadingAny,
  };
}

