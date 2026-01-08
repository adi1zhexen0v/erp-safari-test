import { useTranslation } from "react-i18next";
import { Send2 } from "iconsax-react";
import { Breadcrumbs, Button } from "@/shared/ui";

interface Props {
  onOpenInvite: () => void;
}

export default function HiringHeader({ onOpenInvite }: Props) {
  const { t } = useTranslation("HiringPage");

  return (
    <>
      <Breadcrumbs items={[{ label: t("breadcrumbs.hr") }, { label: t("breadcrumbs.hiring") }]} />

      <div className="flex justify-between items-center mt-2">
        <h1 className="text-display-xs content-base-primary">{t("header.title")}</h1>

        <div className="flex justify-end gap-2 pr-0.5">
          <Button variant="primary" className="h-10 px-3" onClick={onOpenInvite}>
            {t("header.newInvitation")} <Send2 size={16} color="currentColor" />
          </Button>
        </div>
      </div>
    </>
  );
}
