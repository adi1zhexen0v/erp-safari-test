import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar1 } from "iconsax-react";
import {
  useUpdateAnnualLeaveMutation,
  useUpdateUnpaidLeaveMutation,
  useUpdateMedicalLeaveMutation,
  editLeaveSchema,
  type LeaveApplication,
  type CreateLeaveFormValues,
} from "@/features/hr/leave-applications";
import { Button, DatePicker, Input, ModalForm, Prompt, Select } from "@/shared/ui";
import { formatDateToISO } from "@/shared/utils";
import type { Locale } from "@/shared/utils/types";
import type { WorkerListItem } from "@/features/hr/employees";

interface Props {
  leave: LeaveApplication;
  employee: WorkerListItem;
  onClose: () => void;
  onSuccess: () => void;
}

interface ApiError {
  data?: {
    error?: string;
    message?: string;
    detail?: string;
  };
}

export default function EditLeaveModal({ leave, onClose, onSuccess }: Props) {
  const { i18n, t } = useTranslation("EmployeesPage");
  const locale = (i18n.language as Locale) || "ru";

  const [updateAnnualLeave, { isLoading: isUpdatingAnnual }] = useUpdateAnnualLeaveMutation();
  const [updateUnpaidLeave, { isLoading: isUpdatingUnpaid }] = useUpdateUnpaidLeaveMutation();
  const [updateMedicalLeave, { isLoading: isUpdatingMedical }] = useUpdateMedicalLeaveMutation();

  const schema = useMemo(function () {
    return editLeaveSchema(leave.leave_type);
  }, [leave.leave_type]);

  const form = useForm<CreateLeaveFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      start_date: new Date(leave.start_date),
      end_date: new Date(leave.end_date),
      reason: (leave as { reason?: string }).reason || "",
      approval_resolution:
        leave.leave_type === "unpaid" && "approval_resolution" in leave
          ? (leave as { approval_resolution?: "approved" | "recommend" | "no_objection" | "" | null }).approval_resolution === "" || (leave as { approval_resolution?: "approved" | "recommend" | "no_objection" | "" | null }).approval_resolution === null
            ? null
            : (leave as { approval_resolution?: "approved" | "recommend" | "no_objection" | "" | null }).approval_resolution || null
          : null,
      diagnosis: leave.leave_type === "medical" && "diagnosis" in leave ? (leave as { diagnosis?: string }).diagnosis || "" : "",
      certificate_required: leave.leave_type === "medical" && "certificate_required" in leave ? (leave as { certificate_required?: boolean }).certificate_required : true,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const startDate = watch("start_date");
  const endDate = watch("end_date");
  const approvalResolution = watch("approval_resolution");
  const diagnosis = watch("diagnosis");

  const isLoading = isUpdatingAnnual || isUpdatingUnpaid || isUpdatingMedical;
  const [resultPrompt, setResultPrompt] = useState<{
    title: string;
    text: string;
    variant: "success" | "error";
  } | null>(null);

  async function onSubmit(data: CreateLeaveFormValues) {
    try {
      const startDateStr = formatDateToISO(data.start_date);
      const endDateStr = formatDateToISO(data.end_date);

      if (leave.leave_type === "annual") {
        await updateAnnualLeave({
          id: leave.id,
          data: {
            start_date: startDateStr,
            end_date: endDateStr,
            reason: data.reason || undefined,
          },
        }).unwrap();
      } else if (leave.leave_type === "unpaid") {
        await updateUnpaidLeave({
          id: leave.id,
          data: {
            start_date: startDateStr,
            end_date: endDateStr,
            reason: data.reason || "",
            approval_resolution: data.approval_resolution || undefined,
          },
        }).unwrap();
      } else {
        await updateMedicalLeave({
          id: leave.id,
          data: {
            start_date: startDateStr,
            end_date: endDateStr,
            diagnosis: data.diagnosis || undefined,
            certificate_required: data.certificate_required ?? true,
          },
        }).unwrap();
      }

      onClose();
      setResultPrompt({
        title: t("leaveForm.editForm.successTitle") || t("leaveForm.successTitle"),
        text: t("leaveForm.editForm.successText") || t("leaveForm.successText"),
        variant: "success",
      });
      onSuccess();
    } catch (err: unknown) {
      onClose();
      const apiError = err as ApiError;
      const errorMessage =
        apiError?.data?.error || apiError?.data?.message || apiError?.data?.detail || t("leaveForm.editForm.errorText");
      setResultPrompt({
        title: t("leaveForm.editForm.errorTitle"),
        text: errorMessage,
        variant: "error",
      });
    }
  }

  function handleStartDateChange(v: Date | null) {
    if (v) {
      setValue("start_date", v, { shouldValidate: true });
    }
  }

  function handleEndDateChange(v: Date | null) {
    if (v) {
      setValue("end_date", v, { shouldValidate: true });
    }
  }

  function handleApprovalResolutionChange(v: "approved" | "recommend" | "no_objection" | null) {
    setValue("approval_resolution", v, { shouldValidate: true });
  }

  function handleDiagnosisChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue("diagnosis", e.target.value);
  }

  function handleResultPromptClose() {
    setResultPrompt(null);
  }

  const approvalResolutionOptions = [
    { label: t("leaveForm.approval_resolution.approved"), value: "approved" as const },
    { label: t("leaveForm.approval_resolution.recommend"), value: "recommend" as const },
    { label: t("leaveForm.approval_resolution.no_objection"), value: "no_objection" as const },
  ];

  return (
    <>
      {resultPrompt && (
        <Prompt
          title={resultPrompt.title}
          text={resultPrompt.text}
          variant={resultPrompt.variant}
          namespace="EmployeesPage"
          onClose={handleResultPromptClose}
        />
      )}
      <ModalForm icon={Calendar1} onClose={onClose}>
        <form className="flex flex-col justify-between p-1 h-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke">
              <h4 className="text-display-2xs content-base-primary">{t("leaveForm.editForm.title")}</h4>
              <p className="text-body-regular-sm content-base-secondary">{t("leaveForm.editForm.subtitle")}</p>
            </div>

            <div className="flex flex-col gap-5">
              <DatePicker
                locale={locale}
                mode="single"
                label={t("leaveForm.start_date.label")}
                placeholder={t("leaveForm.start_date.placeholder")}
                value={startDate || null}
                onChange={handleStartDateChange}
                error={errors.start_date?.message ? t(errors.start_date.message as string) : undefined}
              />

              <DatePicker
                locale={locale}
                mode="single"
                label={t("leaveForm.end_date.label")}
                placeholder={t("leaveForm.end_date.placeholder")}
                value={endDate || null}
                onChange={handleEndDateChange}
                error={errors.end_date?.message ? t(errors.end_date.message as string) : undefined}
              />

              {leave.leave_type === "unpaid" && (
                <>
                  <Input
                    label={t("leaveForm.reason.label")}
                    placeholder={t("leaveForm.reason.placeholder")}
                    isTextarea
                    {...register("reason")}
                    error={errors.reason?.message ? t(errors.reason.message as string) : undefined}
                  />

                  <Select
                    label={t("leaveForm.approval_resolution.label")}
                    placeholder={t("leaveForm.approval_resolution.placeholder")}
                    options={approvalResolutionOptions}
                    value={approvalResolution}
                    onChange={handleApprovalResolutionChange}
                    error={
                      errors.approval_resolution?.message ? t(errors.approval_resolution.message as string) : undefined
                    }
                  />
                </>
              )}

              {leave.leave_type === "medical" && (
                <Input
                  label={t("leaveForm.diagnosis.label")}
                  placeholder={t("leaveForm.diagnosis.placeholder")}
                  isTextarea
                  {...register("diagnosis")}
                  value={diagnosis || ""}
                  onChange={handleDiagnosisChange}
                  error={errors.diagnosis?.message ? t(errors.diagnosis.message as string) : undefined}
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-[2fr_3fr] gap-3">
            <Button variant="secondary" className="py-3" onClick={onClose} type="button">
              {t("leaveForm.cancel")}
            </Button>
            <Button variant="primary" type="submit" disabled={isLoading} className="py-3">
              {isLoading ? t("leaveForm.editForm.loading") || t("leaveForm.loading") : t("leaveForm.editForm.save")}
            </Button>
          </div>
        </form>
      </ModalForm>
    </>
  );
}
