import { useTranslation } from "react-i18next";
import { Breadcrumbs } from "@/shared/ui";

export default function ApplicationsHeader() {
  const { t } = useTranslation("LegalApplicationsPage");

  return (
    <>
      <Breadcrumbs items={[{ label: t("breadcrumbs.legal") }, { label: t("breadcrumbs.applications") }]} />

      <div className="flex justify-between items-center mt-2">
        <h1 className="text-display-xs content-base-primary">{t("header.title")}</h1>
      </div>
    </>
  );
}

