import { useTranslation } from "react-i18next";
import { Breadcrumbs } from "@/shared/ui";

export default function ContractsHeader() {
  const { t } = useTranslation("ContractsPage");

  return (
    <>
      <Breadcrumbs items={[{ label: t("breadcrumbs.hr") }, { label: t("breadcrumbs.contracts") }]} />
      <div className="flex justify-between items-center mt-2">
        <h1 className="text-display-xs content-base-primary">{t("title")}</h1>
      </div>
    </>
  );
}
