import { useTranslation } from "react-i18next";
import type { Locale } from "@/shared/utils/types";
import type { PayrollEntry, GPHPayment } from "../../../types";
import PayrollEntriesTable from "./PayrollEntriesTable";
import GPHPaymentsTable from "./GPHPaymentsTable";

interface Props {
  entries: PayrollEntry[];
  gphPayments?: GPHPayment[];
  onViewEntryDetails: (entry: PayrollEntry) => void;
  onViewGPHDetails?: (payment: GPHPayment) => void;
  onMarkGPHPaid?: (payment: GPHPayment) => void;
  locale?: Locale;
  markingGPHPaidId?: number | null;
}

export default function AccrualSection({
  entries,
  gphPayments = [],
  onViewEntryDetails,
  onViewGPHDetails,
  onMarkGPHPaid,
  locale = "ru",
  markingGPHPaidId,
}: Props) {
  const { t, i18n } = useTranslation("PayrollPage");
  const currentLocale = (i18n.language as Locale) || locale;

  return (
    <div className="flex flex-col gap-5 p-5 radius-lg border surface-component-stroke">
      <div className="flex flex-col gap-0.5">
        <h3 className="text-body-bold-lg content-base-primary">{t("sections.accrual")}</h3>
        <p className="text-body-regular-sm content-action-neutral">{t("sections.accrualDescription")}</p>
      </div>

      {entries.length > 0 && (
        <div className="flex flex-col gap-5">
          {gphPayments.length > 0 && (
            <h4 className="text-body-bold-md content-base-primary pt-3 border-t surface-component-stroke">
              {t("detail.accrual.employees")}
            </h4>
          )}
          <PayrollEntriesTable entries={entries} onViewEntryDetails={onViewEntryDetails} locale={currentLocale} />
        </div>
      )}

      {entries.length === 0 && gphPayments.length === 0 && (
        <div className="p-5 rounded-lg border surface-base-stroke text-center">
          <p className="text-body-regular-sm content-base-low">{t("detail.entries.empty")}</p>
        </div>
      )}

      {gphPayments.length > 0 && (
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <h4 className="text-body-bold-md content-base-primary">{t("detail.accrual.contractors")}</h4>
          </div>

          <GPHPaymentsTable
            payments={gphPayments}
            onViewDetails={onViewGPHDetails || (() => {})}
            onMarkPaid={onMarkGPHPaid}
            markingGPHPaidId={markingGPHPaidId}
          />
        </div>
      )}
    </div>
  );
}

