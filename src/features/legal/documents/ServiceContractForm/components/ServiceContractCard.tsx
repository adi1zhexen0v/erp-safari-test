import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Edit2,
  Import,
  Trash,
  Profile,
  Briefcase,
  Location,
  Calendar,
  DocumentText1,
  ArrowDown2,
  ArrowRight2,
} from "iconsax-react";
import { Button, ModalForm, Prompt, PromptForm, Dropdown, DropdownItem } from "@/shared/ui";
import { useApiErrorHandler } from "@/shared/hooks";
import { TrustMeStatus } from "@/shared/components";
import { formatDateForDisplay, formatPrice, downloadBlob } from "@/shared/utils";
import { TengeCircleIcon } from "@/shared/assets/icons";
import { useGetCitiesQuery } from "@/shared/api/common";
import { useCreateCompletionActMutation } from "../../CompletionActForm/api";
import {
  CompletionActCreateModal,
  CompletionActDetailModal,
  CompletionActRejectModal,
  useCompletionActModals,
  useCompletionActMutations,
  mapFormToApiPayload,
} from "../../CompletionActForm";
import type { CompletionActListItem } from "../../CompletionActForm/types";
import { TRUSTME_STATUS } from "../../../pages/consts";
import type { ServiceContractContract } from "../types";
import {
  useSubmitServiceContractForSigningMutation,
  useDownloadServiceContractPreviewMutation,
  useGetServiceContractQuery,
  useDeleteServiceContractMutation,
} from "../api";
import { mapApiResponseToForm, mapFormToPreviewData } from "../utils";
import ServiceContractPreviewModal from "./ServiceContractPreviewModal";
import ServiceContractPreviewModalSkeleton from "./ServiceContractPreviewModalSkeleton";
import ServiceContractForm from "./ServiceContractForm";
import ServiceContractDetailsModal from "./ServiceContractDetailsModal";

interface Props {
  document: ServiceContractContract;
  completionActs: CompletionActListItem[];
}

