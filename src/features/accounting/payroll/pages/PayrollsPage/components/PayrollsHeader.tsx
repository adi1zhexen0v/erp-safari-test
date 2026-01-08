import { useTranslation } from "react-i18next";
import { Add } from "iconsax-react";
import { Breadcrumbs, Button } from "@/shared/ui";

interface Props {
  onGenerateClick: () => void;
}

export default function PayrollsHeader({ onGenerateClick }: Props) {
  const { t } = useTranslation("PayrollPage");

  return (
    <>
      <Breadcrumbs items={[{ label: t("breadcrumbs.accounting") }, { label: t("breadcrumbs.payrolls") }]} />

      <div className="flex justify-between items-center mt-2 mb-7">
        <h1 className="text-display-xs content-base-primary">{t("title")}</h1>

        <div className="flex justify-end gap-2">
          <Button variant="primary" className="h-10 px-3" onClick={onGenerateClick}>
            <Add size={16} color="currentColor" />
            {t("actions.generate")}
          </Button>
        </div>
      </div>
    </>
  );
}

