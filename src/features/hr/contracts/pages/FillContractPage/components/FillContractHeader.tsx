import { useTranslation } from "react-i18next";
import { Breadcrumbs } from "@/shared/ui";
import { HR_CONTRACTS_PAGE_ROUTE } from "@/shared/utils";

export default function FillContractHeader() {
  const { t } = useTranslation("FillContractPage");

  return (
    <div className="p-7 rounded-[28px] background-static-white mb-4">
      <Breadcrumbs
        items={[
          { label: t("breadcrumbs.hr") },
          { label: t("breadcrumbs.contracts"), href: HR_CONTRACTS_PAGE_ROUTE },
          { label: t("breadcrumbs.fill_contract") },
        ]}
      />
      <h1 className="text-display-xs content-base-primary mt-2">{t("title")}</h1>
    </div>
  );
}
