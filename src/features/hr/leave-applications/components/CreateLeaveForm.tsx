import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { SunFog, PauseCircle } from "iconsax-react";
import { Button, ButtonGroup, DatePicker, Input, ModalForm, Select } from "@/shared/ui";
import { formatDateToISO, type Locale } from "@/shared/utils";
import type { WorkerListItem } from "@/features/hr/employees";
import { useCreateAnnualLeaveMutation, useCreateUnpaidLeaveMutation } from "../api";
import { createLeaveSchema, type CreateLeaveFormValues } from "../validation";
import AnnualLeavePreview from "./AnnualLeavePreview";
import UnpaidLeavePreview from "./UnpaidLeavePreview";

interface Props {
  employee: WorkerListItem;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateLeaveForm({ employee, onClose, onSuccess }: Props) {
  const { i18n, t } = useTranslation("EmployeesPage");
  const locale = (i18n.language as Locale) || "ru";

  const [leaveType, setLeaveType] = useState<"annual" | "unpaid">("annual");
  const [showPreview, setShowPreview] = useState(false);
  const [formDataForPreview, setFormDataForPreview] = useState<CreateLeaveFormValues | null>(null);

  const [createAnnualLeave, { isLoading: isCreatingAnnual }] = useCreateAnnualLeaveMutation();
  const [createUnpaidLeave, { isLoading: isCreatingUnpaid }] = useCreateUnpaidLeaveMutation();

  const schema = useMemo(
    function () {
      return createLeaveSchema(leaveType);
    },
    [leaveType],
  );

  const form = useForm<CreateLeaveFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      start_date: undefined,
      end_date: undefined,
      reason: "",
      approval_resolution: null,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = form;

  useEffect(
    function () {
      form.clearErrors();
      reset({
        start_date: undefined,
        end_date: undefined,
        reason: "",
        approval_resolution: null,
      });
    },
    [leaveType, reset, form],
  );

  const startDate = watch("start_date");
  const endDate = watch("end_date");
  const approvalResolution = watch("approval_resolution");

  const isLoading = isCreatingAnnual || isCreatingUnpaid;

  function onSubmit(data: CreateLeaveFormValues) {
    setFormDataForPreview(data);
    setShowPreview(true);
  }

  async function handlePreviewSubmit() {
    if (!formDataForPreview) return;

    try {
      const startDateStr = formatDateToISO(formDataForPreview.start_date);
      const endDateStr = formatDateToISO(formDataForPreview.end_date);

      if (leaveType === "annual") {
        await createAnnualLeave({
          worker_id: employee.id,
          start_date: startDateStr,
          end_date: endDateStr,
          reason: formDataForPreview.reason || undefined,
        }).unwrap();
      } else {
        await createUnpaidLeave({
          worker_id: employee.id,
          start_date: startDateStr,
          end_date: endDateStr,
          reason: formDataForPreview.reason || "",
          approval_resolution: formDataForPreview.approval_resolution || undefined,
        }).unwrap();
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Ошибка при создании заявления на отпуск", err);
    }
  }

  function handlePreviewClose() {
    setShowPreview(false);
    setFormDataForPreview(null);
  }

  function handleLeaveTypeChange(value: string) {
    setLeaveType(value as "annual" | "unpaid");
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

  if (showPreview && formDataForPreview) {
    if (leaveType === "annual") {
      return (
        <AnnualLeavePreview
          employee={employee}
          formData={formDataForPreview}
          onClose={handlePreviewClose}
          onSubmit={handlePreviewSubmit}
          isLoading={isLoading}
        />
      );
    } else {
      return (
        <UnpaidLeavePreview
          employee={employee}
          formData={formDataForPreview}
          onClose={handlePreviewClose}
          onSubmit={handlePreviewSubmit}
          isLoading={isLoading}
        />
      );
    }
  }

  const approvalResolutionOptions = [
    { label: t("leaveForm.approval_resolution.approved"), value: "approved" as const },
    { label: t("leaveForm.approval_resolution.recommend"), value: "recommend" as const },
    { label: t("leaveForm.approval_resolution.no_objection"), value: "no_objection" as const },
  ];

  return (
    <ModalForm icon={SunFog} onClose={onClose}>
      <form key={leaveType} className="flex flex-col justify-between p-1 h-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke">
            <h4 className="text-display-2xs content-base-primary">{t("leaveForm.title")}</h4>
            <p className="text-body-regular-sm content-base-secondary">{t("leaveForm.subtitle")}</p>
          </div>

          <div className="flex flex-col gap-5">
            <ButtonGroup
              fullWidth
              options={[
                {
                  label: (
                    <>
                      <SunFog size={16} variant="Bold" color="currentColor" />
                      {t("leaveForm.annual")}
                    </>
                  ),
                  value: "annual",
                },
                {
                  label: (
                    <>
                      <PauseCircle size={16} variant="Bold" color="currentColor" />
                      {t("leaveForm.unpaid")}
                    </>
                  ),
                  value: "unpaid",
                },
              ]}
              value={leaveType}
              onChange={handleLeaveTypeChange}
            />

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

            {leaveType === "unpaid" && (
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
          </div>
        </div>

        <div className="grid grid-cols-[2fr_3fr] gap-3">
          <Button variant="secondary" className="py-3" onClick={onClose} type="button">
            {t("leaveForm.cancel")}
          </Button>
          <Button variant="primary" type="submit" disabled={isLoading} className="py-3">
            {isLoading ? t("leaveForm.loading") : t("leaveForm.continue")}
          </Button>
        </div>
      </form>
    </ModalForm>
  );
}
