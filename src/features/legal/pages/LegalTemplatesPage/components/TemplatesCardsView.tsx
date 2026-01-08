import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Calendar, DocumentText1 } from "iconsax-react";
import { Button, ModalForm, Prompt } from "@/shared/ui";
import { LEGAL_TEMPLATES, type LegalTemplateId } from "@/features/legal";
import type { CommercialOrganization } from "../../../types/commercialOrganizations";
import { VehicleRentForm } from "../../../documents/VehicleRentForm";
import { PremiseRentForm } from "../../../documents/PremiseRentForm";
import { ServiceAgreementMSBForm } from "../../../documents/ServiceAgreementMSBForm";
import { ServiceContractForm } from "../../../documents/ServiceContractForm";
import { GoodsSupplyForm } from "../../../documents/GoodsSupplyForm";

interface Props {
  commercialOrganizations: CommercialOrganization[];
}

export default function TemplatesCardsView({ commercialOrganizations }: Props) {
  const { t } = useTranslation("LegalTemplatesPage");
  const [openFormId, setOpenFormId] = useState<LegalTemplateId | undefined>(undefined);
  const [successPrompt, setSuccessPrompt] = useState<{
    isEdit: boolean;
    templateId?: LegalTemplateId;
  } | null>(null);

  const handleOpenForm = (formId: LegalTemplateId) => {
    setOpenFormId(formId);
  };

  const handleCloseForm = () => {
    setOpenFormId(undefined);
  };

  const handleSuccess = (isEdit: boolean) => {
    const templateId = openFormId;
    setOpenFormId(undefined);
    setSuccessPrompt({ isEdit, templateId });
  };

  const handleClosePrompt = () => {
    setSuccessPrompt(null);
  };

  const renderForm = () => {
    if (!openFormId) return null;

    switch (openFormId) {
      case "vehicleRent":
        return <VehicleRentForm commercialOrganizations={commercialOrganizations} onSuccess={handleSuccess} />;
      case "commercialPremiseRent":
        return (
          <PremiseRentForm
            commercialOrganizations={commercialOrganizations}
            onSuccess={handleSuccess}
          />
        );
      case "paidService":
        return (
          <ServiceAgreementMSBForm commercialOrganizations={commercialOrganizations} onSuccess={handleSuccess} />
        );
      case "serviceContract":
        return <ServiceContractForm onSuccess={handleSuccess} />;
      case "supplyContract":
        return <GoodsSupplyForm commercialOrganizations={commercialOrganizations} onSuccess={handleSuccess} />;
      default:
        return null;
    }
  };
  return (
    <>
      {successPrompt &&
        (() => {
          const getPromptKey = () => {
            if (!successPrompt.templateId) {
              return successPrompt.isEdit ? "contractUpdated" : "contractCreated";
            }

            const templateMap: Record<LegalTemplateId, string> = {
              vehicleRent: "vehicleRent",
              commercialPremiseRent: "premisesLease",
              paidService: "serviceAgreementMSB",
              serviceContract: "serviceAgreementIndividual",
              supplyContract: "goodsSupply",
            };

            const baseKey = templateMap[successPrompt.templateId] || "contract";
            const operationKey = successPrompt.isEdit ? "Updated" : "Created";
            return `${baseKey}${operationKey}`;
          };

          const promptKey = getPromptKey();
          const titleKey = `common.prompts.${promptKey}.title`;
          const textKey = `common.prompts.${promptKey}.text`;

          return (
            <Prompt
              variant="success"
              title={t(titleKey)}
              text={t(textKey)}
              buttonText={t("common.close")}
              onClose={handleClosePrompt}
              namespace="LegalTemplatesPage"
            />
          );
        })()}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mt-7">
        {LEGAL_TEMPLATES.map((template) => (
          <div
            key={template.id}
            className="flex flex-col gap-3 radius-lg border surface-base-stroke surface-base-fill p-5">
            <div className="flex flex-col gap-5">
              <div className="flex justify-between items-start">
                <div className="w-10 flex justify-center items-center aspect-square surface-tertiary-fill content-base-secondary radius-xs">
                  <DocumentText1 size={20} color="currentColor" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-body-bold-lg content-base-primary">{t(template.titleKey)}</p>
                <p className="text-label-xs content-base-secondary">{t(template.subtitleKey)}</p>
              </div>

              <div className="flex flex-col gap-1.5 border-t surface-base-stroke pt-3">
                <span className="text-body-bold-xs content-base-secondary">{t("common.approvalDate")}</span>
                <div className="flex items-center gap-1.5">
                  <span className="content-action-brand">
                    <Calendar size={16} color="currentColor" />
                  </span>
                  <span className="text-body-regular-sm content-base-primary">12.05.2025</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="primary" size="md" onClick={() => handleOpenForm(template.id)}>
                  {t("common.fill")}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {openFormId && (
        <ModalForm icon={DocumentText1} onClose={handleCloseForm} allowCloseInOverlay={false}>
          {renderForm()}
        </ModalForm>
      )}
    </>
  );
}
