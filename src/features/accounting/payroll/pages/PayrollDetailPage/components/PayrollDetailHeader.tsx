import { useTranslation } from "react-i18next";
import { Breadcrumbs } from "@/shared/ui";
import { CloseIcon } from "@/shared/assets/icons";
import { getMonthName, ACCOUNTING_PAYROLLS_PAGE_ROUTE, type Locale } from "@/shared/utils";
import type { PayrollStatus } from "../../../types";
import StatusBadge from "./StatusBadge";

interface Props {
  month: number;
  year: number;
  status: PayrollStatus;
  locale: Locale;
  onClose: () => void;
}

export default function PayrollDetailHeader({ month, year, status, locale, onClose }: Props) {
  const { t, i18n } = useTranslation("PayrollPage");
  const currentLocale = (i18n.language as Locale) || locale;
  const monthName = getMonthName(month, currentLocale);

  const breadcrumbs = [
    { label: t("breadcrumbs.accounting"), href: ACCOUNTING_PAYROLLS_PAGE_ROUTE },
    { label: t("breadcrumbs.payrolls"), href: ACCOUNTING_PAYROLLS_PAGE_ROUTE },
    { label: `${monthName} ${year}` },
  ];

  return (
    <>
      <title>{t("meta.detailTitleFull", { month: monthName.toLowerCase(), year })}</title>
      <meta name="description" content={t("meta.description")} />
      <Breadcrumbs items={breadcrumbs} />

      <div className="flex items-start justify-between mt-2 mb-7">
        <div className="flex items-center gap-4">
          <h1 className="text-display-xs content-base-primary">
            {t("meta.pageTitle", { month: monthName.toLowerCase(), year })}
          </h1>
          <StatusBadge status={status} t={t} />
        </div>
        <button
          onClick={onClose}
          className="w-10 aspect-square flex items-center justify-center content-action-neutral hover:opacity-80 transition cursor-pointer">
          <CloseIcon />
        </button>
      </div>
    </>
  );
}
