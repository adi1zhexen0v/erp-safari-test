import { useTranslation } from "react-i18next";
import { People } from "iconsax-react";
import type { Locale } from "@/shared/utils/types";
import type { PayrollEntry, GPHPayment } from "../../../types";
import {
  formatPayrollAmount,
  groupEntriesByTaxCategory,
  groupEntriesByResidency,
  groupEntriesByContractType,
  type GroupedEntryData,
} from "../../../utils";

interface Props {
  entries: PayrollEntry[];
  locale: Locale;
  gphPayments?: GPHPayment[];
}

interface GroupedData {
  label: string;
  count: number;
  gross: number;
  net: number;
}

function groupGPHPayments(payments: GPHPayment[], t: (key: string) => string): GroupedData[] {
  if (payments.length === 0) return [];

  const total = payments.reduce(
    (acc, payment) => {
      acc.count++;
      acc.gross += parseFloat(payment.gross_amount) || 0;
      acc.net += parseFloat(payment.net_amount) || 0;
      return acc;
    },
    { count: 0, gross: 0, net: 0 },
  );

  return [{ label: t("reportingSection.gphPayments"), ...total }];
}

interface ReportCardProps {
  title: string;
  data: GroupedData[];
}

function ReportCard({ title, data }: ReportCardProps) {
  const { t } = useTranslation("PayrollPage");

  if (data.length === 0) return null;

  return (
    <div className="p-4 radius-sm surface-component-fill flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="w-8 aspect-square flex items-center justify-center radius-xs surface-container-fill content-action-neutral">
          <People size={16} color="currentColor" />
        </div>
        <span className="text-label-sm content-base-primary">{title}</span>
      </div>

      <div className="flex flex-col gap-3">
        {data.map((row) => (
          <div
            key={row.label}
            className="flex flex-col gap-2 not-last:pb-3 border-b last:border-b-0 surface-component-stroke">
            <div className="flex items-center justify-between">
              <span className="text-body-regular-md content-base-primary">{row.label}</span>
              <span className="text-body-bold-md content-action-neutral">
                {row.count} {t("reportingSection.people")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-body-regular-md content-action-neutral">{t("reportingSection.accrued")}</span>
              <span className="text-body-bold-md content-base-primary">{formatPayrollAmount(row.gross)} ₸</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-body-regular-md content-action-neutral">{t("reportingSection.toPay")}</span>
              <span className="text-body-bold-md content-action-positive">{formatPayrollAmount(row.net)} ₸</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ReportingSection({ entries, locale, gphPayments = [] }: Props) {
  const { t } = useTranslation("PayrollPage");

  const byTaxCategoryData = groupEntriesByTaxCategory(entries, locale);
  const byResidencyData = groupEntriesByResidency(entries);
  const byContractTypeData = groupEntriesByContractType(entries);

  const byTaxCategory: GroupedData[] = byTaxCategoryData.map((item: GroupedEntryData) => ({
    label: item.label,
    count: item.count,
    gross: item.gross,
    net: item.net,
  }));

  const byResidency: GroupedData[] = byResidencyData.map((item: GroupedEntryData) => ({
    label: t(`reportingSection.${item.label}`),
    count: item.count,
    gross: item.gross,
    net: item.net,
  }));

  const byContractType: GroupedData[] = byContractTypeData.map((item: GroupedEntryData) => ({
    label: t(`reportingSection.${item.label}`),
    count: item.count,
    gross: item.gross,
    net: item.net,
  }));

  const byGPHPayments = groupGPHPayments(gphPayments, t);

  const hasGPH = byGPHPayments.length > 0;

  const gridClasses = hasGPH
    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3"
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3";

  return (
    <div className="p-5 radius-lg border surface-component-stroke flex flex-col gap-5">
      <div className="flex flex-col gap-0.5">
        <h3 className="text-body-bold-lg content-base-primary">{t("sections.reporting")}</h3>
        <p className="text-body-regular-sm content-action-neutral">{t("reportingSection.summaryNote")}</p>
      </div>

      <div className={gridClasses}>
        <ReportCard title={t("reportingSection.byTaxCategory")} data={byTaxCategory} />
        <ReportCard title={t("reportingSection.byResidency")} data={byResidency} />
        <ReportCard title={t("reportingSection.byContractType")} data={byContractType} />
        {hasGPH && <ReportCard title={t("reportingSection.byGPHPayments")} data={byGPHPayments} />}
      </div>
    </div>
  );
}
