import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Edit2,
  DocumentText1,
  Import,
  Trash,
  Car,
  Buildings2,
  Calendar,
  ArrowDown2,
  ArrowRight2,
} from "iconsax-react";
import { Button, Prompt, ModalForm, PromptForm, DatePicker, Dropdown, DropdownItem, ModalWrapper } from "@/shared/ui";
import { useApiErrorHandler } from "@/shared/hooks";
import { TrustMeStatus } from "@/shared/components";
import { formatDateForDisplay, formatPrice, formatDateToISO, downloadBlob } from "@/shared/utils";
import { TengeCircleIcon } from "@/shared/assets/icons";
import type { Locale } from "@/shared/utils/types";
import { useGetCitiesQuery } from "@/shared/api/common";
import { useGetAllLegalDocumentsQuery } from "@/features/legal/api";
import { useCreateVehicleHandoverMutation, VehicleHandoverPreviewModal } from "../../VehicleHandoverForm";
import { TRUSTME_STATUS } from "../../../pages/consts";
import {
  useSubmitVehicleRentForSigningMutation,
  useDownloadVehicleRentPreviewMutation,
  useGetVehicleRentQuery,
  useDeleteVehicleRentMutation,
} from "../api";
import type { VehicleRentContract, VehicleRentPreviewData } from "../types";
import { mapApiResponseToForm, mapFormToPreviewData, getVehicleRentActions } from "../utils";
import { VehicleRentPreviewModal, VehicleRentPreviewModalSkeleton, VehicleRentForm, VehicleRentDetailsModal } from "./";

interface Props {
  document: VehicleRentContract;
  actsCount?: number;
}

