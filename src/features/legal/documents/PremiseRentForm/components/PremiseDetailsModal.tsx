import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DocumentText1, ArrowRight2, Location, Ruler, Buildings2 } from "iconsax-react";
import cn from "classnames";
import { ModalForm, Button } from "@/shared/ui";
import { TrustMeStatus } from "@/shared/components";
import { formatPrice } from "@/shared/utils";
import { TengeCircleIcon } from "@/shared/assets/icons";
import type { Locale } from "@/shared/utils/types";
import { useGetCitiesQuery } from "@/shared/api/common";
import { PremisesHandoverPreviewModal } from "../../PremisesHandoverForm";
import type { PremisesHandoverAct } from "../../PremisesHandoverForm";
import { useGetPremiseRentQuery } from "../api";
import type { PremiseRentContract } from "../types";
import { mapApiResponseToPreviewData, extractAreaNumber } from "../utils";
import { PremiseRentPreviewModal } from "./";

interface Props {
  document: PremiseRentContract;
  handovers: PremisesHandoverAct[];
  onClose: () => void;
}

export default function PremiseDetailsModal({ document, handovers, onClose }: Props) {
  const { t, i18n } = useTranslation("LegalApplicationsPage");
  const { t: tTemplates } = useTranslation("LegalTemplatesPage");
  const locale = (i18n.language as Locale) || "ru";

  const [selectedHandoverId, setSelectedHandoverId] = useState<number | null>(null);
  const [isFullPreviewOpen, setIsFullPreviewOpen] = useState(false);

  const { data: documentData, isLoading: isLoadingDocumentData } = useGetPremiseRentQuery(document.id, {
    skip: !isFullPreviewOpen,
  });
  const { data: cities = [] } = useGetCitiesQuery();

  function handlePreviewContract() {
    setIsFullPreviewOpen(true);
  }

  function handleCloseFullPreview() {
    setIsFullPreviewOpen(false);
  }

  const previewLocale = locale === "kk" ? "kk" : "ru";
  const previewData = documentData ? mapApiResponseToPreviewData(documentData, previewLocale, cities) : undefined;

  return (
    <>
      <ModalForm icon={DocumentText1} onClose={onClose} resize={false} allowCloseInOverlay={false}>
        <div className="flex flex-col gap-6 h-full min-h-0">
          <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke shrink-0">
            <h4 className="text-display-2xs content-base-primary">{t("cards.previewContract")}</h4>
          </div>

          <div className="flex-1 overflow-auto min-h-0">
            <div className="flex flex-col py-4">
              <div className="flex flex-col gap-2 mb-4 border-b surface-base-stroke pb-3">
                <p className="text-body-bold-lg content-base-primary">
                  {tTemplates("templates.commercialPremiseRent.title")} №{document.id}
                </p>
                <TrustMeStatus trustmeStatus={document.trustme_status} locale={locale} />
              </div>

              <div className="flex flex-col">
                {[
                  {
                    key: "premiseAddress",
                    label: t("cards.premiseAddress"),
                    value: document.premise_address || "",
                    icon: Location,
                  },
                  {
                    key: "area",
                    label: t("cards.area"),
                    value: document.premise_area
                      ? `${extractAreaNumber(document.premise_area)} ${t("cards.squareMeters")}`
                      : "",
                    icon: Ruler,
                  },
                  {
                    key: "lessor",
                    label: t("cards.lessor"),
                    value: document.commercial_org
                      ? locale === "kk"
                        ? document.commercial_org.name_kk || document.commercial_org.name_ru
                        : document.commercial_org.name_ru || document.commercial_org.name_kk
                      : "",
                    icon: Buildings2,
                  },
                  {
                    key: "rentalAmount",
                    label: t("cards.rentalAmount"),
                    value: `${formatPrice(document.rental_amount)} ₸`,
                    icon: TengeCircleIcon,
                  },
                ]
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

              {handovers.length > 0 && (
                <div className="flex flex-col gap-2 mt-3 pt-4 border-t surface-base-stroke">
                  <p className="text-body-bold-lg content-base-primary">{t("cards.documents")}</p>
                  {handovers.map((handover) => (
                    <div
                      key={handover.id}
                      className="flex items-center justify-between px-3 py-2 radius-sm border surface-base-stroke cursor-pointer"
                      onClick={() => setSelectedHandoverId(handover.id)}>
                      <div className="flex items-center gap-2">
                        <span className="w-8 aspect-square rounded-[8px] flex items-center justify-center surface-component-fill content-action-neutral">
                          <DocumentText1 size={16} color="currentColor" />
                        </span>
                        <span className="text-label-sm content-base-primary">
                          {t("cards.handoverActPrefix")} №{handover.id}
                        </span>
                      </div>
                      <span className="content-action-neutral">
                        <ArrowRight2 size={16} color="currentColor" />
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-[2fr_3fr] p-1 gap-2">
            <Button variant="secondary" size="lg" className="flex-1" onClick={onClose}>
              {t("modals.cancel")}
            </Button>
            <Button variant="secondary" size="lg" className="flex-1" onClick={handlePreviewContract}>
              {t("cards.previewContract")}
            </Button>
          </div>
        </div>
      </ModalForm>

      {selectedHandoverId !== null && (
        <PremisesHandoverPreviewModal
          id={selectedHandoverId}
          onClose={() => setSelectedHandoverId(null)}
          hasBackground={false}
        />
      )}

      {isFullPreviewOpen && (
        <PremiseRentPreviewModal
          formData={previewData}
          isLoading={isLoadingDocumentData}
          onClose={handleCloseFullPreview}
          hasBackground={false}
          readOnly
          commercialOrg={documentData?.commercial_org}
        />
      )}
    </>
  );
}
