import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DocumentText1, Calendar, User, Clock, TickCircle, CloseCircle } from "iconsax-react";
import type { Icon } from "iconsax-react";
import cn from "classnames";
import { ModalForm, Button, Prompt, Skeleton, FileViewer, PromptForm, Badge, type BadgeColor } from "@/shared/ui";
import { FileUploader } from "@/shared/components";
import { formatDateForDisplay, downloadBlob } from "@/shared/utils";
import { ReviewNoteModal } from "@/features/hr/shared";
import {
  useGetAnnualLeaveQuery,
  useGetUnpaidLeaveQuery,
  useGetMedicalLeaveQuery,
  useCreateAnnualOrderMutation,
  useCreateUnpaidOrderMutation,
  useCreateMedicalOrderMutation,
  usePreviewAnnualApplicationMutation,
  usePreviewUnpaidApplicationMutation,
  usePreviewMedicalApplicationMutation,
  useReviewAnnualApplicationMutation,
  useReviewUnpaidApplicationMutation,
  useReviewMedicalApplicationMutation,
  usePreviewAnnualOrderMutation,
  usePreviewUnpaidOrderMutation,
  usePreviewMedicalOrderMutation,
  useCompleteAnnualLeaveMutation,
  useCompleteUnpaidLeaveMutation,
  useCompleteMedicalLeaveMutation,
  useUploadMedicalCertificateMutation,
} from "../api";
import type { LeaveStatus, LeaveApplication, MedicalLeaveResponse } from "../types";
import { getStatusText } from "../consts/statuses";
import { getAvailableActions, type LeaveAction } from "../utils/leaveApplicationRules";
import UploadApplicationModal from "./UploadApplicationModal";
import UploadOrderModal from "./UploadOrderModal";
import UploadCertificateModal from "./UploadCertificateModal";

interface Props {
  leave: LeaveApplication;
  onClose: () => void;
}

interface LeaveField {
  key: string;
  label: string;
  value: string;
  icon: Icon;
  isStatus?: boolean;
  statusComponent?: React.ReactNode;
}

