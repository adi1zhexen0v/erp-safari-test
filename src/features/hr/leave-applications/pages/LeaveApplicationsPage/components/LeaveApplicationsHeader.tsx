import { useTranslation } from "react-i18next";
import { Breadcrumbs } from "@/shared/ui";

export default function LeaveApplicationsHeader() {
  const { t } = useTranslation("LeaveApplicationsPage");

  return (
    <>
      <Breadcrumbs items={[{ label: t("breadcrumbs.hr") }, { label: t("breadcrumbs.leaves") }]} />
      <div className="flex justify-between items-center mt-2">
        <h1 className="text-display-xs content-base-primary">{t("header.title")}</h1>
      </div>
    </>
  );
}

