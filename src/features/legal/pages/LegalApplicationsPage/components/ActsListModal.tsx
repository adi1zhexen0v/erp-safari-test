import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DocumentText1, ArrowRight2 } from "iconsax-react";
import { ModalForm, Button, DatePicker, Prompt, PromptForm } from "@/shared/ui";
import { LegalDocumentType } from "@/features/legal/types/documentTypes";
import { useGetAllLegalDocumentsQuery } from "@/features/legal/api";
import { VehicleHandoverPreviewModal , useCreateVehicleHandoverMutation } from "@/features/legal/documents/VehicleHandoverForm";
import {
  PremisesHandoverPreviewModal,
  useCreatePremisesHandoverMutation,
} from "@/features/legal/documents/PremisesHandoverForm";
import { formatDateToISO, convertFromContractFormat } from "@/shared/utils";
import type { Locale } from "@/shared/utils/types";
import ModalWrapper from "@/shared/ui/ModalWrapper";

interface Props {
  contractId: number;
  contractType: LegalDocumentType;
  onClose: () => void;
  onPreviewContract: () => void;
}

export default function ActsListModal({ contractId, contractType, onClose, onPreviewContract }: Props) {
  const { t, i18n } = useTranslation("LegalApplicationsPage");
  const locale = (i18n.language as Locale) || "ru";

  const [isCreateActOpen, setIsCreateActOpen] = useState(false);
  const [isConfirmActOpen, setIsConfirmActOpen] = useState(false);
  const [actDate, setActDate] = useState<Date | null>(null);
  const [prompt, setPrompt] = useState<{ title: string; text: string; variant?: "success" | "error" } | null>(null);
  const [selectedHandoverId, setSelectedHandoverId] = useState<number | null>(null);

  const { data: allDocuments, isLoading } = useGetAllLegalDocumentsQuery();
  const [createVehicleHandover, { isLoading: isCreatingVehicleAct }] = useCreateVehicleHandoverMutation();
  const [createPremisesHandover, { isLoading: isCreatingPremisesAct }] = useCreatePremisesHandoverMutation();

  const isVehicleRental = contractType === LegalDocumentType.VEHICLE_RENTAL;
  const isCreatingAct = isCreatingVehicleAct || isCreatingPremisesAct;

  const acts = isLoading
    ? []
    : isVehicleRental
      ? allDocuments?.vehicle_handovers.filter((act) => act.parent_contract === contractId) || []
      : allDocuments?.premises_handovers.filter((act) => act.parent_contract === contractId) || [];

  const handleConfirmCreateActPrompt = () => {
    setIsConfirmActOpen(false);
    setIsCreateActOpen(true);
  };

  const handleCancelCreateActPrompt = () => {
    setIsConfirmActOpen(false);
  };

  const handleCloseCreateAct = () => {
    setIsCreateActOpen(false);
    setActDate(null);
  };

  const handleConfirmCreateAct = async () => {
    if (!actDate) {
      setPrompt({
        title: t("messages.errorTitle"),
        text: t("messages.selectActDate"),
        variant: "error",
      });
      return;
    }

    try {
      if (isVehicleRental) {
        await createVehicleHandover({
          parent_contract: contractId,
          act_date: formatDateToISO(actDate),
        }).unwrap();
      } else {
        await createPremisesHandover({
          parent_contract: contractId,
          act_date: formatDateToISO(actDate),
        }).unwrap();
      }
      handleCloseCreateAct();
      setPrompt({
        title: t("messages.createActSuccessTitle"),
        text: t("messages.createActSuccessText"),
        variant: "success",
      });
    } catch (err: unknown) {
      const apiError = err as { data?: { error?: string; message?: string } };
      const errorMessage = apiError?.data?.error || apiError?.data?.message || t("messages.createActFailed");
      setPrompt({
        title: t("messages.errorTitle"),
        text: errorMessage,
        variant: "error",
      });
    }
  };

  return (
    <>
      {prompt && (
        <Prompt
          title={prompt.title}
          text={prompt.text}
          variant={prompt.variant || "success"}
          onClose={() => setPrompt(null)}
        />
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

      <ModalForm icon={DocumentText1} onClose={onClose} resize={false} allowCloseInOverlay={false}>
        <div className="flex flex-col gap-6 h-full">
          <div className="flex-1 overflow-auto">
            <div className="flex flex-col gap-2">
              {acts.map((act) => (
                <div
                  key={act.id}
                  className="flex items-center gap-1.5 p-2 radius-sm border surface-base-stroke cursor-pointer hover:background-base-subtle transition-colors"
                  onClick={() => setSelectedHandoverId(act.id)}>
                  <span className="content-action-brand">
                    <DocumentText1 size={16} color="currentColor" />
                  </span>
                  <div className="flex-1 flex flex-col gap-0.5">
                    <span className="text-body-regular-sm content-base-primary">
                      {t("cards.handoverActPrefix")} №{act.id}
                    </span>
                    <span className="text-body-regular-xs content-base-secondary">
                      {convertFromContractFormat(act.act_date) || act.act_date}
                    </span>
                  </div>
                  <span className="content-action-neutral">
                    <ArrowRight2 size={16} color="currentColor" />
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pb-0.5 pl-0.5">
            <Button variant="secondary" size="lg" className="flex-1" onClick={onClose}>
              {t("modals.cancel")}
            </Button>
            <Button variant="secondary" size="lg" className="flex-1" onClick={onPreviewContract}>
              {t("cards.previewContract")}
            </Button>
          </div>
        </div>
      </ModalForm>

      {selectedHandoverId !== null && (
        <>
          {isVehicleRental ? (
            <VehicleHandoverPreviewModal
              id={selectedHandoverId}
              onClose={() => setSelectedHandoverId(null)}
              hasBackground
            />
          ) : (
            <PremisesHandoverPreviewModal
              id={selectedHandoverId}
              onClose={() => setSelectedHandoverId(null)}
              hasBackground
            />
          )}
        </>
      )}
    </>
  );
}
