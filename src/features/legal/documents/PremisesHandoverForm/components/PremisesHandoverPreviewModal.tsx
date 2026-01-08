import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DocumentText1, Send2, Import, ArrowUp2, Trash } from "iconsax-react";
import { ModalForm, Skeleton, Button, Dropdown, DropdownItem, Prompt, PromptForm } from "@/shared/ui";
import { useAppSelector } from "@/shared/hooks";
import { downloadBlob, formatDateForContract } from "@/shared/utils";
import { useGetAllLegalDocumentsQuery } from "../../../api";
import { TRUSTME_STATUS } from "../../../pages/consts";
import type { PremiseRentContract } from "../../PremiseRentForm/types";
import {
  useGetPremisesHandoverQuery,
  useSubmitPremisesHandoverForSigningMutation,
  useDownloadPremisesHandoverPreviewMutation,
  useDeletePremisesHandoverMutation,
} from "../api";
import { mapApiResponseToPreviewData } from "../utils";
import type { PremisesHandoverPreviewData } from "../types";

interface Props {
  id: number;
  onClose: () => void;
  hasBackground?: boolean;
  readOnly?: boolean;
}

export default function PremisesHandoverPreviewModal({ id, onClose, hasBackground = false, readOnly = false }: Props) {
  const { t, i18n } = useTranslation("LegalApplicationsPage");
  const locale = i18n.language === "kk" ? "kk" : "ru";
  const userData = useAppSelector((state) => state.auth.data?.user);
  const { data: handoverData, isLoading: isLoadingHandover } = useGetPremisesHandoverQuery(id);
  const { data: allDocuments, isLoading: isLoadingAll } = useGetAllLegalDocumentsQuery();

  const [isActionDropdownOpen, setIsActionDropdownOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [prompt, setPrompt] = useState<{ title: string; text: string; variant?: "success" | "error" } | null>(null);

  const [submitForSigning, { isLoading: isSubmitting }] = useSubmitPremisesHandoverForSigningMutation();
  const [downloadPreview, { isLoading: isDownloadingPreview }] = useDownloadPremisesHandoverPreviewMutation();
  const [deleteHandover, { isLoading: isDeleting }] = useDeletePremisesHandoverMutation();

  const isLoading = isLoadingHandover || isLoadingAll;

  const isDraft = handoverData?.trustme_status === TRUSTME_STATUS.DRAFT;
  const isSigned = handoverData?.trustme_status === TRUSTME_STATUS.SIGNED;
  const canDownloadPDF = isSigned && handoverData?.signed_pdf_url;

  const parentContract: PremiseRentContract | undefined = handoverData?.parent_contract
    ? allDocuments?.premises_leases.find((doc: PremiseRentContract) => doc.id === handoverData.parent_contract)
    : undefined;

  const previewData: PremisesHandoverPreviewData | null = handoverData
    ? mapApiResponseToPreviewData(handoverData, locale)
    : null;

  if (isLoading) {
    return (
      <ModalForm icon={DocumentText1} onClose={onClose} resize hasBackground={hasBackground}>
        <div className="flex flex-col justify-between h-full">
          <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke">
            <Skeleton height={24} width={200} />
          </div>
          <div className="flex-1 overflow-auto page-scroll pr-5 pt-5">
            <div className="flex flex-col gap-5">
              <Skeleton height={40} />
              <Skeleton height={20} count={3} />
              <Skeleton height={30} />
              <Skeleton height={20} count={5} />
            </div>
          </div>
        </div>
      </ModalForm>
    );
  }

  if (!handoverData || !parentContract || !previewData) {
    return null;
  }

  function handleApiError(err: unknown, defaultMessage: string, closeDropdown = false, closeConfirm = false) {
    const apiError = err as { data?: { error?: string; message?: string } };
    const errorMessage = apiError?.data?.error || apiError?.data?.message || defaultMessage;
    if (closeDropdown) setIsActionDropdownOpen(false);
    if (closeConfirm) setIsConfirmDeleteOpen(false);
    setPrompt({
      title: t("messages.errorTitle"),
      text: errorMessage,
      variant: "error",
    });
  }

  async function handleSubmitForSigning() {
    try {
      await submitForSigning(id).unwrap();
      setIsActionDropdownOpen(false);
      setPrompt({
        title: t("messages.submitSuccessTitle"),
        text: t("messages.submitSuccessText"),
        variant: "success",
      });
    } catch (err: unknown) {
      handleApiError(err, t("messages.submitFailed"), true);
    }
  }

  function handleDownloadPDF() {
    if (handoverData?.signed_pdf_url) {
      window.open(handoverData.signed_pdf_url, "_blank");
      setIsActionDropdownOpen(false);
    }
  }

  async function handleDownloadDraft() {
    try {
      const blob = await downloadPreview(id).unwrap();
      downloadBlob(blob, `Акт приема-передачи №${id}.docx`);
      setIsActionDropdownOpen(false);
    } catch (err: unknown) {
      handleApiError(err, t("messages.downloadFailed"), true);
    }
  }

  function handleDelete() {
    setIsActionDropdownOpen(false);
    setIsConfirmDeleteOpen(true);
  }

  async function handleConfirmDelete() {
    try {
      await deleteHandover(id).unwrap();
      setIsConfirmDeleteOpen(false);
      setPrompt({
        title: t("messages.deleteSuccessTitle"),
        text: t("messages.deleteSuccessText"),
        variant: "success",
      });
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: unknown) {
      handleApiError(err, t("messages.deleteFailed"), false, true);
    }
  }

  return (
    <ModalForm icon={DocumentText1} onClose={onClose} resize hasBackground={hasBackground}>
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke">
          <h4 className="text-display-2xs content-base-primary">Акт приема-передачи</h4>
        </div>

        <div className="flex-1 overflow-auto page-scroll pr-5 pt-5">
          <div className="flex flex-col text-body-regular-md content-base-primary">
            <div className="text-center mb-6">
              <p className="text-sm mb-2">к Договору аренды нежилого помещения</p>
              <p className="text-sm mb-4">№ {parentContract.id}</p>
              <h1 className="text-2xl font-bold mb-6">АКТ ПРИЕМА-ПЕРЕДАЧИ</h1>
              <div className="flex justify-between text-sm mt-4">
                <span>
                  г.{" "}
                  <strong>
                    {parentContract.contract_city
                      ? typeof parentContract.contract_city === "object"
                        ? locale === "kk"
                          ? parentContract.contract_city.name_kk
                          : parentContract.contract_city.name_ru
                        : parentContract.contract_city
                      : "_____________"}
                  </strong>
                </span>
                <strong>{formatDateForContract(previewData.act_date)}</strong>
              </div>
            </div>

            <div className="mb-6 text-justify">
              <p className="mb-2">
                <strong>
                  {parentContract.commercial_org?.name_ru || parentContract.commercial_org?.name_kk || "_____________"}
                </strong>
                , именуемое в дальнейшем «Арендодатель», в лице{" "}
                <strong>{parentContract.commercial_org?.representative || "_____________"}</strong>, действующего на
                основании <strong>{parentContract.commercial_org?.basis || "_____________"}</strong>, с одной стороны, и{" "}
                <strong>{userData?.organization || "_____________"}</strong>, именуемое в дальнейшем «Арендатор», в лице{" "}
                <strong>{userData?.full_name || "_____________"}</strong>, действующего на основании Устава, совместно
                именуемые – Стороны, а по отдельности – Сторона, составили и подписали настоящий Акт приема-передачи
                помещения (далее – Акт) о нижеследующем:
              </p>

              <p className="mb-4 mt-4">
                1. Арендодатель передал, а Арендатор принял во временное возмездное владение и пользование нежилое
                помещение общей арендной площадью <strong>{parentContract.premise_area || "_____________"}</strong>{" "}
                кв.м., расположенное по адресу: <strong>{parentContract.premise_address || "_____________"}</strong>{" "}
                (далее – Помещение).
              </p>

              <p className="mb-4">
                2. Подписывая настоящий Акт, Стороны подтверждают, что Помещение передано в надлежащем виде, в указанном
                количестве, ассортименте, комплектности, качестве.
              </p>

              <p className="mb-4">
                3. Акт является неотъемлемой частью Договора и составлен в двух подлинных экземплярах, тексты которых
                имеют одинаковую юридическую силу: один из которых находится у Арендодателя, второй – у Арендатора.
              </p>
            </div>

            <div className="mt-8">
              <p className="mb-4 font-bold text-center">ПОДПИСИ СТОРОН</p>
              <div className="flex justify-between mt-8">
                <div className="text-left">
                  <p className="mb-2 font-bold">Арендодатель:</p>
                  <div className="border-t border-black mt-4 mb-2 w-48"></div>
                  <p className="mb-1">
                    <strong>{parentContract.commercial_org?.representative || "_____________"}</strong>
                  </p>
                  <p className="text-sm mt-2">М.П.</p>
                </div>
                <div className="text-right">
                  <p className="mb-2 font-bold">Арендатор:</p>
                  <div className="border-t border-black mt-4 mb-2 ml-auto w-48"></div>
                  <p className="mb-1">
                    <strong>{userData?.full_name || "_____________"}</strong>
                  </p>
                  <p className="text-sm mt-2">М.П.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[2fr_3fr] p-1 gap-2">
          <Button variant="secondary" size="lg" onClick={onClose}>
            {t("modals.cancel")}
          </Button>

          {!readOnly && (isDraft || canDownloadPDF) && (
            <Dropdown
              open={isActionDropdownOpen}
              onClose={() => setIsActionDropdownOpen(false)}
              align="right"
              direction="top"
              className="p-2">
              <Button
                variant="secondary"
                size="lg"
                disabled={isSubmitting || isDownloadingPreview || isDeleting}
                onClick={() => setIsActionDropdownOpen(!isActionDropdownOpen)}
                className="w-full">
                <div className="flex items-center gap-2">
                  <span>{t("cards.documentPrefix")}</span>
                  <ArrowUp2
                    size={16}
                    color="currentColor"
                    className={`transition-transform ${isActionDropdownOpen ? "rotate-180" : ""}`}
                  />
                </div>
              </Button>

              {isDraft && (
                <DropdownItem
                  onClick={handleSubmitForSigning}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 p-0! mb-1.5!">
                  <Button variant="primary" size="md" className="w-full">
                    <Send2 size={16} color="currentColor" />
                    {isSubmitting ? t("cards.submitting") : t("cards.submitForSigning")}
                  </Button>
                </DropdownItem>
              )}

              {isDraft && (
                <DropdownItem
                  onClick={handleDownloadDraft}
                  disabled={isDownloadingPreview}
                  className="flex items-center gap-2 p-0! mb-1.5!">
                  <Button variant="secondary" size="md" className="w-full">
                    <Import size={16} color="currentColor" />
                    {isDownloadingPreview ? t("cards.downloading") : t("cards.downloadDraft")}
                  </Button>
                </DropdownItem>
              )}

              {canDownloadPDF && (
                <DropdownItem onClick={handleDownloadPDF} className="flex items-center gap-2 p-0! mb-1.5!">
                  <Button variant="secondary" size="md" className="w-full">
                    <Import size={16} color="currentColor" />
                    {t("cards.downloadPDF")}
                  </Button>
                </DropdownItem>
              )}

              {isDraft && (
                <DropdownItem onClick={handleDelete} disabled={isDeleting} className="flex items-center gap-2 p-0!">
                  <Button variant="danger" size="md" className="w-full">
                    <Trash size={16} color="currentColor" />
                    {t("cards.delete")}
                  </Button>
                </DropdownItem>
              )}
            </Dropdown>
          )}
        </div>
      </div>

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

      {isConfirmDeleteOpen && (
        <PromptForm
          variant="error"
          title={t("messages.deleteConfirmTitle")}
          text={t("messages.deleteConfirmText")}
          confirmText={t("messages.delete")}
          cancelText={t("messages.cancel")}
          onConfirm={handleConfirmDelete}
          onClose={() => setIsConfirmDeleteOpen(false)}
          isLoading={isDeleting}
          namespace="LegalApplicationsPage"
        />
      )}
    </ModalForm>
  );
}