function LeaveDetailsSkeleton() {
  return (
    <div className="flex flex-col gap-6 h-full min-h-0">
      <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke shrink-0">
        <Skeleton height={28} width={240} />
      </div>
      <div className="flex-1 overflow-auto min-h-0">
        <div className="flex flex-col py-4">
          <div className="flex flex-col gap-2 mb-4 border-b surface-base-stroke pb-3">
            <Skeleton height={24} width={200} />
            <Skeleton height={32} width={150} />
          </div>
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map(function (_, idx) {
              return (
                <div key={idx} className="py-3 border-b surface-base-stroke">
                  <Skeleton height={20} width="100%" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Skeleton height={44} width="100%" />
    </div>
  );
}

function getStatusDisplayInfo(status: LeaveStatus): {
  color: BadgeColor;
  translationKey: string;
  icon: React.ReactNode;
} {
  const statusMap: Record<LeaveStatus, { color: BadgeColor; translationKey: string; icon: React.ReactNode }> = {
    draft: {
      color: "gray",
      translationKey: "statusLabels.draft",
      icon: <DocumentText1 size={14} color="currentColor" />,
    },
    app_pending: {
      color: "notice",
      translationKey: "statusLabels.app_pending",
      icon: <Clock size={14} color="currentColor" variant="Bold" />,
    },
    app_review: {
      color: "notice",
      translationKey: "statusLabels.app_review",
      icon: <Clock size={14} color="currentColor" variant="Bold" />,
    },
    app_approved: {
      color: "notice",
      translationKey: "statusLabels.app_approved",
      icon: <Clock size={14} color="currentColor" variant="Bold" />,
    },
    order_pending: {
      color: "notice",
      translationKey: "statusLabels.order_pending",
      icon: <Clock size={14} color="currentColor" variant="Bold" />,
    },
    order_uploaded: {
      color: "positive",
      translationKey: "statusLabels.order_uploaded",
      icon: <TickCircle size={14} color="currentColor" variant="Bold" />,
    },
    active: {
      color: "positive",
      translationKey: "statusLabels.active",
      icon: <TickCircle size={14} color="currentColor" variant="Bold" />,
    },
    completed: {
      color: "gray",
      translationKey: "statusLabels.completed",
      icon: <TickCircle size={14} color="currentColor" variant="Bold" />,
    },
    cancelled: {
      color: "negative",
      translationKey: "statusLabels.cancelled",
      icon: <CloseCircle size={14} color="currentColor" variant="Bold" />,
    },
  };
  return (
    statusMap[status] || {
      color: "gray",
      translationKey: `statusLabels.${status}`,
      icon: <DocumentText1 size={14} color="currentColor" />,
    }
  );
}

export default function LeaveDetailsModal({ leave, onClose }: Props) {
  const { t } = useTranslation("LeaveApplicationsPage");

  const leaveId = leave.id;
  const leaveType = leave.leave_type;

  const { data: annualLeave, isLoading: isLoadingAnnual } = useGetAnnualLeaveQuery(leaveId, {
    skip: leaveType !== "annual",
  });
  const { data: unpaidLeave, isLoading: isLoadingUnpaid } = useGetUnpaidLeaveQuery(leaveId, {
    skip: leaveType !== "unpaid",
  });
  const { data: medicalLeave, isLoading: isLoadingMedical } = useGetMedicalLeaveQuery(leaveId, {
    skip: leaveType !== "medical",
  });

  const isLoading = isLoadingAnnual || isLoadingUnpaid || isLoadingMedical;
  const currentLeave = annualLeave || unpaidLeave || medicalLeave || leave;

  const [createAnnualOrder, { isLoading: isCreatingAnnualOrder }] = useCreateAnnualOrderMutation();
  const [createUnpaidOrder, { isLoading: isCreatingUnpaidOrder }] = useCreateUnpaidOrderMutation();
  const [createMedicalOrder, { isLoading: isCreatingMedicalOrder }] = useCreateMedicalOrderMutation();
  const [previewAnnualApp, { isLoading: isDownloadingAnnualApp }] = usePreviewAnnualApplicationMutation();
  const [previewUnpaidApp, { isLoading: isDownloadingUnpaidApp }] = usePreviewUnpaidApplicationMutation();
  const [previewMedicalApp, { isLoading: isDownloadingMedicalApp }] = usePreviewMedicalApplicationMutation();
  const [reviewAnnualApp, { isLoading: isReviewingAnnual }] = useReviewAnnualApplicationMutation();
  const [reviewUnpaidApp, { isLoading: isReviewingUnpaid }] = useReviewUnpaidApplicationMutation();
  const [reviewMedicalApp, { isLoading: isReviewingMedical }] = useReviewMedicalApplicationMutation();
  const [previewAnnualOrder, { isLoading: isDownloadingAnnualOrder }] = usePreviewAnnualOrderMutation();
  const [previewUnpaidOrder, { isLoading: isDownloadingUnpaidOrder }] = usePreviewUnpaidOrderMutation();
  const [previewMedicalOrder, { isLoading: isDownloadingMedicalOrder }] = usePreviewMedicalOrderMutation();
  const [completeAnnual, { isLoading: isCompletingAnnual }] = useCompleteAnnualLeaveMutation();
  const [completeUnpaid, { isLoading: isCompletingUnpaid }] = useCompleteUnpaidLeaveMutation();
  const [completeMedical, { isLoading: isCompletingMedical }] = useCompleteMedicalLeaveMutation();

  const isCreatingOrder = isCreatingAnnualOrder || isCreatingUnpaidOrder || isCreatingMedicalOrder;
  const isDownloadingApplication = isDownloadingAnnualApp || isDownloadingUnpaidApp || isDownloadingMedicalApp;
  const isReviewing = isReviewingAnnual || isReviewingUnpaid || isReviewingMedical;
  const isDownloadingOrder = isDownloadingAnnualOrder || isDownloadingUnpaidOrder || isDownloadingMedicalOrder;
  const isCompleting = isCompletingAnnual || isCompletingUnpaid || isCompletingMedical;

  const [prompt, setPrompt] = useState<{ title: string; text: string; variant?: "success" | "error" } | null>(null);
  const [showUploadApplication, setShowUploadApplication] = useState(false);
  const [showUploadOrder, setShowUploadOrder] = useState(false);
  const [showUploadCertificate, setShowUploadCertificate] = useState(false);
  const [showApprovePrompt, setShowApprovePrompt] = useState(false);
  const [showReviewNoteModal, setShowReviewNoteModal] = useState(false);
  const [selectedReviewAction, setSelectedReviewAction] = useState<"revision" | "reject" | null>(null);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [uploadMedicalCertificate, { isLoading: isUpdatingCertificate }] = useUploadMedicalCertificateMutation();

  useEffect(
    function () {
      setCertificateFile(null);
    },
    [leaveId],
  );

  async function handleCreateOrder() {
    try {
      if (leaveType === "annual") {
        await createAnnualOrder(leaveId).unwrap();
      } else if (leaveType === "unpaid") {
        await createUnpaidOrder(leaveId).unwrap();
      } else {
        await createMedicalOrder(leaveId).unwrap();
      }
      setPrompt({
        title: t("actions.orderCreatedTitle") || "Приказ создан",
        text: t("actions.orderCreatedText") || "Приказ успешно создан",
        variant: "success",
      });
    } catch {
      setPrompt({
        title: t("messages.errorTitle") || "Ошибка",
        text: t("actions.orderCreateError") || "Не удалось создать приказ",
        variant: "error",
      });
    }
  }

  async function handleComplete() {
    try {
      if (leaveType === "annual") {
        await completeAnnual(leaveId).unwrap();
      } else if (leaveType === "unpaid") {
        await completeUnpaid(leaveId).unwrap();
      } else {
        await completeMedical(leaveId).unwrap();
      }
      setPrompt({
        title: t("actions.completeSuccessTitle") || "Успешно",
        text: t("actions.completeSuccessText") || "Отпуск активирован",
        variant: "success",
      });
    } catch {
      setPrompt({
        title: t("messages.errorTitle") || "Ошибка",
        text: t("actions.completeError") || "Не удалось активировать отпуск",
        variant: "error",
      });
    }
  }

  function handleUploadSuccess() {
    setShowUploadApplication(false);
    setShowUploadOrder(false);
    setShowUploadCertificate(false);
    setCertificateFile(null);
    setPrompt({
      title: t("actions.successTitle") || "Успешно",
      text: t("actions.uploadSuccess") || "Файл успешно загружен",
      variant: "success",
    });
  }

  async function handleUpdateCertificate() {
    if (!certificateFile) return;

    try {
      await uploadMedicalCertificate({ id: leaveId, file: certificateFile }).unwrap();
      setCertificateFile(null);
      setPrompt({
        title: t("actions.successTitle") || "Успешно",
        text: t("actions.updateCertificateSuccess") || "Медицинская справка успешно обновлена",
        variant: "success",
      });
    } catch {
      setPrompt({
        title: t("messages.errorTitle") || "Ошибка",
        text: t("messages.updateCertificateError") || "Не удалось обновить медицинскую справку",
        variant: "error",
      });
    }
  }

  function handleApprove() {
    setShowApprovePrompt(true);
  }

  async function handleApproveConfirm() {
    try {
      const reviewFn =
        leaveType === "annual" ? reviewAnnualApp : leaveType === "unpaid" ? reviewUnpaidApp : reviewMedicalApp;
      await reviewFn({
        id: leaveId,
        data: { action: "approve" },
      }).unwrap();
      setShowApprovePrompt(false);
      setPrompt({
        title: t("actions.approveSuccessTitle") || "Успешно",
        text: t("actions.approveSuccessText") || "Заявление одобрено",
        variant: "success",
      });
    } catch {
      setShowApprovePrompt(false);
      setPrompt({
        title: t("messages.errorTitle") || "Ошибка",
        text: t("actions.reviewError") || "Не удалось обработать заявление",
        variant: "error",
      });
    }
  }

  function handleReviewAction(action: "revision" | "reject") {
    setSelectedReviewAction(action);
    setShowReviewNoteModal(true);
  }

  async function handleReviewWithNote(note: string) {
    if (!selectedReviewAction) return;

    try {
      const reviewFn =
        leaveType === "annual" ? reviewAnnualApp : leaveType === "unpaid" ? reviewUnpaidApp : reviewMedicalApp;
      await reviewFn({
        id: leaveId,
        data: { action: selectedReviewAction, note: note.trim() || undefined },
      }).unwrap();
      setShowReviewNoteModal(false);
      setSelectedReviewAction(null);
      setPrompt({
        title: t("actions.reviewSuccessTitle") || "Успешно",
        text: t("actions.reviewSuccessText") || "Заявление обработано",
        variant: "success",
      });
    } catch {
      setPrompt({
        title: t("messages.errorTitle") || "Ошибка",
        text: t("actions.reviewError") || "Не удалось обработать заявление",
        variant: "error",
      });
    }
  }

  async function handleDownloadApplicationDocx() {
    try {
      let blob: Blob;
      let fileName: string;
      if (leaveType === "annual") {
        blob = await previewAnnualApp(leaveId).unwrap();
        fileName = `Заявление на ежегодный отпуск №${leaveId}.docx`;
      } else if (leaveType === "unpaid") {
        blob = await previewUnpaidApp(leaveId).unwrap();
        fileName = `Заявление на отпуск без сохранения заработной платы №${leaveId}.docx`;
      } else {
        blob = await previewMedicalApp(leaveId).unwrap();
        fileName = `Заявление на больничный №${leaveId}.docx`;
      }
      downloadBlob(blob, fileName);
    } catch {
      setPrompt({
        title: t("messages.errorTitle") || "Ошибка",
        text: t("actions.downloadApplicationDocxError") || "Не удалось скачать заявление",
        variant: "error",
      });
    }
  }

  async function handleDownloadOrderDocx() {
    try {
      let blob: Blob;
      let fileName: string;
      if (leaveType === "annual") {
        blob = await previewAnnualOrder(leaveId).unwrap();
        fileName = `Приказ на ежегодный отпуск №${leaveId}.docx`;
      } else if (leaveType === "unpaid") {
        blob = await previewUnpaidOrder(leaveId).unwrap();
        fileName = `Приказ на отпуск без сохранения заработной платы №${leaveId}.docx`;
      } else {
        blob = await previewMedicalOrder(leaveId).unwrap();
        fileName = `Приказ на больничный №${leaveId}.docx`;
      }
      downloadBlob(blob, fileName);
    } catch {
      setPrompt({
        title: t("messages.errorTitle") || "Ошибка",
        text: t("actions.downloadOrderDocxError") || "Не удалось скачать приказ",
        variant: "error",
      });
    }
  }

  if (isLoading && !currentLeave) {
    return (
      <ModalForm icon={DocumentText1} onClose={onClose} resize={false} allowCloseInOverlay={false}>
        <LeaveDetailsSkeleton />
      </ModalForm>
    );
  }

  if (!currentLeave) {
    return (
      <ModalForm icon={DocumentText1} onClose={onClose} resize={false} allowCloseInOverlay={false}>
        <div className="flex flex-col gap-6 h-full min-h-0">
          <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke shrink-0">
            <h4 className="text-display-2xs content-base-primary">{t("details.title") || "Детали отпуска"}</h4>
          </div>
          <div className="flex-1 overflow-auto min-h-0 flex items-center justify-center">
            <p className="text-body-regular-md content-action-negative">
              {t("messages.loadError") || "Ошибка при загрузке данных"}
            </p>
          </div>
        </div>
      </ModalForm>
    );
  }

  const status = currentLeave.status as LeaveStatus;

  function getStatusBadge(leaveStatus: LeaveStatus) {
    const info = getStatusDisplayInfo(leaveStatus);
    const statusText = getStatusText(currentLeave as LeaveApplication, t);
    return <Badge variant="soft" color={info.color} text={statusText} icon={info.icon} />;
  }

  const leaveApplication = currentLeave as LeaveApplication;

  const { actions } = getAvailableActions(
    leaveApplication,
    {
      isDownloadingApplication,
      isReviewing,
      isCreatingOrder,
      isDownloadingOrder,
      isCompleting,
      isUpdatingCertificate,
    },
    t,
  );

  const shouldShowApplicationPdf =
    currentLeave.application_signed_pdf_url && currentLeave.application_review_status !== "revision";

  function handleAction(action: LeaveAction) {
    switch (action) {
      case "upload_application":
        handleShowUploadApplication();
        break;
      case "download_application_docx":
        handleDownloadApplicationDocx();
        break;
      case "approve":
        handleApprove();
        break;
      case "revision":
        handleReviewAction("revision");
        break;
      case "reject":
        handleReviewAction("reject");
        break;
      case "create_order":
        handleCreateOrder();
        break;
      case "upload_order":
        handleShowUploadOrder();
        break;
      case "download_order_docx":
        handleDownloadOrderDocx();
        break;
      case "complete":
        handleComplete();
        break;
      case "upload_certificate":
        handleShowUploadCertificate();
        break;
    }
  }

  function handlePromptClose() {
    setPrompt(null);
  }

  function handleUploadApplicationClose() {
    setShowUploadApplication(false);
  }

  function handleUploadOrderClose() {
    setShowUploadOrder(false);
  }

  function handleUploadCertificateClose() {
    setShowUploadCertificate(false);
  }

  function handleApprovePromptClose() {
    setShowApprovePrompt(false);
  }

  function handleReviewNoteModalClose() {
    setShowReviewNoteModal(false);
    setSelectedReviewAction(null);
  }

  function handleShowUploadApplication() {
    setShowUploadApplication(true);
  }

  function handleShowUploadOrder() {
    setShowUploadOrder(true);
  }

  function handleShowUploadCertificate() {
    setShowUploadCertificate(true);
  }

  function filterField(field: LeaveField): boolean {
    return !!(field.value || field.isStatus);
  }

  function renderField(field: LeaveField, index: number, array: LeaveField[]) {
    const IconComponent = field.icon;
    return (
      <div
        key={field.key}
        className={cn("py-3 flex items-center gap-3", index < array.length - 1 && "border-b surface-base-stroke")}>
        <span className="content-action-brand">
          <IconComponent size={16} color="currentColor" />
        </span>
        <span className="text-body-regular-md content-base-secondary flex-1 min-w-[132px]">{field.label}</span>
        {field.isStatus ? (
          <div className="flex justify-end">{field.statusComponent}</div>
        ) : (
          <p className="text-body-bold-md content-base-primary text-right">{field.value}</p>
        )}
      </div>
    );
  }

  const fields: LeaveField[] = [
    {
      key: "worker",
      label: t("details.worker") || "Работник",
      value: currentLeave.worker.full_name || "",
      icon: User,
    },
    {
      key: "startDate",
      label: t("details.startDate") || "Дата начала",
      value: currentLeave.start_date ? formatDateForDisplay(currentLeave.start_date, false) : "",
      icon: Calendar,
    },
    {
      key: "endDate",
      label: t("details.endDate") || "Дата окончания",
      value: currentLeave.end_date ? formatDateForDisplay(currentLeave.end_date, false) : "",
      icon: Calendar,
    },
    {
      key: "daysCount",
      label: t("details.daysCount") || "Количество дней",
      value: String(currentLeave.days_count || 0),
      icon: Calendar,
    },
  ];

  if (leaveType === "annual" && "reason" in currentLeave && currentLeave.reason) {
    fields.push({
      key: "reason",
      label: t("details.reason") || "Причина",
      value: currentLeave.reason,
      icon: DocumentText1,
    });
  }

  if (leaveType === "unpaid" && "reason" in currentLeave) {
    fields.push({
      key: "reason",
      label: t("details.reason") || "Причина",
      value: currentLeave.reason || "",
      icon: DocumentText1,
    });
    if (
      "approval_resolution_display" in currentLeave &&
      currentLeave.approval_resolution_display &&
      typeof currentLeave.approval_resolution_display === "string"
    ) {
      fields.push({
        key: "approvalResolution",
        label: t("details.approvalResolution") || "Резолюция",
        value: currentLeave.approval_resolution_display,
        icon: DocumentText1,
      });
    }
  }

  if (leaveType === "medical" && "diagnosis" in currentLeave && currentLeave.diagnosis) {
    fields.push({
      key: "diagnosis",
      label: t("details.diagnosis") || "Диагноз",
      value: currentLeave.diagnosis,
      icon: DocumentText1,
    });
  }

  fields.push({
    key: "status",
    label: t("details.status") || "Статус",
    value: "",
    icon: DocumentText1,
    isStatus: true,
    statusComponent: getStatusBadge(status),
  });

  const orderId = currentLeave.order?.id;

  return (
    <>
      {prompt && (
        <Prompt
          title={prompt.title}
          text={prompt.text}
          variant={prompt.variant || "success"}
          onClose={handlePromptClose}
        />
      )}

      {showUploadApplication && (
        <UploadApplicationModal
          leaveId={leaveId}
          leaveType={leaveType}
          onClose={handleUploadApplicationClose}
          onSuccess={handleUploadSuccess}
        />
      )}

      {showUploadOrder && (
        <UploadOrderModal
          leaveId={leaveId}
          leaveType={leaveType}
          orderId={orderId}
          onClose={handleUploadOrderClose}
          onSuccess={handleUploadSuccess}
        />
      )}

      {showUploadCertificate && leaveType === "medical" && (
        <UploadCertificateModal
          leaveId={leaveId}
          onClose={handleUploadCertificateClose}
          onSuccess={handleUploadSuccess}
        />
      )}

      {showApprovePrompt && (
        <PromptForm
          title={t("actions.approvePromptTitle") || "Одобрить заявление?"}
          text={t("actions.approvePromptText") || "Вы уверены, что хотите одобрить это заявление?"}
          variant="warning"
          onClose={handleApprovePromptClose}
          onConfirm={handleApproveConfirm}
          isLoading={isReviewing}
        />
      )}

      {showReviewNoteModal && selectedReviewAction && (
        <ReviewNoteModal
          action={selectedReviewAction}
          onClose={handleReviewNoteModalClose}
          onSubmit={handleReviewWithNote}
          isSubmitting={isReviewing}
          namespace="LeaveApplicationsPage"
          translationPrefix="review"
        />
      )}

      <ModalForm icon={DocumentText1} onClose={onClose} resize={false} allowCloseInOverlay={false}>
        <div className="flex flex-col gap-6 h-full min-h-0">
          <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke shrink-0">
            <h4 className="text-display-2xs content-base-primary">{t("details.title") || "Детали отпуска"}</h4>
          </div>

          <div className="flex-1 overflow-auto min-h-0 p-1">
            <div className="flex flex-col py-4">
              <div className="flex flex-col gap-2 mb-4 border-b surface-base-stroke pb-3">
                <p className="text-body-bold-lg content-base-primary">
                  {leaveType === "annual"
                    ? t("details.annualLeave") || "Ежегодный отпуск"
                    : leaveType === "unpaid"
                      ? t("details.unpaidLeave") || "Отпуск без сохранения заработной платы"
                      : t("details.medicalLeave") || "На больничном"}
                </p>
              </div>

              <div className="flex flex-col">
                {fields.filter(filterField).map(function (field, index, array) {
                  return renderField(field, index, array);
                })}

                {shouldShowApplicationPdf && (
                  <div className="py-3 flex flex-col gap-3 border-t surface-base-stroke mt-2">
                    <span className="text-body-regular-md content-base-secondary">
                      {t("details.applicationFileLabel") || "Файл заявления"}
                    </span>
                    <FileViewer existingFileUrl={currentLeave.application_signed_pdf_url} />
                  </div>
                )}

                {currentLeave.order?.pdf_url && (
                  <div className="py-3 flex flex-col gap-3 border-t surface-base-stroke mt-2">
                    <span className="text-body-regular-md content-base-secondary">
                      {t("details.orderFileLabel") || "Файл приказа"}
                    </span>
                    <FileViewer existingFileUrl={currentLeave.order.pdf_url} />
                  </div>
                )}

                {leaveType === "medical" &&
                  "certificate_pdf_url" in currentLeave &&
                  (currentLeave as MedicalLeaveResponse).certificate_pdf_url && (
                    <div className="py-3 flex flex-col gap-3 border-t surface-base-stroke mt-2">
                      <span className="text-body-regular-md content-base-secondary">
                        {t("details.certificateFileLabel") || "Медицинская справка"}
                      </span>
                      <FileUploader
                        accept=".pdf"
                        maxSizeMB={10}
                        value={certificateFile}
                        existingFileUrl={(currentLeave as MedicalLeaveResponse).certificate_pdf_url}
                        onChange={setCertificateFile}
                        namespace="LeaveApplicationsPage"
                      />
                      {certificateFile && (
                        <Button
                          variant="primary"
                          size="md"
                          className="w-full"
                          disabled={isUpdatingCertificate}
                          onClick={handleUpdateCertificate}>
                          {isUpdatingCertificate
                            ? t("actions.uploading") || "Загрузка..."
                            : t("actions.updateCertificate") || "Обновить медицинскую справку"}
                        </Button>
                      )}
                    </div>
                  )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 p-1 shrink-0">
            {actions.map((action) => {
              const isDisabled =
                (action.id === "download_application_docx" && isDownloadingApplication) ||
                (action.id === "approve" && isReviewing) ||
                (action.id === "revision" && isReviewing) ||
                (action.id === "reject" && isReviewing) ||
                (action.id === "create_order" && isCreatingOrder) ||
                (action.id === "download_order_docx" && isDownloadingOrder) ||
                (action.id === "complete" && isCompleting);

              return (
                <Button
                  key={action.id}
                  variant={action.variant}
                  size="md"
                  className="w-full"
                  disabled={isDisabled}
                  onClick={() => handleAction(action.id)}>
                  {action.icon}
                  {action.label}
                </Button>
              );
            })}
          </div>
        </div>
      </ModalForm>
    </>
  );
}

