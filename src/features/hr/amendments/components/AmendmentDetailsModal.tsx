import { useState, type ReactNode, type ComponentType } from "react";
import { useTranslation } from "react-i18next";
import { DocumentText1, Calendar, User, Clock, TickCircle, CloseCircle, type Icon } from "iconsax-react";
import cn from "classnames";
import { TengeCircleIcon } from "@/shared/assets/icons";
import {
  ModalForm,
  Button,
  Prompt,
  Skeleton,
  FileViewer,
  PromptForm,
  Badge,
  Toast,
  type BadgeColor,
} from "@/shared/ui";
import { TrustMeStatus } from "@/shared/components";
import { formatDateForDisplay, downloadBlob, formatPrice, type Locale } from "@/shared/utils";
import { ReviewNoteModal } from "@/features/hr/shared";
import {
  useGetAmendmentDetailQuery,
  useCreateAmendmentOrderMutation,
  useSubmitAgreementMutation,
  usePreviewApplicationMutation,
  useReviewApplicationMutation,
  usePreviewAmendmentOrderMutation,
} from "../api";
import type { AmendmentStatus, PositionValuesJson } from "../types";
import { getAvailableActions, type AmendmentAction } from "../utils/amendmentRules";
import UploadApplicationModal from "./UploadApplicationModal";
import UploadOrderModal from "./UploadOrderModal";

interface Props {
  amendmentId: number;
  onClose: () => void;
}

interface AmendmentField {
  key: string;
  label: string;
  value: string;
  icon: Icon | ComponentType<{ size?: number; color?: string }>;
  isStatus?: boolean;
  statusComponent?: ReactNode;
}

function AmendmentDetailsSkeleton() {
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
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="py-3 border-b surface-base-stroke">
                <Skeleton height={20} width="100%" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <Skeleton height={44} width="100%" />
    </div>
  );
}

function getStatusDisplayInfo(status: AmendmentStatus): {
  color: BadgeColor;
  translationKey: string;
  icon: React.ReactNode;
} {
  const statusMap: Record<AmendmentStatus, { color: BadgeColor; translationKey: string; icon: React.ReactNode }> = {
    draft: {
      color: "gray",
      translationKey: "amendment.statusLabels.draft",
      icon: <DocumentText1 size={14} color="currentColor" />,
    },
    app_pending: {
      color: "notice",
      translationKey: "amendment.statusLabels.app_pending",
      icon: <Clock size={14} color="currentColor" variant="Bold" />,
    },
    app_review: {
      color: "notice",
      translationKey: "amendment.statusLabels.app_review",
      icon: <Clock size={14} color="currentColor" variant="Bold" />,
    },
    app_approved: {
      color: "notice",
      translationKey: "amendment.statusLabels.order_pending",
      icon: <Clock size={14} color="currentColor" variant="Bold" />,
    },
    order_pending: {
      color: "notice",
      translationKey: "amendment.statusLabels.order_pending",
      icon: <Clock size={14} color="currentColor" variant="Bold" />,
    },
    order_uploaded: {
      color: "positive",
      translationKey: "amendment.statusLabels.order_uploaded",
      icon: <TickCircle size={14} color="currentColor" variant="Bold" />,
    },
    agr_pending: {
      color: "notice",
      translationKey: "amendment.statusLabels.agr_pending",
      icon: <Clock size={14} color="currentColor" variant="Bold" />,
    },
    applied: {
      color: "positive",
      translationKey: "amendment.statusLabels.applied",
      icon: <TickCircle size={14} color="currentColor" variant="Bold" />,
    },
    cancelled: {
      color: "negative",
      translationKey: "amendment.statusLabels.cancelled",
      icon: <CloseCircle size={14} color="currentColor" variant="Bold" />,
    },
  };
  return (
    statusMap[status] || {
      color: "gray",
      translationKey: `amendment.statusLabels.${status}`,
      icon: <DocumentText1 size={14} color="currentColor" />,
    }
  );
}

