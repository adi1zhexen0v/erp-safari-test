import { useTranslation } from "react-i18next";
import { Import } from "iconsax-react";
import { Breadcrumbs, Button } from "@/shared/ui";
import { CloseIcon } from "@/shared/assets/icons";
import { ACCOUNTING_TIMESHEETS_PAGE_ROUTE, getMonthName } from "@/shared/utils";
import type { Locale } from "@/shared/utils";

interface Props {
  month: number;
  year: number;
  locale: Locale;
  isApproved: boolean;
  onDownload: () => void;
  onClose: () => void;
}

export default function TimesheetDetailHeader({ month, year, locale, isApproved, onDownload, onClose }: Props) {
  const { t } = useTranslation("TimesheetsPage");
  const monthName = getMonthName(month, locale);

  const breadcrumbs = [
    { label: t("breadcrumbs.accounting"), href: ACCOUNTING_TIMESHEETS_PAGE_ROUTE },
    { label: t("breadcrumbs.timesheets"), href: ACCOUNTING_TIMESHEETS_PAGE_ROUTE },
    { label: `${monthName} ${year}` },
  ];

  return (
    <>
      <title>{t("meta.detailTitleFull", { month: monthName.toLowerCase(), year })}</title>
      <meta name="description" content={t("meta.description")} />
      <Breadcrumbs items={breadcrumbs} />
      <div className="flex items-start justify-between mt-2 mb-7">
        <h1 className="text-display-xs content-base-primary">
          {t("meta.pageTitle", { month: monthName.toLowerCase(), year })}
        </h1>
        <div className="flex items-center gap-3">
          {isApproved && (
            <Button variant="secondary" size="lg" onClick={onDownload}>
              <Import size={16} color="currentColor" />
              {t("actions.download")}
            </Button>
          )}
          <button
            onClick={onClose}
            className="w-10 aspect-square flex items-center justify-center content-action-neutral hover:opacity-80 transition cursor-pointer">
            <CloseIcon />
          </button>
        </div>
      </div>
    </>
  );
}
