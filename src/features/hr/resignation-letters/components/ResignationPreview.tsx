import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DocumentText1 } from "iconsax-react";
import { useAppSelector } from "@/shared/hooks";
import { Button, ModalForm } from "@/shared/ui";
import { formatDateForContract, type Locale } from "@/shared/utils";
import type { WorkerListItem } from "@/features/hr/employees";
import type { CreateResignationFormValues } from "../validation";

interface Props {
  employee: WorkerListItem;
  formData: CreateResignationFormValues;
  onClose: () => void;
  onSubmit: () => void;
  isLoading: boolean;
  isPreviewOnly?: boolean;
  locale?: Locale;
}

export default function ResignationPreview({
  employee,
  formData,
  onClose,
  onSubmit,
  isLoading,
  isPreviewOnly = false,
  locale = "ru",
}: Props) {
  const { t, i18n } = useTranslation("EmployeesPage");
  const currentLocale = locale || (i18n.language as Locale) || "ru";
  const userData = useAppSelector((state) => state.auth.data?.user);

  const lastWorkingDayText = useMemo(() => {
    if (!formData.last_working_day) return "_____________";
    const locale = currentLocale === "en" ? "ru" : currentLocale;
    return formatDateForContract(formData.last_working_day, locale as "ru" | "kk", true);
  }, [formData.last_working_day, currentLocale]);

  const approvalResolution = useMemo(() => {
    if (!formData.approval_resolution) return "_____________";
    const key = `resignationForm.approval_resolution.${formData.approval_resolution}`;
    return t(key);
  }, [formData.approval_resolution, t]);

  const organizationName = userData?.organization || "_____________";
  const employerFullName = userData?.full_name || "_____________";
  const employeeFullName = employee.full_name || "_____________";
  const employeeJobPosition =
    employee.active_contract?.job_position_ru || employee.active_contract?.work_position || "_____________";

  return (
    <ModalForm icon={DocumentText1} onClose={onClose} resize>
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke">
          <h4 className="text-display-2xs content-base-primary">Предпросмотр заявления</h4>
        </div>

        <div className="flex-1 overflow-auto page-scroll pr-5 pt-5">
          <div className="flex flex-col text-body-regular-md content-base-primary bg-white">
            <div className="flex justify-between mb-6">
              <div className="flex-1">
                <p>
                  <strong>ТОО «{organizationName}»</strong>
                </p>
                <p>
                  от <strong>{employeeJobPosition}</strong>
                </p>
                <p>
                  <strong>{employeeFullName}</strong>
                </p>
              </div>

              <div className="flex-1 text-right">
                <p>
                  <strong>Директору</strong>
                </p>
                <p>
                  <strong>{organizationName}</strong>
                </p>
                <p>
                  <strong>{employerFullName}</strong>
                </p>
              </div>
            </div>

            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-4">ЗАЯВЛЕНИЕ</h1>
            </div>

            <div className="mb-6 text-justify">
              <p>
                Прошу Вас расторгнуть трудовой договор <strong>{lastWorkingDayText}</strong> (указывается дата
                последнего рабочего дня) по собственному желанию.
              </p>
            </div>

            <div className="flex justify-between items-end mt-8 mb-6">
              <div className="flex-1">
                <div className="border-t border-black mt-8 mb-2 w-48"></div>
                <p className="mb-1">
                  <strong>(дата, подпись)</strong>
                </p>
                <p className="mb-1">
                  <strong>{employeeFullName}</strong>
                </p>
              </div>
            </div>

            <div className="mb-6">
              <p className="mb-2">
                <strong>Виза начальника отдела или непосредственного руководителя, с комментариями:</strong>
              </p>
              <p className="mb-2">
                <strong>{approvalResolution}</strong>
              </p>
              <div className="flex justify-end items-end mt-4">
                <div className="flex-1 text-right">
                  <div className="border-t border-black mt-8 mb-2 ml-auto w-48"></div>
                  <p className="text-sm">
                    <strong>(дата, подпись)</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pb-1">
          {isPreviewOnly ? (
            <Button variant="secondary" size="lg" onClick={onClose}>
              Закрыть
            </Button>
          ) : (
            <>
              <Button variant="secondary" size="lg" onClick={onClose} disabled={isLoading}>
                Назад
              </Button>
              <Button variant="primary" size="lg" disabled={isLoading} onClick={onSubmit}>
                {isLoading ? "Отправка..." : "Отправить"}
              </Button>
            </>
          )}
        </div>
      </div>
    </ModalForm>
  );
}

