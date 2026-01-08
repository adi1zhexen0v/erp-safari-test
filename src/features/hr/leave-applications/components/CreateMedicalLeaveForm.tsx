import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddCircle } from "iconsax-react";
import { Button, DatePicker, Input, ModalForm } from "@/shared/ui";
import { formatDateToISO, type Locale } from "@/shared/utils";
import type { WorkerListItem } from "@/features/hr/employees";
import { useCreateMedicalLeaveMutation } from "../api";
import { createLeaveSchema, type CreateLeaveFormValues } from "../validation";
import MedicalLeavePreview from "./MedicalLeavePreview";

interface Props {
  employee: WorkerListItem;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateMedicalLeaveForm({ employee, onClose, onSuccess }: Props) {
  const { i18n, t } = useTranslation("EmployeesPage");
  const locale = (i18n.language as Locale) || "ru";

  const [showPreview, setShowPreview] = useState(false);
  const [formDataForPreview, setFormDataForPreview] = useState<CreateLeaveFormValues | null>(null);

  const [createMedicalLeave, { isLoading: isCreatingMedical }] = useCreateMedicalLeaveMutation();

  const schema = useMemo(function () {
    return createLeaveSchema("medical");
  }, []);

  const form = useForm<CreateLeaveFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      start_date: undefined,
      end_date: undefined,
      reason: "",
      approval_resolution: null,
      diagnosis: "",
      certificate_required: true,
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
        diagnosis: "",
        certificate_required: true,
      });
    },
    [reset, form],
  );

  const startDate = watch("start_date");
  const endDate = watch("end_date");
  const diagnosis = watch("diagnosis");

  function onSubmit(data: CreateLeaveFormValues) {
    setFormDataForPreview(data);
    setShowPreview(true);
  }

  async function handlePreviewSubmit() {
    if (!formDataForPreview) return;

    try {
      const startDateStr = formatDateToISO(formDataForPreview.start_date);
      const endDateStr = formatDateToISO(formDataForPreview.end_date);

      await createMedicalLeave({
        worker_id: employee.id,
        start_date: startDateStr,
        end_date: endDateStr,
        diagnosis: formDataForPreview.diagnosis || undefined,
        certificate_required: formDataForPreview.certificate_required ?? true,
      }).unwrap();

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Ошибка при создании заявления на больничный", err);
    }
  }

  function handlePreviewClose() {
    setShowPreview(false);
    setFormDataForPreview(null);
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

  function handleDiagnosisChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue("diagnosis", e.target.value);
  }

  if (showPreview && formDataForPreview) {
    return (
      <MedicalLeavePreview
        employee={employee}
        formData={formDataForPreview}
        onClose={handlePreviewClose}
        onSubmit={handlePreviewSubmit}
        isLoading={isCreatingMedical}
      />
    );
  }

  return (
    <ModalForm icon={AddCircle} onClose={onClose}>
      <form className="flex flex-col justify-between p-1 h-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke">
            <h4 className="text-display-2xs content-base-primary">{t("leaveForm.medicalForm.title")}</h4>
            <p className="text-body-regular-sm content-base-secondary">{t("leaveForm.medicalForm.subtitle")}</p>
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

            <Input
              label={t("leaveForm.diagnosis.label")}
              placeholder={t("leaveForm.diagnosis.placeholder")}
              isTextarea
              {...register("diagnosis")}
              value={diagnosis || ""}
              onChange={handleDiagnosisChange}
              error={errors.diagnosis?.message ? t(errors.diagnosis.message as string) : undefined}
            />
          </div>
        </div>

        <div className="grid grid-cols-[2fr_3fr] gap-3">
          <Button variant="secondary" className="py-3" onClick={onClose} type="button">
            {t("leaveForm.cancel")}
          </Button>
          <Button variant="primary" type="submit" disabled={isCreatingMedical} className="py-3">
            {isCreatingMedical ? t("leaveForm.loading") : t("leaveForm.continue")}
          </Button>
        </div>
      </form>
    </ModalForm>
  );
}
