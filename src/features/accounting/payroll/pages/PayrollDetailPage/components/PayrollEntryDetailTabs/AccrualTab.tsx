import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowDown2, InfoCircle } from "iconsax-react";
import type { PayrollEntry } from "@/features/accounting/payroll/types";
import { formatPayrollAmount } from "@/features/accounting/payroll/utils";

interface Props {
  entry: PayrollEntry;
  isFullScreen?: boolean;
}

export default function AccrualTab({ entry, isFullScreen = false }: Props) {
  const { t } = useTranslation("PayrollPage");
  const [isIpnExpanded, setIsIpnExpanded] = useState(true);
  const [isSoExpanded, setIsSoExpanded] = useState(true);
  const [isSnExpanded, setIsSnExpanded] = useState(true);

  const salary = parseFloat(entry.salary_amount) || 0;
  const grossSalary = parseFloat(entry.gross_salary) || 0;
  const opv = parseFloat(entry.opv) || 0;
  const ipn = parseFloat(entry.ipn) || 0;
  const vosms = parseFloat(entry.vosms) || 0;
  const totalDeductions = parseFloat(entry.total_employee_deductions) || 0;
  const opvr = parseFloat(entry.opvr) || 0;
  const so = parseFloat(entry.so) || 0;
  const oosms = parseFloat(entry.oosms) || 0;
  const sn = parseFloat(entry.sn) || 0;
  const totalEmployer = parseFloat(entry.total_employer_contributions) || 0;
  const netSalary = parseFloat(entry.net_salary) || 0;

  const ipnBase = parseFloat(entry.ipn_base) || 0;
  const standardDeduction = parseFloat(entry.standard_deduction) || 0;
  const ipnRate = entry.calculation_snapshot?.flags?.ipn_rate ?? 10;

  const MRP = 4325;

  return (
    <div className={`grid gap-3 p-1 ${isFullScreen ? "grid-cols-2" : "grid-cols-1"}`}>
      <div className="p-5 radius-lg border surface-base-stroke">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-6 h-6 rounded-full bg-info-500/15 background-on-background-strong-info flex items-center justify-center text-label-xs">
            1
          </div>
          <span className="text-body-bold-lg content-base-primary">{t("tabs.accrual.accruals")} </span>
        </div>

        <div className="flex flex-col gap-3 pt-3 border-t surface-base-stroke">
          <h6 className="text-body-regular-sm content-base-primary">{t("tabs.accrual.grossSalary")}</h6>
          <div className="flex items-center justify-between">
            <span className="pl-2 border-l surface-base-stroke text-label-xs content-action-neutral">
              {t("tabs.accrual.salaryFormula")} {formatPayrollAmount(salary)} ₸
            </span>
            <p className="text-body-bold-md content-base-primary">{formatPayrollAmount(grossSalary)} ₸</p>
          </div>
        </div>
      </div>

      <div className="p-5 radius-lg border surface-base-stroke">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-6 h-6 rounded-full bg-info-500/15 background-on-background-strong-info flex items-center justify-center text-label-xs">
            2
          </div>
          <span className="text-body-bold-lg content-base-primary">{t("tabs.accrual.employeeDeductions")}</span>
        </div>

        <div className="flex flex-col gap-3 pt-3 border-t surface-base-stroke">
          <h6 className="text-body-regular-sm content-base-primary">{t("tabs.accrual.opvTitle")}</h6>
          <div className="flex items-center justify-between">
            <span className="pl-2 border-l surface-base-stroke text-label-xs content-action-neutral">
              {t("tabs.accrual.opvFormula").replace("Оклад", formatPayrollAmount(grossSalary))}
            </span>
            <p className="text-body-bold-md content-action-negative">- {formatPayrollAmount(opv)} ₸</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-3 pt-3 border-t surface-base-stroke">
          <div className="flex justify-between items-center">
            <h6 className="text-body-regular-sm content-base-primary">
              {t("tabs.accrual.ipnTitle")} {ipnRate * 100}%
            </h6>
            <span className="content-base-primary cursor-pointer" onClick={() => setIsIpnExpanded(!isIpnExpanded)}>
              <ArrowDown2
                className={`transition-transform duration-300 ${isIpnExpanded ? "rotate-180" : ""}`}
                size={16}
                color="currentColor"
              />
            </span>
          </div>
          {isIpnExpanded && (
            <div className="surface-component-fill radius-sm p-3 flex flex-col gap-3">
              <div className="flex flex-col gap-3">
                <h6 className="text-body-regular-sm content-base-primary">{t("tabs.accrual.standardDeduction2026")}</h6>
                <div className="flex items-center justify-between">
                  <span className="pl-2 border-l surface-base-stroke text-label-xs content-action-neutral">
                    14 {t("tabs.accrual.mrp")} {t("tabs.accrual.mrpTimes")} {formatPayrollAmount(MRP)} ₸
                  </span>
                  <p className="text-body-bold-md content-base-primary">{formatPayrollAmount(14 * MRP)} ₸</p>
                </div>
              </div>

              <div className="py-2 px-3 surface-container-fill radius-xs flex items-center justify-start gap-2">
                <span className="content-base-primary">
                  <InfoCircle size={16} color="currentColor" />
                </span>
                <p className="text-label-xs content-base-primary">
                  {t("tabs.accrual.mrpInfo")} {formatPayrollAmount(MRP)} ₸, {t("tabs.accrual.mzpInfo")}
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-3 border-t surface-base-stroke">
                <div className="flex flex-col gap-0.5">
                  <h6 className="text-body-regular-sm content-base-primary">{t("tabs.accrual.ipnBase")}</h6>
                  <p className="text-label-xs content-action-neutral">{t("tabs.accrual.ipnBaseFormula")}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="pl-2 border-l surface-base-stroke text-label-xs content-action-neutral">
                    {formatPayrollAmount(grossSalary)} − {formatPayrollAmount(opv)} − {formatPayrollAmount(vosms)} −{" "}
                    {formatPayrollAmount(standardDeduction)}
                  </span>
                  <p className="text-body-bold-md content-base-primary">{formatPayrollAmount(standardDeduction)} ₸</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-3 border-t surface-base-stroke">
                <h6 className="text-body-regular-sm content-base-primary">
                  {t("tabs.accrual.ipnFromBase").replace("%", `${ipnRate * 100}%`)}
                </h6>
                <div className="flex items-center justify-between">
                  <span className="pl-2 border-l surface-base-stroke text-label-xs content-action-neutral">
                    {formatPayrollAmount(ipnBase)} {t("tabs.accrual.mrpTimes")} {ipnRate * 100}%
                  </span>
                  <p className="text-body-bold-md content-base-primary">{formatPayrollAmount(ipn)} ₸</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="pl-2 border-l surface-base-stroke text-label-xs content-action-neutral">
              {t("tabs.accrual.ipnToPay")}
            </span>
            <p className="text-body-bold-md content-base-primary">{formatPayrollAmount(ipn)} ₸</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-3 pt-3 border-t surface-base-stroke">
          <h6 className="text-body-regular-sm content-base-primary">{t("tabs.accrual.vosmsTitle")}</h6>
          <div className="flex items-center justify-between">
            <span className="pl-2 border-l surface-base-stroke text-label-xs content-action-neutral">
              {t("tabs.accrual.vosmsFormula").replace("Оклад", formatPayrollAmount(grossSalary))}
            </span>
            <p className="text-body-bold-md content-action-negative">- {formatPayrollAmount(vosms)} ₸</p>
          </div>
        </div>

        <div className="mt-5 radius-sm p-3 surface-component-fill flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <h6 className="text-body-regular-sm content-base-primary">{t("tabs.accrual.totalDeducted")}</h6>
            <span className="text-label-xs content-action-neutral">{t("tabs.accrual.deductionsFormula")}</span>
          </div>

          <p className="text-display-2xs content-base-primary">{formatPayrollAmount(totalDeductions)} ₸</p>
        </div>
      </div>

      <div className="p-5 radius-lg border surface-base-stroke">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-6 h-6 rounded-full bg-info-500/15 background-on-background-strong-info flex items-center justify-center text-label-xs">
            3
          </div>
          <span className="text-body-bold-lg content-base-primary">{t("tabs.accrual.employerContributions")}</span>
        </div>

        <div className="flex flex-col gap-3 pt-3 border-t surface-base-stroke">
          <h6 className="text-body-regular-sm content-base-primary">{t("tabs.accrual.opvrTitle")}</h6>
          <div className="flex items-center justify-between">
            <span className="pl-2 border-l surface-base-stroke text-label-xs content-action-neutral">
              {t("tabs.accrual.opvrFormula").replace("Оклад", formatPayrollAmount(grossSalary))}
            </span>
            <p className="text-body-bold-md content-base-primary">{formatPayrollAmount(opvr)} ₸</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-3 pt-3 border-t surface-base-stroke">
          <div className="flex justify-between items-center">
            <h6 className="text-body-regular-sm content-base-primary">{t("tabs.accrual.soTitle")}</h6>
            <span className="content-base-primary cursor-pointer" onClick={() => setIsSoExpanded(!isSoExpanded)}>
              <ArrowDown2
                className={`transition-transform duration-300 ${isSoExpanded ? "rotate-180" : ""}`}
                size={16}
                color="currentColor"
              />
            </span>
          </div>
          {isSoExpanded && (
            <div className="surface-component-fill radius-sm p-3 flex flex-col gap-3">
              <div className="flex flex-col gap-3">
                <h6 className="text-body-regular-sm content-base-primary">{t("tabs.accrual.soFormula")}</h6>
                <div className="flex items-center justify-between">
                  <span className="pl-2 border-l surface-base-stroke text-label-xs content-action-neutral">
                    {t("tabs.accrual.soBase")} {formatPayrollAmount(grossSalary)} − {formatPayrollAmount(opv)} ={" "}
                    {formatPayrollAmount(grossSalary - opv)} ₸
                  </span>
                  <p className="text-body-bold-md content-base-primary">{formatPayrollAmount(grossSalary - opv)} ₸</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-3 border-t surface-base-stroke">
                <h6 className="text-body-regular-sm content-base-primary">{t("tabs.accrual.soPercent")}</h6>
                <div className="flex items-center justify-between">
                  <span className="pl-2 border-l surface-base-stroke text-label-xs content-action-neutral">
                    {formatPayrollAmount(grossSalary - opv)} {t("tabs.accrual.mrpTimes")} 5%
                  </span>
                  <p className="text-body-bold-md content-base-primary">
                    {formatPayrollAmount((grossSalary - opv) * 0.05)} ₸
                  </p>
                </div>
              </div>

              <div className="py-2 px-3 surface-container-fill radius-xs flex items-center justify-start gap-2">
                <span className="content-base-primary">
                  <InfoCircle size={16} color="currentColor" />
                </span>
                <p className="text-label-xs content-base-primary">
                  {t("tabs.accrual.soWithLimits")} {formatPayrollAmount(so)} ₸
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="pl-2 border-l surface-base-stroke text-label-xs content-action-neutral">
              {t("tabs.accrual.soToPay")}
            </span>
            <p className="text-body-bold-md content-base-primary">{formatPayrollAmount(so)} ₸</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-3 pt-3 border-t surface-base-stroke">
          <h6 className="text-body-regular-sm content-base-primary">{t("tabs.accrual.oosmsTitle")}</h6>
          <div className="flex items-center justify-between">
            <span className="pl-2 border-l surface-base-stroke text-label-xs content-action-neutral">
              {t("tabs.accrual.oosmsFormula").replace("Оклад", formatPayrollAmount(grossSalary))}
            </span>
            <p className="text-body-bold-md content-base-primary">{formatPayrollAmount(oosms)} ₸</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-3 pt-3 border-t surface-base-stroke">
          <div className="flex justify-between items-center">
            <h6 className="text-body-regular-sm content-base-primary">{t("tabs.accrual.snTitle")}</h6>
            <span className="content-base-primary cursor-pointer" onClick={() => setIsSnExpanded(!isSnExpanded)}>
              <ArrowDown2
                className={`transition-transform duration-300 ${isSnExpanded ? "rotate-180" : ""}`}
                size={16}
                color="currentColor"
              />
            </span>
          </div>
          {isSnExpanded && (
            <div className="surface-component-fill radius-sm p-3 flex flex-col gap-3">
              <div className="flex flex-col gap-3">
                <h6 className="text-body-regular-sm content-base-primary">{t("tabs.accrual.snFormula")}</h6>
                <div className="flex items-center justify-between">
                  <span className="pl-2 border-l surface-base-stroke text-label-xs content-action-neutral">
                    {t("tabs.accrual.snBase")} {formatPayrollAmount(grossSalary)} − {formatPayrollAmount(opv)} −{" "}
                    {formatPayrollAmount(vosms)} = {formatPayrollAmount(grossSalary - opv - vosms)} ₸
                  </span>
                  <p className="text-body-bold-md content-base-primary">
                    {formatPayrollAmount(grossSalary - opv - vosms)} ₸
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-3 border-t surface-base-stroke">
                <h6 className="text-body-regular-sm content-base-primary">{t("tabs.accrual.snPercent")}</h6>
                <div className="flex items-center justify-between">
                  <span className="pl-2 border-l surface-base-stroke text-label-xs content-action-neutral">
                    {formatPayrollAmount(grossSalary - opv - vosms)} {t("tabs.accrual.mrpTimes")} 11%
                  </span>
                  <p className="text-body-bold-md content-base-primary">
                    {formatPayrollAmount((grossSalary - opv - vosms) * 0.11)} ₸
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-3 border-t surface-base-stroke">
                <h6 className="text-body-regular-sm content-base-primary">{t("tabs.accrual.snToPay")}</h6>
                <div className="flex items-center justify-between">
                  <span className="pl-2 border-l surface-base-stroke text-label-xs content-action-neutral">
                    {formatPayrollAmount((grossSalary - opv - vosms) * 0.11)} − {formatPayrollAmount(so)}
                  </span>
                  <p className="text-body-bold-md content-base-primary">{formatPayrollAmount(sn)} ₸</p>
                </div>
              </div>

              <div className="py-2 px-3 surface-container-fill radius-xs flex items-center justify-start gap-2">
                <span className="content-base-primary">
                  <InfoCircle size={16} color="currentColor" />
                </span>
                <p className="text-label-xs content-base-primary">{t("tabs.accrual.snNote")}</p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="pl-2 border-l surface-base-stroke text-label-xs content-action-neutral">
              {t("tabs.accrual.snToPay")}
            </span>
            <p className="text-body-bold-md content-base-primary">{formatPayrollAmount(sn)} ₸</p>
          </div>
        </div>

        <div className="mt-5 radius-sm p-3 surface-component-fill flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <h6 className="text-body-regular-sm content-base-primary">{t("tabs.accrual.totalEmployerExpenses")}</h6>
            <span className="text-label-xs content-action-neutral">{t("tabs.accrual.employerExpensesFormula")}</span>
          </div>

          <p className="text-display-2xs content-base-primary">{formatPayrollAmount(totalEmployer)} ₸</p>
        </div>
      </div>

      <div className="p-5 radius-lg border surface-base-stroke flex flex-col justify-between gap-5">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-info-500/15 background-on-background-strong-info flex items-center justify-center text-label-xs">
              4
            </div>
            <span className="text-body-bold-lg content-base-primary">{t("tabs.accrual.netPay")}</span>
          </div>

          <div>
            <div className="flex flex-col items-center justify-center gap-3 py-3 border-t border-b surface-base-stroke">
              <p className="text-body-regular-sm content-base-primary">{t("tabs.accrual.netPayFormula")}</p>
              <div className="flex items-center justify-center gap-1.5">
                <div className="py-1 px-2 rounded-4xl text-label-sm surface-info-subtle background-on-background-strong-info">
                  {t("tabs.accrual.accrued")}
                </div>
                <span className="text-body-bold-lg content-base-primary">−</span>
                <div className="py-1 px-2 rounded-4xl text-label-sm surface-negative-subtle background-on-background-strong-negative">
                  {t("tabs.accrual.deductions")}
                </div>
                <span className="text-body-bold-lg content-base-primary">=</span>
                <div className="py-1 px-2 rounded-4xl text-label-sm surface-positive-subtle background-on-background-strong-positive">
                  {t("tabs.accrual.netPayResult")}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-3 mt-3">
              <p className="text-body-regular-sm content-base-primary">
                {formatPayrollAmount(grossSalary)} - {formatPayrollAmount(totalDeductions)} =
              </p>
              <h5 className="text-display-lg content-action-positive">{formatPayrollAmount(netSalary)} ₸</h5>
              <span className="text-label-xs content-action-neutral">{t("tabs.accrual.amountToCard")}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 radius-sm p-3 surface-component-fill flex justify-between items-center gap-2">
          <div className="flex flex-col gap-1">
            <h6 className="text-body-regular-sm content-base-primary">{t("tabs.accrual.totalCompanyExpenses")}</h6>
            <span className="text-label-xs content-action-neutral">
              {formatPayrollAmount(grossSalary)} {t("tabs.accrual.companyExpensesFormula").split(" + ")[0]} +{" "}
              {formatPayrollAmount(totalEmployer)} {t("tabs.accrual.companyExpensesFormula").split(" + ")[1]}
            </span>
          </div>

          <p className="text-display-2xs content-base-primary whitespace-nowrap">
            {formatPayrollAmount(grossSalary + totalEmployer)} ₸
          </p>
        </div>
      </div>
    </div>
  );
}