export default function AmendmentDetailsModal({ amendmentId, onClose }: Props) {
  const { t, i18n } = useTranslation("ContractsPage");
  const locale = (i18n.language as Locale) || "ru";

  const { data: amendment, isLoading, isError } = useGetAmendmentDetailQuery(amendmentId);
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateAmendmentOrderMutation();
  const [submitAgreement, { isLoading: isSubmittingAgreement }] = useSubmitAgreementMutation();
  const [previewApplication, { isLoading: isDownloadingApplication }] = usePreviewApplicationMutation();
  const [reviewApplication, { isLoading: isReviewing }] = useReviewApplicationMutation();
  const [previewOrder, { isLoading: isDownloadingOrder }] = usePreviewAmendmentOrderMutation();

  const [prompt, setPrompt] = useState<{ title: string; text: string; variant?: "success" | "error" } | null>(null);
  const [showUploadApplication, setShowUploadApplication] = useState(false);
  const [showUploadOrder, setShowUploadOrder] = useState(false);
  const [showApprovePrompt, setShowApprovePrompt] = useState(false);
  const [showReviewNoteModal, setShowReviewNoteModal] = useState(false);
  const [selectedReviewAction, setSelectedReviewAction] = useState<"revision" | "reject" | null>(null);

  async function handleCreateOrder() {
    try {
      await createOrder(amendmentId).unwrap();
      setPrompt({
        title: t("amendment.actions.orderCreatedTitle") || "Приказ создан",
        text: t("amendment.actions.orderCreatedText") || "Приказ успешно создан",
        variant: "success",
      });
    } catch {
      setPrompt({
        title: t("amendment.actions.errorTitle") || "Ошибка",
        text: t("amendment.actions.orderCreateError") || "Не удалось создать приказ",
        variant: "error",
      });
    }
  }

  async function handleSubmitAgreement() {
    try {
      await submitAgreement(amendmentId).unwrap();
      setPrompt({
        title: t("amendment.actions.agreementSubmittedTitle") || "Соглашение отправлено",
        text: t("amendment.actions.agreementSubmittedText") || "Дополнительное соглашение отправлено на подписание",
        variant: "success",
      });
    } catch {
      setPrompt({
        title: t("amendment.actions.errorTitle") || "Ошибка",
        text: t("amendment.actions.agreementSubmitError") || "Не удалось отправить соглашение",
        variant: "error",
      });
    }
  }

  function handleUploadSuccess() {
    setShowUploadApplication(false);
    setShowUploadOrder(false);
    setPrompt({
      title: t("amendment.actions.successTitle") || "Успешно",
      text: t("amendment.actions.uploadSuccess") || "Файл успешно загружен",
      variant: "success",
    });
  }

  function handleApprove() {
    setShowApprovePrompt(true);
  }

  async function handleApproveConfirm() {
    try {
      await reviewApplication({
        id: amendmentId,
        data: { action: "approve" },
      }).unwrap();
      setShowApprovePrompt(false);
      setPrompt({
        title: t("amendment.actions.approveSuccessTitle") || "Успешно",
        text: t("amendment.actions.approveSuccessText") || "Заявление одобрено",
        variant: "success",
      });
    } catch {
      setShowApprovePrompt(false);
      setPrompt({
        title: t("amendment.actions.errorTitle") || "Ошибка",
        text: t("amendment.actions.reviewError") || "Не удалось обработать заявление",
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
      await reviewApplication({
        id: amendmentId,
        data: { action: selectedReviewAction, note: note.trim() || undefined },
      }).unwrap();
      setShowReviewNoteModal(false);
      setSelectedReviewAction(null);
      setPrompt({
        title: t("amendment.actions.reviewSuccessTitle") || "Успешно",
        text: t("amendment.actions.reviewSuccessText") || "Заявление обработано",
        variant: "success",
      });
    } catch {
      setPrompt({
        title: t("amendment.actions.errorTitle") || "Ошибка",
        text: t("amendment.actions.reviewError") || "Не удалось обработать заявление",
        variant: "error",
      });
    }
  }

  async function handleDownloadApplicationDocx() {
    try {
      const blob = await previewApplication(amendmentId).unwrap();
      downloadBlob(blob, `Заявление на изменение №${amendmentId}.docx`);
    } catch {
      setPrompt({
        title: t("amendment.actions.errorTitle") || "Ошибка",
        text: t("amendment.actions.downloadApplicationDocxError") || "Не удалось скачать заявление",
        variant: "error",
      });
    }
  }

  async function handleDownloadOrderDocx() {
    try {
      const blob = await previewOrder(amendmentId).unwrap();
      downloadBlob(blob, `Приказ об изменении №${amendmentId}.docx`);
    } catch {
      setPrompt({
        title: t("amendment.actions.errorTitle") || "Ошибка",
        text: t("amendment.actions.downloadOrderDocxError") || "Не удалось скачать приказ",
        variant: "error",
      });
    }
  }

  if (isLoading) {
    return (
      <ModalForm icon={DocumentText1} onClose={onClose} resize={false} allowCloseInOverlay={false}>
        <AmendmentDetailsSkeleton />
      </ModalForm>
    );
  }

  if (isError || !amendment) {
    return (
      <ModalForm icon={DocumentText1} onClose={onClose} resize={false} allowCloseInOverlay={false}>
        <div className="flex flex-col gap-6 h-full min-h-0">
          <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke shrink-0">
            <h4 className="text-display-2xs content-base-primary">{t("amendment.title") || "Дополнение к договору"}</h4>
          </div>
          <div className="flex-1 overflow-auto min-h-0 flex items-center justify-center">
            <p className="text-body-regular-md content-action-negative">
              {t("amendment.loadError") || "Ошибка при загрузке данных"}
            </p>
          </div>
        </div>
      </ModalForm>
    );
  }

  const status = amendment.status as AmendmentStatus;

  function getStatusBadge(status: AmendmentStatus) {
    const info = getStatusDisplayInfo(status);
    return <Badge variant="soft" color={info.color} text={t(info.translationKey)} icon={info.icon} />;
  }

  const { actions } = getAvailableActions(
    amendment,
    {
      isDownloadingApplication,
      isReviewing,
      isCreatingOrder,
      isDownloadingOrder,
      isSubmittingAgreement,
    },
    t,
  );

  const shouldShowApplicationPdf = amendment.application_pdf_url && amendment.application_review_status !== "revision";

  function handleAction(action: AmendmentAction) {
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
      case "submit_agreement":
        handleSubmitAgreement();
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

  function filterField(field: AmendmentField): boolean {
    return !!(field.value || field.isStatus);
  }

  function renderField(field: AmendmentField, index: number, array: AmendmentField[]) {
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

  function isPositionValuesJson(value: unknown): value is PositionValuesJson {
    return (
      typeof value === "object" &&
      value !== null &&
      ("job_position_ru" in value || "job_position_kk" in value || "job_duties_ru" in value || "job_duties_kk" in value)
    );
  }

  const isPositionAmendment =
    (amendment.new_values_json && isPositionValuesJson(amendment.new_values_json)) ||
    (amendment.old_values_json && isPositionValuesJson(amendment.old_values_json));

  const isSalaryAmendment =
    (amendment.new_values_json && "salary_amount" in amendment.new_values_json) ||
    (amendment.old_values_json && "salary_amount" in amendment.old_values_json);

  const fields: AmendmentField[] = [
    {
      key: "effectiveDate",
      label: t("amendment.effectiveDate") || "Дата вступления в силу",
      value: amendment.effective_date ? formatDateForDisplay(amendment.effective_date, false) : "",
      icon: Calendar,
    },
    {
      key: "approvalResolution",
      label: t("amendment.approvalResolution") || "Резолюция согласования",
      value: amendment.approval_resolution_display || "",
      icon: DocumentText1,
    },
    {
      key: "worker",
      label: t("amendment.worker") || "Работник",
      value: amendment.worker.full_name || "",
      icon: User,
    },
    {
      key: "clause",
      label: t("amendment.clause") || "Пункт договора",
      value: amendment.clause.section_number || "",
      icon: DocumentText1,
    },
  ];

  if (isPositionAmendment) {
    const oldPositionValues =
      amendment.old_values_json && isPositionValuesJson(amendment.old_values_json) ? amendment.old_values_json : null;
    const newPositionValues =
      amendment.new_values_json && isPositionValuesJson(amendment.new_values_json) ? amendment.new_values_json : null;

    const oldPosition =
      locale === "ru"
        ? oldPositionValues?.job_position_ru
        : oldPositionValues?.job_position_kk || oldPositionValues?.job_position_ru;
    const newPosition =
      locale === "ru"
        ? newPositionValues?.job_position_ru
        : newPositionValues?.job_position_kk || newPositionValues?.job_position_ru;

    if (oldPosition) {
      fields.push({
        key: "oldPosition",
        label: t("amendment.oldPosition") || "Старая должность",
        value: String(oldPosition),
        icon: DocumentText1,
      });
    }

    if (newPosition) {
      fields.push({
        key: "newPosition",
        label: t("amendment.newPosition") || "Новая должность",
        value: String(newPosition),
        icon: DocumentText1,
      });
    }
  }

  if (isSalaryAmendment) {
    const oldSalary =
      amendment.old_values_json && "salary_amount" in amendment.old_values_json
        ? amendment.old_values_json.salary_amount
        : undefined;
    const newSalary =
      amendment.new_values_json && "salary_amount" in amendment.new_values_json
        ? amendment.new_values_json.salary_amount
        : undefined;

    if (oldSalary) {
      fields.push({
        key: "oldSalary",
        label: t("amendment.oldSalary") || "Старая зарплата",
        value: formatPrice(oldSalary) + " ₸",
        icon: TengeCircleIcon,
      });
    }

    if (newSalary) {
      fields.push({
        key: "newSalary",
        label: t("amendment.newSalary") || "Новая зарплата",
        value: formatPrice(newSalary) + " ₸",
        icon: TengeCircleIcon,
      });
    }
  }

  if (amendment.agreement_trustme) {
    fields.push({
      key: "agreementStatus",
      label: t("amendment.agreementStatus") || "Статус соглашения",
      value: "",
      icon: DocumentText1,
      isStatus: true,
      statusComponent: <TrustMeStatus trustmeStatus={amendment.agreement_trustme.status} locale={locale} />,
    });
  } else {
    fields.push({
      key: "status",
      label: t("amendment.status") || "Статус",
      value: "",
      icon: DocumentText1,
      isStatus: true,
      statusComponent: getStatusBadge(status),
    });
  }

  return (
    <>
      {prompt && (
        <Prompt
          title={prompt.title}
          text={prompt.text}
          variant={prompt.variant || "success"}
          onClose={handlePromptClose}
          namespace="ContractsPage"
        />
      )}

      {showUploadApplication && (
        <UploadApplicationModal
          amendmentId={amendmentId}
          onClose={handleUploadApplicationClose}
          onSuccess={handleUploadSuccess}
        />
      )}

      {showUploadOrder && amendment.order_id && (
        <UploadOrderModal
          orderId={amendment.order_id}
          onClose={handleUploadOrderClose}
          onSuccess={handleUploadSuccess}
        />
      )}

      {showApprovePrompt && (
        <PromptForm
          title={t("amendment.actions.approvePromptTitle") || "Одобрить заявление?"}
          text={t("amendment.actions.approvePromptText") || "Вы уверены, что хотите одобрить это заявление?"}
          variant="warning"
          onClose={handleApprovePromptClose}
          onConfirm={handleApproveConfirm}
          isLoading={isReviewing}
          namespace="ContractsPage"
        />
      )}

      {showReviewNoteModal && selectedReviewAction && (
        <ReviewNoteModal
          action={selectedReviewAction}
          onClose={handleReviewNoteModalClose}
          onSubmit={handleReviewWithNote}
          isSubmitting={isReviewing}
          namespace="ContractsPage"
          translationPrefix="amendment.review"
        />
      )}

      <ModalForm icon={DocumentText1} onClose={onClose} resize={false} allowCloseInOverlay={false}>
        <div className="flex flex-col gap-6 h-full min-h-0">
          <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke shrink-0">
            <h4 className="text-display-2xs content-base-primary">{t("amendment.title") || "Дополнение к договору"}</h4>
          </div>

          <div className="flex-1 overflow-auto min-h-0 p-1">
            <div className="flex flex-col py-4">
              <div className="flex flex-col gap-2 mb-4 border-b surface-base-stroke pb-3">
                <p className="text-body-bold-lg content-base-primary">
                  {t("amendment.prefix") || "Дополнение"} №{amendment.amendment_number}
                </p>
              </div>

              <div className="flex flex-col">
                {fields.filter(filterField).map(function (field, index, array) {
                  return renderField(field, index, array);
                })}

                {shouldShowApplicationPdf && (
                  <div className="py-3 flex flex-col gap-3 border-t surface-base-stroke mt-2">
                    <span className="text-body-regular-md content-base-secondary">
                      {t("amendment.applicationFileLabel") || "Файл заявления"}
                    </span>
                    <FileViewer existingFileUrl={amendment.application_pdf_url} />
                  </div>
                )}

                {amendment.order_signed_pdf_url && (
                  <div className="py-3 flex flex-col gap-3 border-t surface-base-stroke mt-2">
                    <span className="text-body-regular-md content-base-secondary">
                      {t("amendment.orderFileLabel") || "Файл приказа"}
                    </span>
                    <FileViewer existingFileUrl={amendment.order_signed_pdf_url} />
                  </div>
                )}

                {amendment.agreement_trustme?.signed_pdf_url && (
                  <div className="py-3 flex flex-col gap-3 border-t surface-base-stroke mt-2">
                    <span className="text-body-regular-md content-base-secondary">
                      {t("amendment.agreementFileLabel") || "Файл дополнения к договору"}
                    </span>
                    <FileViewer existingFileUrl={amendment.agreement_trustme.signed_pdf_url} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 p-1 shrink-0">
            {actions.some((action) => action.id === "submit_agreement") && (
              <Toast
                color="positive"
                text={
                  t("amendment.actions.submitAgreementInfo") ||
                  "Приказ и заявление подписаны. Теперь нужно отправить на подписание само дополнение к договору."
                }
                isFullWidth
                closable={false}
                autoClose={false}
              />
            )}
            {actions.map((action) => {
              const isDisabled =
                (action.id === "download_application_docx" && isDownloadingApplication) ||
                (action.id === "approve" && isReviewing) ||
                (action.id === "revision" && isReviewing) ||
                (action.id === "reject" && isReviewing) ||
                (action.id === "create_order" && isCreatingOrder) ||
                (action.id === "download_order_docx" && isDownloadingOrder) ||
                (action.id === "submit_agreement" && isSubmittingAgreement);

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