export default function VehicleRentCard({ document, actsCount }: Props) {
  const { t, i18n } = useTranslation("LegalApplicationsPage");
  const { t: tTemplates } = useTranslation("LegalTemplatesPage");
  const locale = (i18n.language as Locale) || "ru";
  const currentLocale = i18n.language === "kk" ? "kk" : "ru";
  const { data: cities = [] } = useGetCitiesQuery();

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCreateActOpen, setIsCreateActOpen] = useState(false);
  const [isConfirmActOpen, setIsConfirmActOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isDownloadDropdownOpen, setIsDownloadDropdownOpen] = useState(false);
  const [selectedHandoverId, setSelectedHandoverId] = useState<number | null>(null);
  const [actDate, setActDate] = useState<Date | null>(null);
  const [prompt, setPrompt] = useState<{ title: string; text: string; variant?: "success" | "error" } | null>(null);

  const [submitForSigning, { isLoading: isSubmitting }] = useSubmitVehicleRentForSigningMutation();
  const [downloadPreview, { isLoading: isDownloadingPreview }] = useDownloadVehicleRentPreviewMutation();
  const [createVehicleHandover, { isLoading: isCreatingAct }] = useCreateVehicleHandoverMutation();
  const [deleteVehicleRent, { isLoading: isDeleting }] = useDeleteVehicleRentMutation();
  const { data: documentData, isLoading: isLoadingDocumentData } = useGetVehicleRentQuery(document.id, {
    skip: !isPreviewOpen && !isEditOpen,
  });
  const { data: allDocuments, isLoading: isLoadingAllDocuments } = useGetAllLegalDocumentsQuery();

  const handovers = allDocuments?.vehicle_handovers.filter((act) => act.parent_contract === document.id) || [];

  const actions = getVehicleRentActions(document, TRUSTME_STATUS.DRAFT, TRUSTME_STATUS.SIGNED);

  const { handleApiError } = useApiErrorHandler({ namespace: "LegalApplicationsPage", setPrompt });

  function handlePreview() {
    if (actsCount !== undefined && actsCount >= 1) {
      if (!isLoadingAllDocuments) {
        setIsDetailsOpen(true);
      }
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
      downloadBlob(blob, `Договор аренды транспортного средства №${document.id}.docx`);
    } catch (err: unknown) {
      handleApiError(err, "messages.downloadFailed");
    }
  }

  function handleCreateAct() {
    if (actsCount !== undefined && actsCount >= 1) {
      setIsConfirmActOpen(true);
    } else {
      setIsCreateActOpen(true);
    }
  }

  function handleConfirmCreateActPrompt() {
    setIsConfirmActOpen(false);
    setIsCreateActOpen(true);
  }

  function handleCancelCreateActPrompt() {
    setIsConfirmActOpen(false);
  }

  function handleCloseCreateAct() {
    setIsCreateActOpen(false);
    setActDate(null);
  }

  async function handleConfirmCreateAct() {
    if (!actDate) {
      setPrompt({
        title: t("messages.errorTitle"),
        text: t("messages.selectActDate"),
        variant: "error",
      });
      return;
    }

    try {
      await createVehicleHandover({
        parent_contract: document.id,
        act_date: formatDateToISO(actDate),
      }).unwrap();
      handleCloseCreateAct();
      setPrompt({
        title: t("messages.createActSuccessTitle"),
        text: t("messages.createActSuccessText"),
        variant: "success",
      });
    } catch (err: unknown) {
      handleApiError(err, "messages.createActFailed");
    }
  }

  function convertToPreviewData(doc: VehicleRentContract): VehicleRentPreviewData {
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
      await deleteVehicleRent(document.id).unwrap();
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

  function handleHandoverClick(handoverId: number) {
    setSelectedHandoverId(handoverId);
  }

  function handleCloseHandoverPreview() {
    setSelectedHandoverId(null);
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

      {isDetailsOpen && (
        <VehicleRentDetailsModal document={document} handovers={handovers} onClose={handleCloseDetails} />
      )}

      {selectedHandoverId !== null && (
        <VehicleHandoverPreviewModal
          id={selectedHandoverId}
          onClose={handleCloseHandoverPreview}
          hasBackground
          readOnly
        />
      )}

      {isPreviewOpen && (
        <>
          {isLoadingDocumentData || !documentData ? (
            <VehicleRentPreviewModalSkeleton onClose={handleClosePreview} />
          ) : (
            <VehicleRentPreviewModal
              formData={convertToPreviewData(documentData)}
              onClose={handleClosePreview}
              hasBackground
              readOnly
              commercialOrg={documentData.commercial_org}
              handovers={handovers}
              actsCount={actsCount}
            />
          )}
        </>
      )}

      {isEditOpen && (
        <ModalForm icon={DocumentText1} onClose={handleCloseEdit} allowCloseInOverlay={false}>
          <VehicleRentForm editId={document.id} onSuccess={handleEditSuccess} />
        </ModalForm>
      )}

      {isConfirmActOpen && (
        <PromptForm
          variant="warning"
          title={t("messages.actExistsTitle")}
          text={t("messages.actExistsText")}
          confirmText={t("messages.confirm")}
          cancelText={t("messages.cancel")}
          onConfirm={handleConfirmCreateActPrompt}
          onClose={handleCancelCreateActPrompt}
          namespace="LegalApplicationsPage"
        />
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

      {isCreateActOpen && (
        <ModalWrapper onClose={handleCloseCreateAct}>
          <div className="flex flex-col gap-4">
            <h3 className="text-heading-lg content-base-primary">{t("modals.createActTitle")}</h3>
            <DatePicker
              label={t("modals.actDate")}
              value={actDate}
              onChange={(date) => setActDate(date as Date | null)}
              placeholder={t("modals.selectDate")}
              mode="single"
              locale={locale}
            />
            <div className="flex gap-2">
              <Button variant="secondary" size="lg" className="flex-1" onClick={handleCloseCreateAct}>
                {t("modals.cancel")}
              </Button>
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                disabled={isCreatingAct}
                onClick={handleConfirmCreateAct}>
                {isCreatingAct ? t("modals.creating") : t("modals.create")}
              </Button>
            </div>
          </div>
        </ModalWrapper>
      )}

      <div
        className={`flex flex-col justify-between gap-4 radius-lg border surface-base-stroke surface-base-fill p-5 relative ${
          actions.canPreview ? "cursor-pointer hover:shadow-md transition-shadow duration-300" : ""
        }`}
        onClick={actions.canPreview ? handlePreview : undefined}>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <TrustMeStatus trustmeStatus={document.trustme_status} locale={locale} />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-body-bold-lg content-base-primary">
              {tTemplates("templates.vehicleRent.title")} №{document.id}
            </p>
          </div>

          <div className="flex flex-col gap-3 border-t border-b surface-base-stroke py-3">
            <div className="flex flex-col gap-1.5">
              <span className="text-body-bold-xs content-base-secondary">{t("cards.vehicleInfo")}</span>
              <div className="flex items-center gap-1.5">
                <span className="content-action-brand">
                  <Car size={16} color="currentColor" />
                </span>
                <p className="text-body-regular-sm content-base-primary">
                  {document.car_brand} ({document.car_year}) {t("cards.withPlateNumber")} {document.car_plate}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-body-bold-xs content-base-secondary">{t("cards.lessor")}</span>
              <div className="flex items-center gap-1.5">
                <span className="content-action-brand">
                  <Buildings2 size={16} color="currentColor" />
                </span>
                <p className="text-body-regular-sm content-base-primary">
                  {document.commercial_org
                    ? locale === "kk"
                      ? document.commercial_org.name_kk || document.commercial_org.name_ru
                      : document.commercial_org.name_ru || document.commercial_org.name_kk
                    : ""}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-body-bold-xs content-base-secondary">{t("cards.rentalAmount")}</span>
              <div className="flex items-center gap-1.5">
                <span className="content-action-brand">
                  <TengeCircleIcon size={16} />
                </span>
                <p className="text-body-regular-sm content-base-primary">{formatPrice(document.rental_amount)} ₸</p>
              </div>
            </div>
          </div>

          {handovers.length > 0 && (
            <div className="flex flex-col gap-1.5 border-b surface-base-stroke pb-3">
              <span className="text-body-bold-xs content-base-secondary">{t("cards.documents")}</span>
              <div className="flex flex-col gap-2">
                {handovers.map((handover) => (
                  <div
                    key={handover.id}
                    className="flex items-center gap-1.5 cursor-pointer hover:background-base-subtle transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleHandoverClick(handover.id);
                    }}>
                    <span className="content-action-brand">
                      <DocumentText1 size={16} color="currentColor" />
                    </span>
                    <span className="flex-1 text-body-regular-sm content-base-primary">
                      {t("cards.handoverActPrefix")} №{handover.id}
                    </span>
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

        {actions.canPreview && (
          <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
            {actions.canSubmitForSigning && (
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

            {actions.canCreateAct && (
              <Button variant="primary" size="md" className="w-full" disabled={isCreatingAct} onClick={handleCreateAct}>
                <DocumentText1 size={16} color="currentColor" />
                {isCreatingAct ? t("cards.creating") : t("cards.createAct")}
              </Button>
            )}

            {actions.canDownloadDraft && !actions.canDownloadPDF && (
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

            {actions.canDownloadPDF && (
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

            {actions.canEdit && (
              <div className="absolute grid grid-cols-2 gap-2 top-5 right-5">
                <Button
                  variant="secondary"
                  size="md"
                  className="w-8! h-8! p-0! rounded-md!"
                  isIconButton
                  onClick={handleEdit}>
                  <Edit2 size={16} color="currentColor" />
                </Button>
                {actions.canDelete && (
                  <Button
                    variant="danger"
                    size="md"
                    className="w-8! h-8! p-0! rounded-md!"
                    isIconButton
                    disabled={isDeleting}
                    onClick={handleDelete}>
                    <Trash size={16} color="currentColor" />
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