export default function ServiceContractCard({ document, completionActs }: Props) {
  const { t, i18n } = useTranslation("LegalApplicationsPage");
  const { t: tTemplates } = useTranslation("LegalTemplatesPage");
  const locale = (i18n.language === "kk" ? "kk" : "ru") as "ru" | "kk";

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCreateActOpen, setIsCreateActOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isDownloadDropdownOpen, setIsDownloadDropdownOpen] = useState(false);
  const [selectedActId, setSelectedActId] = useState<number | null>(null);
  const [prompt, setPrompt] = useState<{ title: string; text: string; variant?: "success" | "error" } | null>(null);

  const isDraft = document.trustme_status === TRUSTME_STATUS.DRAFT;
  const isSigned = document.trustme_status === TRUSTME_STATUS.SIGNED;

  const [submitForSigning, { isLoading: isSubmitting }] = useSubmitServiceContractForSigningMutation();
  const [downloadPreview, { isLoading: isDownloadingPreview }] = useDownloadServiceContractPreviewMutation();
  const [deleteServiceContract, { isLoading: isDeleting }] = useDeleteServiceContractMutation();
  const { data: documentData, isLoading: isLoadingDocumentData } = useGetServiceContractQuery(document.id, {
    skip: !isPreviewOpen && !isEditOpen,
  });

  const [createCompletionAct, { isLoading: isCreatingAct }] = useCreateCompletionActMutation();

  const actModals = useCompletionActModals();
  const actMutations = useCompletionActMutations(actModals.setPrompt);

  const { data: cities = [] } = useGetCitiesQuery();
  const canPreview = isDraft || isSigned;
  const canDownloadPDF = document.trustme_status === TRUSTME_STATUS.SIGNED && document.signed_pdf_url;
  const canCreateAct = isSigned;

  const { handleApiError } = useApiErrorHandler({ namespace: "LegalApplicationsPage", setPrompt });

  function handlePreview() {
    if (isSigned) {
      setIsDetailsOpen(true);
    } else {
      setIsPreviewOpen(true);
    }
  }

  function handleCloseDetails() {
    setIsDetailsOpen(false);
  }

  function handleEdit() {
    setIsEditOpen(true);
  }

  function handleCloseEdit() {
    setIsEditOpen(false);
  }

  function handleClosePreview() {
    setIsPreviewOpen(false);
  }

  async function handleSubmitForSigning() {
    try {
      await submitForSigning(document.id).unwrap();
      setPrompt({
        title: t("messages.submitSuccessTitle"),
        text: t("messages.submitSuccessText"),
        variant: "success",
      });
    } catch (err: unknown) {
      handleApiError(err, "messages.submitFailed");
    }
  }

  function handleDownloadPDF() {
    if (document.signed_pdf_url) {
      window.open(document.signed_pdf_url, "_blank");
    }
  }

  async function handleDownloadDraft() {
    try {
      const blob = await downloadPreview(document.id).unwrap();
      downloadBlob(blob, `Договор возмездного оказания услуг №${document.id}.docx`);
    } catch (err: unknown) {
      handleApiError(err, "messages.downloadFailed");
    }
  }

  function handleEditSuccess(isEdit: boolean) {
    setIsEditOpen(false);
    if (isEdit) {
      setPrompt({
        title: t("messages.updateSuccessTitle"),
        text: t("messages.updateSuccessText"),
        variant: "success",
      });
    }
  }

  function handleDelete() {
    setIsConfirmDeleteOpen(true);
  }

  async function handleConfirmDelete() {
    try {
      await deleteServiceContract(document.id).unwrap();
      setIsConfirmDeleteOpen(false);
      setPrompt({
        title: t("messages.deleteSuccessTitle"),
        text: t("messages.deleteSuccessText"),
        variant: "success",
      });
    } catch (err: unknown) {
      setIsConfirmDeleteOpen(false);
      handleApiError(err, "messages.deleteFailed");
    }
  }

  function handleCancelDelete() {
    setIsConfirmDeleteOpen(false);
  }

  function handleOpenPreviewFromDetails() {
    setIsDetailsOpen(false);
    setIsPreviewOpen(true);
  }

  function handleOpenCreateAct() {
    setIsCreateActOpen(true);
  }

  function handleCloseCreateAct() {
    setIsCreateActOpen(false);
  }

  async function handleCreateActSubmit(payload: ReturnType<typeof mapFormToApiPayload>) {
    try {
      await createCompletionAct(payload).unwrap();
      setIsCreateActOpen(false);
      setPrompt({
        title: t("completionAct.messages.createSuccessTitle"),
        text: t("completionAct.messages.createSuccessText"),
        variant: "success",
      });
    } catch (err: unknown) {
      handleApiError(err, "completionAct.messages.createError");
    }
  }

  function handleActClick(actId: number) {
    setSelectedActId(actId);
  }

  function handleCloseActDetail() {
    setSelectedActId(null);
  }

  async function handleActUpload(id: number, file: File) {
    await actMutations.handleUpload(id, file);
  }

  async function handleActSubmit(id: number) {
    await actMutations.handleSubmit(id);
  }

  async function handleActApprove(id: number) {
    await actMutations.handleApprove(id);
  }

  function handleActReject(id: number) {
    actModals.openRejectModal(id);
  }

  async function handleConfirmReject(reason: string) {
    if (actModals.rejectModal) {
      await actMutations.handleReject(actModals.rejectModal.id, reason, () => {
        actModals.closeRejectModal();
      });
    }
  }

  async function handleActDelete(id: number) {
    await actMutations.handleDelete(id);
  }

  return (
    <>
      {isDownloadingPreview && (
        <Prompt
          loaderMode={true}
          loaderText={t("messages.waitingForDownload")}
          title=""
          text=""
          onClose={() => {}}
          namespace="LegalApplicationsPage"
        />
      )}

      {prompt && (
        <Prompt
          title={prompt.title}
          text={prompt.text}
          variant={prompt.variant || "success"}
          onClose={() => setPrompt(null)}
        />
      )}

      {actModals.prompt && (
        <Prompt
          title={actModals.prompt.title}
          text={actModals.prompt.text}
          variant={actModals.prompt.variant || "success"}
          onClose={() => actModals.setPrompt(null)}
        />
      )}

      {isDetailsOpen && (
        <ServiceContractDetailsModal
          document={document}
          completionActs={completionActs}
          onClose={handleCloseDetails}
          onPreviewContract={handleOpenPreviewFromDetails}
        />
      )}

      {isPreviewOpen && (
        <>
          {isLoadingDocumentData || !documentData ? (
            <ServiceContractPreviewModalSkeleton onClose={handleClosePreview} />
          ) : (
            <ServiceContractPreviewModal
              formData={mapFormToPreviewData(mapApiResponseToForm(documentData!), locale, cities)}
              onClose={handleClosePreview}
              hasBackground
              readOnly
            />
          )}
        </>
      )}

      {isConfirmDeleteOpen && (
        <PromptForm
          variant="error"
          title={t("messages.deleteConfirmTitle")}
          text={t("messages.deleteConfirmText")}
          confirmText={t("messages.delete")}
          cancelText={t("messages.cancel")}
          onConfirm={handleConfirmDelete}
          onClose={handleCancelDelete}
          isLoading={isDeleting}
          namespace="LegalApplicationsPage"
        />
      )}

      {isEditOpen && (
        <ModalForm icon={DocumentText1} onClose={handleCloseEdit} allowCloseInOverlay={false}>
          <ServiceContractForm editId={document.id} onSuccess={handleEditSuccess} />
        </ModalForm>
      )}

      {isCreateActOpen && (
        <CompletionActCreateModal
          parentContractId={document.id}
          serviceItems={document.service_items}
          onClose={handleCloseCreateAct}
          onSubmit={handleCreateActSubmit}
          isLoading={isCreatingAct}
          hasBackground={true}
        />
      )}

      {selectedActId !== null && (
        <CompletionActDetailModal
          id={selectedActId}
          onClose={handleCloseActDetail}
          onUpload={handleActUpload}
          onSubmit={handleActSubmit}
          onApprove={handleActApprove}
          onReject={handleActReject}
          onDelete={handleActDelete}
          isLoading={{
            isUploading: actMutations.isLoading.isUploading,
            isSubmitting: actMutations.isLoading.isSubmitting,
            isApproving: actMutations.isLoading.isApproving,
            isDeleting: actMutations.isLoading.isDeleting,
          }}
          hasBackground={true}
        />
      )}

      {actModals.rejectModal && (
        <CompletionActRejectModal
          onClose={actModals.closeRejectModal}
          onConfirm={handleConfirmReject}
          isLoading={actMutations.isLoading.isRejecting}
        />
      )}

      <div
        className={`flex flex-col justify-between gap-4 radius-lg border surface-base-stroke surface-base-fill p-5 relative ${
          canPreview ? "cursor-pointer hover:shadow-md transition-shadow duration-300" : ""
        }`}
        onClick={canPreview ? handlePreview : undefined}>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <TrustMeStatus trustmeStatus={document.trustme_status} locale={locale} />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-body-bold-lg content-base-primary">
              {tTemplates("templates.serviceContract.title")} №{document.id}
            </p>
          </div>

          <div className="flex flex-col gap-3 border-t border-b surface-base-stroke py-3">
            <div className="flex flex-col gap-1.5">
              <span className="text-body-bold-xs content-base-secondary">{t("cards.executor")}</span>
              <div className="flex items-center gap-1.5">
                <span className="content-action-brand">
                  <Profile size={16} color="currentColor" />
                </span>
                <p className="text-body-regular-sm content-base-primary">{document.executor_full_name}</p>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-body-bold-xs content-base-secondary">{t("cards.service")}</span>
              <div className="flex items-center gap-1.5">
                <span className="content-action-brand">
                  <Briefcase size={16} color="currentColor" />
                </span>
                <p className="text-body-regular-sm content-base-primary">{document.service_name}</p>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-body-bold-xs content-base-secondary">{t("cards.serviceLocation")}</span>
              <div className="flex items-center gap-1.5">
                <span className="content-action-brand">
                  <Location size={16} color="currentColor" />
                </span>
                <p className="text-body-regular-sm content-base-primary">{document.service_location}</p>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-body-bold-xs content-base-secondary">{t("cards.contractAmount")}</span>
              <div className="flex items-center gap-1.5">
                <span className="content-action-brand">
                  <TengeCircleIcon size={16} />
                </span>
                <p className="text-body-regular-sm content-base-primary">{formatPrice(document.contract_amount)} ₸</p>
              </div>
            </div>
          </div>

          {completionActs.length > 0 && (
            <div className="flex flex-col gap-1.5 border-b surface-base-stroke pb-3">
              <span className="text-body-bold-xs content-base-secondary">{t("cards.documents")}</span>
              <div className="flex flex-col gap-2">
                {completionActs.map((act) => (
                  <div
                    key={act.id}
                    className="flex items-center gap-1.5 cursor-pointer hover:background-base-subtle transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleActClick(act.id);
                    }}>
                    <span className="content-action-brand">
                      <DocumentText1 size={16} color="currentColor" />
                    </span>
                    <span className="flex-1 text-body-regular-sm content-base-primary">{act.display_number}</span>
                    <span className="content-action-neutral">
                      <ArrowRight2 size={16} color="currentColor" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5 border-b surface-base-stroke pb-3">
            <span className="text-body-bold-xs content-base-secondary">{t("cards.createdAt")}</span>
            <div className="flex items-center gap-1.5">
              <span className="content-action-brand">
                <Calendar size={16} color="currentColor" />
              </span>
              <span className="text-body-regular-sm content-base-primary">
                {formatDateForDisplay(document.created_at)}
              </span>
            </div>
          </div>
        </div>

        {canPreview && (
          <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
            {isDraft && (
              <Button
                variant="primary"
                size="md"
                className="w-full"
                disabled={isSubmitting}
                onClick={handleSubmitForSigning}>
                <DocumentText1 size={16} color="currentColor" />
                {isSubmitting ? t("cards.submitting") : t("cards.submitForSigning")}
              </Button>
            )}

            {canCreateAct && (
              <Button variant="primary" size="md" className="w-full" onClick={handleOpenCreateAct}>
                <DocumentText1 size={16} color="currentColor" />
                {t("completionAct.createAct")}
              </Button>
            )}

            {isDraft && (
              <Button
                variant="secondary"
                size="md"
                className="w-full"
                disabled={isDownloadingPreview}
                onClick={handleDownloadDraft}>
                <Import size={16} color="currentColor" />
                {isDownloadingPreview ? t("cards.downloading") : t("cards.downloadDraft")}
              </Button>
            )}

            {isSigned && canDownloadPDF && (
              <Dropdown open={isDownloadDropdownOpen} onClose={() => setIsDownloadDropdownOpen(false)} width="w-full">
                <Button
                  variant="secondary"
                  size="md"
                  className="w-full"
                  onClick={() => setIsDownloadDropdownOpen(!isDownloadDropdownOpen)}>
                  <div className="flex justify-between items-center w-full relative">
                    <div></div>
                    <div className="flex items-center gap-2">
                      <Import size={16} color="currentColor" />
                      <span className="flex-1 text-center">{t("cards.download")}</span>
                    </div>
                    <ArrowDown2
                      size={16}
                      color="currentColor"
                      className={`transition-transform ${isDownloadDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </div>
                </Button>
                <DropdownItem
                  className="justify-center"
                  onClick={() => {
                    if (!isDownloadingPreview) {
                      handleDownloadDraft();
                      setIsDownloadDropdownOpen(false);
                    }
                  }}>
                  {isDownloadingPreview ? t("cards.downloading") : t("cards.downloadDraft")}
                </DropdownItem>
                <DropdownItem
                  className="justify-center"
                  onClick={() => {
                    handleDownloadPDF();
                    setIsDownloadDropdownOpen(false);
                  }}>
                  {t("cards.downloadPDF")}
                </DropdownItem>
              </Dropdown>
            )}

            {isDraft && (
              <div className="absolute grid grid-cols-2 gap-2 top-5 right-5">
                <Button
                  variant="secondary"
                  size="md"
                  className="w-8! h-8! p-0! rounded-md!"
                  isIconButton
                  onClick={handleEdit}>
                  <Edit2 size={16} color="currentColor" />
                </Button>
                <Button
                  variant="danger"
                  size="md"
                  className="w-8! h-8! p-0! rounded-md!"
                  isIconButton
                  disabled={isDeleting}
                  onClick={handleDelete}>
                  <Trash size={16} color="currentColor" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

