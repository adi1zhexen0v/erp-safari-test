import { useMemo } from "react";
import { DocumentText1 } from "iconsax-react";
import { useAppSelector } from "@/shared/hooks";
import { Button, ModalForm } from "@/shared/ui";
import { formatDateForContract } from "@/shared/utils";
import type { WorkerListItem } from "@/features/hr/employees";
import type { CreateLeaveFormValues } from "../validation";

interface Props {
  employee: WorkerListItem;
  formData: CreateLeaveFormValues;
  onClose: () => void;
  onSubmit: () => void;
  isLoading: boolean;
  isPreviewOnly?: boolean;
}

const APPROVAL_RESOLUTION_MAP: Record<string, string> = {
  approved: "Согласовано",
  recommend: "Ходатайствую",
  no_objection: "Не возражаю",
};

export default function UnpaidLeavePreview({
  employee,
  formData,
  onClose,
  onSubmit,
  isLoading,
  isPreviewOnly = false,
}: Props) {
  const userData = useAppSelector(function (state) {
    return state.auth.data?.user;
  });

  const startDateText = useMemo(function () {
    if (!formData.start_date) return "_____________";
    return formatDateForContract(formData.start_date, "ru");
  }, [formData.start_date]);

  const endDateText = useMemo(function () {
    if (!formData.end_date) return "_____________";
    return formatDateForContract(formData.end_date, "ru");
  }, [formData.end_date]);

  const contractDate = useMemo(function () {
    return formatDateForContract(new Date(), "ru");
  }, []);

  const organizationName = userData?.organization || "_____________";
  const employerFullName = userData?.full_name || "_____________";
  const employeeFullName = employee.full_name || "_____________";
  const employeeJobPosition =
    employee.active_contract?.job_position_ru || employee.active_contract?.work_position || "_____________";
  const reason = formData.reason || "_____________";
  const approvalResolution =
    formData.approval_resolution && APPROVAL_RESOLUTION_MAP[formData.approval_resolution]
      ? APPROVAL_RESOLUTION_MAP[formData.approval_resolution]
      : "_____________";

  return (
    <ModalForm icon={DocumentText1} onClose={onClose} resize>
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke">
          <h4 className="text-display-2xs content-base-primary">Предпросмотр заявления</h4>
        </div>

        <div className="flex-1 overflow-auto page-scroll pr-5 pt-5">
          <div className="flex flex-col text-body-regular-md content-base-primary bg-white">
            <div className="text-right mb-6">
              <p>
                <strong>Директору</strong>
              </p>
              <p>
                <strong>{organizationName}</strong>
              </p>
              <p>
                <strong>{employerFullName}</strong>
              </p>
              <p>
                от <strong>{employeeJobPosition}</strong>
              </p>
              <p>
                <strong>{employeeFullName}</strong>
              </p>
            </div>

            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-4">ЗАЯВЛЕНИЕ</h1>
            </div>

            <div className="mb-6 text-justify">
              <p>
                Прошу Вас предоставить мне отпуск без сохранения заработной платы с <strong>{startDateText}</strong> по{" "}
                <strong>{endDateText}</strong> включительно в связи с <strong>{reason}</strong>.
              </p>
            </div>

            <div className="flex justify-between items-end mt-8 mb-6">
              <div className="flex-1">
                <div className="border-t border-black mt-8 mb-2 w-48"></div>
                <p className="mb-1">
                  <strong>(личная подпись)</strong>
                </p>
                <p className="mb-1">
                  <strong>{employeeFullName}</strong>
                </p>
                <p className="text-sm">
                  <strong>{contractDate}</strong>
                </p>
              </div>
            </div>

            <div className="mb-6">
              <p className="mb-2">Виза начальника отдела или непосредственного руководителя, с комментариями:</p>
              <p className="mb-2">
                <strong>{approvalResolution}</strong>
              </p>
              <div className="flex justify-end items-end mt-4">
                <div className="flex-1 text-right">
                  <div className="border-t border-black mt-8 mb-2 ml-auto w-48"></div>
                  <p className="text-sm">
                    <strong>{contractDate}</strong>
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
