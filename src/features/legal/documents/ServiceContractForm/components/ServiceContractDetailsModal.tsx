import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DocumentText1, Profile, Briefcase, Location, Add } from "iconsax-react";
import cn from "classnames";
import { ModalForm, Button, Prompt } from "@/shared/ui";
import { TrustMeStatus } from "@/shared/components";
import { formatPrice } from "@/shared/utils";
import { TengeCircleIcon } from "@/shared/assets/icons";
import type { Locale } from "@/shared/utils/types";
import {
  CompletionActListItem,
  CompletionActCreateModal,
  CompletionActDetailModal,
  CompletionActRejectModal,
  useCompletionActModals,
  useCompletionActMutations,
  mapFormToApiPayload,
} from "../../CompletionActForm";
import type { CompletionActListItem as CompletionActListItemType } from "../../CompletionActForm/types";
import type { ServiceContractContract } from "../types";

interface Props {
  document: ServiceContractContract;
  completionActs: CompletionActListItemType[];
  onClose: () => void;
  onPreviewContract: () => void;
}

export default function ServiceContractDetailsModal({ document, completionActs, onClose, onPreviewContract }: Props) {
  const { t, i18n } = useTranslation("LegalApplicationsPage");
  const { t: tTemplates } = useTranslation("LegalTemplatesPage");
  const locale = (i18n.language as Locale) || "ru";

  const modals = useCompletionActModals();
  const mutations = useCompletionActMutations(modals.setPrompt);

  const [selectedActId, setSelectedActId] = useState<number | null>(null);

  function handleCreateAct() {
    modals.openCreateModal(document.id);
  }

  function handleActClick(actId: number) {
    setSelectedActId(actId);
  }

  function handleCloseActDetail() {
    setSelectedActId(null);
  }

  async function handleCreateSubmit(payload: ReturnType<typeof mapFormToApiPayload>) {
    await mutations.handleCreate(payload, () => {
      modals.closeCreateModal();
    });
  }

  async function handleUpload(id: number, file: File) {
    await mutations.handleUpload(id, file);
  }

  async function handleSubmit(id: number) {
    await mutations.handleSubmit(id);
  }

  async function handleApprove(id: number) {
    await mutations.handleApprove(id);
  }

  function handleReject(id: number) {
    modals.openRejectModal(id);
  }

  async function handleConfirmReject(reason: string) {
    if (modals.rejectModal) {
      await mutations.handleReject(modals.rejectModal.id, reason, () => {
        modals.closeRejectModal();
      });
    }
  }

  async function handleDelete(id: number) {
    await mutations.handleDelete(id);
  }

  const infoFields = [
    {
      key: "executor",
      label: t("cards.executor"),
      value: document.executor_full_name,
      icon: Profile,
    },
    {
      key: "service",
      label: t("cards.service"),
      value: document.service_name,
      icon: Briefcase,
    },
    {
      key: "serviceLocation",
      label: t("cards.serviceLocation"),
      value: document.service_location,
      icon: Location,
    },
    {
      key: "contractAmount",
      label: t("cards.contractAmount"),
      value: `${formatPrice(document.contract_amount)} ₸`,
      icon: TengeCircleIcon,
    },
  ];

  return (
    <>
      {modals.prompt && (
        <Prompt
          title={modals.prompt.title}
          text={modals.prompt.text}
          variant={modals.prompt.variant || "success"}
          onClose={() => modals.setPrompt(null)}
        />
      )}

      <ModalForm icon={DocumentText1} onClose={onClose} resize={false} allowCloseInOverlay={false}>
        <div className="flex flex-col gap-6 h-full min-h-0">
          <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke shrink-0">
            <h4 className="text-display-2xs content-base-primary">{t("cards.previewContract")}</h4>
          </div>

          <div className="flex-1 overflow-auto min-h-0">
            <div className="flex flex-col py-4">
              <div className="flex flex-col gap-2 mb-4 border-b surface-base-stroke pb-3">
                <p className="text-body-bold-lg content-base-primary">
                  {tTemplates("templates.serviceContract.title")} №{document.id}
                </p>
                <TrustMeStatus trustmeStatus={document.trustme_status} locale={locale} />
              </div>

              <div className="flex flex-col">
                {infoFields
                  .filter((field) => field.value)
                  .map((field, index, array) => (
                    <div
                      key={field.key}
                      className={cn(
                        "flex items-center gap-3",
                        index === 0 ? "pt-0 pb-3" : index === array.length - 1 ? "pt-3 pb-0" : "py-3",
                        index < array.length - 1 && "border-b surface-base-stroke",
                      )}>
                      <span className="content-action-brand">
                        {field.icon === TengeCircleIcon ? (
                          <TengeCircleIcon size={16} />
                        ) : (
                          <field.icon size={16} color="currentColor" />
                        )}
                      </span>
                      <span className="text-body-regular-md content-base-secondary flex-1 min-w-[132px]">
                        {field.label}
                      </span>
                      <p className="text-body-bold-md content-base-primary text-right">{field.value}</p>
                    </div>
                  ))}
              </div>

              <div className="flex flex-col gap-2 mt-3 pt-4 border-t surface-base-stroke">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-body-bold-lg content-base-primary">{t("completionAct.listTitle")}</span>
                  <Button variant="tertiary" size="lg" className="gap-1!" onClick={handleCreateAct}>
                    <Add size={16} color="currentColor" />
                    {t("completionAct.createAct")}
                  </Button>
                </div>

                {completionActs.length === 0 ? (
                  <p className="text-body-regular-sm content-base-tertiary py-4 text-center">
                    {t("completionAct.noActs")}
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {completionActs.map((act) => (
                      <CompletionActListItem key={act.id} act={act} onClick={() => handleActClick(act.id)} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[2fr_3fr] p-1 gap-2">
            <Button variant="secondary" size="lg" className="flex-1" onClick={onClose}>
              {t("modals.cancel")}
            </Button>
            <Button variant="secondary" size="lg" className="flex-1" onClick={onPreviewContract}>
              {t("cards.previewContract")}
            </Button>
          </div>
        </div>
      </ModalForm>

      {modals.createModal && (
        <CompletionActCreateModal
          parentContractId={modals.createModal.parentContractId}
          serviceItems={document.service_items}
          existingActs={completionActs}
          onClose={modals.closeCreateModal}
          onSubmit={handleCreateSubmit}
          isLoading={mutations.isLoading.isCreating}
          hasBackground={false}
        />
      )}

      {selectedActId !== null && (
        <CompletionActDetailModal
          id={selectedActId}
          onClose={handleCloseActDetail}
          onUpload={handleUpload}
          onSubmit={handleSubmit}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={handleDelete}
          isLoading={{
            isUploading: mutations.isLoading.isUploading,
            isSubmitting: mutations.isLoading.isSubmitting,
            isApproving: mutations.isLoading.isApproving,
            isDeleting: mutations.isLoading.isDeleting,
          }}
          hasBackground={false}
        />
      )}

      {modals.rejectModal && (
        <CompletionActRejectModal
          onClose={modals.closeRejectModal}
          onConfirm={handleConfirmReject}
          isLoading={mutations.isLoading.isRejecting}
        />
      )}
    </>
  );
}

