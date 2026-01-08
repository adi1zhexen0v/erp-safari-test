import { useTranslation } from "react-i18next";
import { Message } from "iconsax-react";
import { Breadcrumbs, Button } from "@/shared/ui";

interface Props {
  onOpenForm: () => void;
}

export default function CasesHeader({ onOpenForm }: Props) {
  const { t } = useTranslation("LegalCasesPage");

  return (
    <>
      <Breadcrumbs items={[{ label: t("breadcrumbs.legal") }, { label: t("breadcrumbs.cases") }]} />

      <div className="flex justify-between items-center mt-2">
        <h1 className="text-display-xs content-base-primary">{t("header.title")}</h1>

        <div className="flex justify-end gap-2 pr-0.5">
          <Button variant="primary" className="h-10 px-3" onClick={onOpenForm}>
            {t("header.newForm")} <Message size={16} color="currentColor" />
          </Button>
        </div>
      </div>
    </>
  );
}
