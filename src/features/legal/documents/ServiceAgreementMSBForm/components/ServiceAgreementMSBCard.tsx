import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Edit2, Import, Trash, DocumentText1, Calendar, Buildings2, ArrowDown2 } from "iconsax-react";
import { Button, ModalForm, Prompt, PromptForm, Dropdown, DropdownItem } from "@/shared/ui";
import { useApiErrorHandler } from "@/shared/hooks";
import { TrustMeStatus } from "@/shared/components";
import { formatDateForDisplay, formatPrice, downloadBlob } from "@/shared/utils";
import { TengeCircleIcon } from "@/shared/assets/icons";
import type { Locale } from "@/shared/utils/types";
import { useGetCitiesQuery } from "@/shared/api/common";
import { TRUSTME_STATUS } from "../../../pages/consts";
import type { ServiceAgreementMSBContract, ServiceAgreementMSBPreviewData } from "../types";
import {
  useSubmitServiceAgreementMSBForSigningMutation,
  useDownloadServiceAgreementMSBPreviewMutation,
  useGetServiceAgreementMSBQuery,
  useDeleteServiceAgreementMSBMutation,
} from "../api";
import { mapApiResponseToForm, mapFormToPreviewData } from "../utils";
import ServiceAgreementMSBPreviewModal from "./ServiceAgreementMSBPreviewModal";
import ServiceAgreementMSBPreviewModalSkeleton from "./ServiceAgreementMSBPreviewModalSkeleton";
import ServiceAgreementMSBForm from "./ServiceAgreementMSBForm";

interface Props {
  document: ServiceAgreementMSBContract;
}

export default function ServiceAgreementMSBCard({ document }: Props) {
  const { t, i18n } = useTranslation("LegalApplicationsPage");
  const { t: tTemplates } = useTranslation("LegalTemplatesPage");
  const locale = (i18n.language as Locale) || "ru";
  const currentLocale = i18n.language === "kk" ? "kk" : "ru";
  const { data: cities = [] } = useGetCitiesQuery();

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isDownloadDropdownOpen, setIsDownloadDropdownOpen] = useState(false);
  const [prompt, setPrompt] = useState<{ title: string; text: string; variant?: "success" | "error" } | null>(null);

  const [submitForSigning, { isLoading: isSubmitting }] = useSubmitServiceAgreementMSBForSigningMutation();
  const [downloadPreview, { isLoading: isDownloadingPreview }] = useDownloadServiceAgreementMSBPreviewMutation();
  const [deleteServiceAgreementMSB, { isLoading: isDeleting }] = useDeleteServiceAgreementMSBMutation();
  const { data: documentData, isLoading: isLoadingDocumentData } = useGetServiceAgreementMSBQuery(document.id, {
    skip: !isPreviewOpen && !isEditOpen,
  });

  const isDraft = document.trustme_status === TRUSTME_STATUS.DRAFT;
  const isSigned = document.trustme_status === TRUSTME_STATUS.SIGNED;
  const canPreview = isDraft || isSigned;
  const canDownloadPDF = document.trustme_status === TRUSTME_STATUS.SIGNED && document.signed_pdf_url;

  const { handleApiError } = useApiErrorHandler({ namespace: "LegalApplicationsPage", setPrompt });

  function handlePreview() {
    setIsPreviewOpen(true);
  }

  function handleEdit() {
    setIsEditOpen(true);
  }

  function handleClosePreview() {
    setIsPreviewOpen(false);
  }

  function handleCloseEdit() {
    setIsEditOpen(false);
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
      downloadBlob(blob, `Договор на оказание услуг №${document.id}.docx`);
    } catch (err: unknown) {
      handleApiError(err, "messages.downloadFailed");
    }
  }

  function convertToPreviewData(doc: ServiceAgreementMSBContract): ServiceAgreementMSBPreviewData {
    const formValues = mapApiResponseToForm(doc);
    return mapFormToPreviewData(formValues, currentLocale, cities);
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
      await deleteServiceAgreementMSB(document.id).unwrap();
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

      {isPreviewOpen && (
        <>
          {isLoadingDocumentData || !documentData ? (
            <ServiceAgreementMSBPreviewModalSkeleton onClose={handleClosePreview} />
          ) : (
            <ServiceAgreementMSBPreviewModal
              formData={convertToPreviewData(documentData)}
              onClose={handleClosePreview}
              hasBackground
              readOnly
              commercialOrg={documentData.commercial_org}
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
          <ServiceAgreementMSBForm editId={document.id} onSuccess={handleEditSuccess} />
        </ModalForm>
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
              {tTemplates("templates.paidService.title")} №{document.id}
            </p>
          </div>

          <div className="flex flex-col gap-3 border-t border-b surface-base-stroke py-3">
            <div className="flex flex-col gap-1.5">
              <span className="text-body-bold-xs content-base-secondary">{t("cards.executor")}</span>
              <div className="flex items-center gap-1.5">
                <span className="content-action-brand">
                  <Buildings2 size={16} color="currentColor" />
                </span>
                <div className="flex flex-col">
                  <p className="text-body-regular-sm content-base-primary">
                    {document.commercial_org
                      ? locale === "kk"
                        ? document.commercial_org.name_kk || document.commercial_org.name_ru
                        : document.commercial_org.name_ru || document.commercial_org.name_kk
                      : "—"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-body-bold-xs content-base-secondary">{t("cards.servicesDescription")}</span>
              <div className="flex items-center gap-1.5">
                <span className="content-action-brand">
                  <DocumentText1 size={16} color="currentColor" />
                </span>
                <p className="text-body-regular-sm content-base-primary">{document.services_description || "—"}</p>
              </div>
            </div>

            {document.service_start_date && document.service_end_date && (
              <div className="flex flex-col gap-1.5">
                <span className="text-body-bold-xs content-base-secondary">{t("cards.servicePeriod")}</span>
                <div className="flex items-center gap-1.5">
                  <span className="content-action-brand">
                    <Calendar size={16} color="currentColor" />
                  </span>
                  <p className="text-body-regular-sm content-base-primary">
                    {formatDateForDisplay(document.service_start_date, false)} —{" "}
                    {formatDateForDisplay(document.service_end_date, false)}
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <span className="text-body-bold-xs content-base-secondary">{t("cards.contractAmount")}</span>
              <div className="flex items-center gap-1.5">
                <span className="content-action-brand">
                  <TengeCircleIcon size={16} />
                </span>
                <p className="text-body-regular-sm content-base-primary">
                  {document.contract_amount ? formatPrice(Number(document.contract_amount)) : "—"} ₸
                </p>
              </div>
            </div>
          </div>

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
