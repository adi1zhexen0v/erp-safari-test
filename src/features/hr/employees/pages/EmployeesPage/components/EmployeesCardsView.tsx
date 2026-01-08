import { useTranslation } from "react-i18next";
import { Briefcase, Calendar, Call, Sms, Import, Edit, CloseCircle, SunFog, AddCircle } from "iconsax-react";
import { STATUS_MAP } from "@/features/hr/employees/consts/statuses";
import type { WorkerListItem } from "@/features/hr/employees";
import { TengeCircleIcon } from "@/shared/assets/icons";
import { Badge, Button } from "@/shared/ui";

interface Props {
  employees: WorkerListItem[];
  onDownloadProfile: (id: number) => void;
  isDownloading: boolean;
  onOpenLeaveForm: (employee: WorkerListItem) => void;
  onOpenMedicalLeaveForm: (employee: WorkerListItem) => void;
  onOpenResignationForm: (employee: WorkerListItem) => void;
  onOpenContractChanges: (employee: WorkerListItem) => void;
}

export default function EmployeesCardsView({
  employees,
  onDownloadProfile,
  isDownloading,
  onOpenLeaveForm,
  onOpenMedicalLeaveForm,
  onOpenResignationForm,
  onOpenContractChanges,
}: Props) {
  const { t } = useTranslation("EmployeesPage");

  function formatDate(dateStr: string | null): string {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("ru-RU");
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {employees.map((emp) => {
        const salaryNum = Number(emp.active_contract?.salary_amount ?? 0);
        const salaryFormatted = salaryNum ? salaryNum.toLocaleString("ru-RU") + " ₸" : "—";
        const statusConfig = STATUS_MAP[emp.status as keyof typeof STATUS_MAP];

        return (
          <div key={emp.id} className="flex flex-col gap-3 radius-lg border surface-base-stroke surface-base-fill p-5">
            <div className="flex flex-col gap-2 pb-4 border-b surface-base-stroke">
              {statusConfig && (
                <Badge
                  variant="soft"
                  color={statusConfig.color}
                  text={t(statusConfig.label)}
                  icon={statusConfig.icon}
                />
              )}
              <p className="text-body-bold-lg content-base-primary">{emp.full_name}</p>
            </div>

            <div className="flex flex-col border-b surface-base-stroke pb-3 gap-3">
              <div className="flex items-center gap-1.5">
                <span className="content-action-brand">
                  <Sms size={18} color="currentColor" />
                </span>
                <p className="text-body-regular-sm content-base-primary">{emp.contacts?.email || "—"}</p>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="content-action-brand">
                  <Call size={18} color="currentColor" />
                </span>
                <p className="text-body-regular-sm content-base-primary">{emp.contacts?.phone || "—"}</p>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="content-action-brand">
                  <Briefcase size={18} color="currentColor" />
                </span>
                <p className="text-body-regular-sm content-base-primary">
                  {emp.active_contract?.job_position_ru || emp.active_contract?.work_position || "—"}
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="content-action-brand">
                  <TengeCircleIcon size={18} />
                </span>
                <p className="text-body-regular-sm content-base-primary">{salaryFormatted}</p>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <p className="content-base-secondary text-body-bold-xs">{t("cards.hireDate")}</p>

              <div className="flex items-center gap-1.5">
                <span className="content-action-brand">
                  <Calendar size={18} color="currentColor" />
                </span>
                <p className="text-body-regular-sm content-base-primary">
                  {emp.active_contract?.start_date ? formatDate(emp.active_contract.start_date) : "—"}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-3 border-t surface-base-stroke">
              <Button
                variant="secondary"
                size="md"
                className="w-full"
                disabled={isDownloading}
                onClick={() => onDownloadProfile(emp.id)}>
                <Import size={16} color="currentColor" />
                {t("cards.downloadProfile")}
              </Button>
              <Button variant="secondary" size="md" className="w-full" onClick={() => onOpenContractChanges(emp)}>
                <Edit size={16} color="currentColor" />
                {t("actions.modifyContract")}
              </Button>
              <Button variant="secondary" size="md" className="w-full" onClick={() => onOpenLeaveForm(emp)}>
                <SunFog size={16} color="currentColor" />
                {t("actions.sendOnLeave")}
              </Button>
              <Button variant="secondary" size="md" className="w-full" onClick={() => onOpenMedicalLeaveForm(emp)}>
                <AddCircle size={16} color="currentColor" />
                {t("actions.sendOnSickLeave")}
              </Button>
              <Button variant="danger" size="md" className="w-full" onClick={() => onOpenResignationForm(emp)}>
                <CloseCircle size={16} color="currentColor" />
                {t("actions.terminateContract")}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

