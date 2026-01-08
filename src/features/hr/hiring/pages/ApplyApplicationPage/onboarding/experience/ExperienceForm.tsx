import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Checkbox, DatePicker, Input, Select, Toast } from "@/shared/ui";
import { formatDateToISO, type Locale } from "@/shared/utils";
import { EXPERIENCE_SECTOR_OPTIONS } from "@/features/hr/hiring";
import { type ExperienceFormValues, experienceSchema } from "./validation";
import type { ExperienceRecord } from "./types";

interface Props {
  title: string;
  initialData?: ExperienceRecord | null;
  editable: boolean;
  onSubmit?: (values: ExperienceFormValues) => void | Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export default function ExperienceForm({ title, initialData, editable, onSubmit, onCancel, isLoading = false }: Props) {
  const { i18n, t } = useTranslation("ApplyApplicationPage");
  const locale = (i18n.language as Locale) || "ru";

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      organization_name: "",
      work_position: "",
      beginning_date: "",
      end_date: "",
    },
  });

  const [workingNow, setWorkingNow] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [toast, setToast] = useState<{
    text: string;
    color: "positive" | "negative" | "notice" | "grey";
  } | null>(null);

  const ending = watch("end_date");
  const beginning = watch("beginning_date");
  const workPosition = watch("work_position");

  useEffect(() => {
    if (initialData) {
      reset({
        organization_name: initialData.organization_name ?? "",
        work_position: initialData.work_position ?? "",
        beginning_date: initialData.beginning_date ?? "",
        end_date: initialData.end_date ?? "",
      });

      setWorkingNow(!initialData.end_date || initialData.end_date === "" || initialData.end_date === null);
    } else {
      setWorkingNow(false);
    }
  }, [initialData, reset]);

  function toggleWorkingNow() {
    if (!editable) return;

    setWorkingNow((prev) => {
      const next = !prev;

      if (!next) {
        setValue("end_date", "", { shouldValidate: true });
      }

      return next;
    });
  }

  async function internalSubmit(values: ExperienceFormValues) {
    if (!editable || !onSubmit || submitting) return;

    if (!workingNow && (!values.end_date || (typeof values.end_date === "string" && values.end_date.trim() === ""))) {
      setError("end_date", {
        type: "manual",
        message: "validation.experience.end_required",
      });
      return;
    }

    setSubmitting(true);
    setToast(null);

    try {
      const endForApi = workingNow
        ? null
        : values.end_date && typeof values.end_date === "string" && values.end_date.trim() !== ""
          ? formatDateToISO(values.end_date)
          : "";

      await onSubmit({
        ...values,
        beginning_date: formatDateToISO(values.beginning_date),
        end_date: endForApi,
      });

      setToast({ color: "positive", text: "experience.toast.success" });
    } catch (e) {
      setToast({ color: "negative", text: "experience.toast.error" });
      console.error("Ошибка при сохранении опыта работы", e);
    } finally {
      setSubmitting(false);
    }
  }

  const isDisabled = isLoading || submitting;

  return (
    <form className="flex flex-col gap-6" onSubmit={editable ? handleSubmit(internalSubmit) : undefined}>
      {editable && <p className="text-body-bold-lg content-base-primary">{title}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          disabled={!editable || isDisabled}
          label={t("experience.organization.label")}
          placeholder={t("experience.organization.placeholder")}
          {...register("organization_name")}
          error={errors.organization_name?.message && t(errors.organization_name.message)}
        />

        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm font-semibold text-black dark:text-white">{t("experience.position.label")}</label>
          <Select
            disabled={!editable || isDisabled}
            options={EXPERIENCE_SECTOR_OPTIONS.map((opt) => ({
              label: opt.value,
              value: opt.value,
            }))}
            value={workPosition}
            onChange={(v) => setValue("work_position", v ?? "", { shouldValidate: true })}
            placeholder={t("experience.position.placeholder")}
          />
          {errors.work_position && (
            <p className="text-body-regular-xs content-action-negative">{t(errors.work_position.message as string)}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-black dark:text-white">{t("experience.begin.label")}</label>

          <DatePicker
            disabled={!editable || isDisabled}
            mode="single"
            locale={locale}
            value={beginning ? new Date(beginning) : null}
            placeholder={t("experience.begin.placeholder")}
            onChange={(v) =>
              editable &&
              setValue("beginning_date", formatDateToISO(v as Date), {
                shouldValidate: true,
              })
            }
          />

          {errors.beginning_date && (
            <p className="text-body-regular-xs content-action-negative">{t(errors.beginning_date.message as string)}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-black dark:text-white">{t("experience.end.label")}</label>

          <DatePicker
            disabled={!editable || workingNow || isDisabled}
            mode="single"
            locale={locale}
            value={ending ? new Date(ending) : null}
            placeholder={t("experience.end.placeholder")}
            onChange={(v) =>
              editable &&
              setValue("end_date", formatDateToISO(v as Date), {
                shouldValidate: true,
              })
            }
          />

          {errors.end_date && (
            <p className="text-body-regular-xs content-action-negative">{t(errors.end_date.message as string)}</p>
          )}
        </div>
      </div>

      <Checkbox
        state={workingNow ? "checked" : "unchecked"}
        disabled={!editable || isDisabled}
        onChange={editable ? toggleWorkingNow : undefined}
        label={t("experience.working_now")}
      />

      {editable && (
        <div className="flex justify-end pt-4 gap-3">
          {toast && (
            <Toast
              key={`${toast.color}-${toast.text}`}
              color={toast.color}
              text={t(toast.text)}
              onClose={() => setToast(null)}
            />
          )}

          <Button variant="secondary" size="lg" onClick={onCancel} disabled={isDisabled}>
            {t("experience.cancel")}
          </Button>

          <Button variant="primary" size="lg" type="submit" disabled={isDisabled}>
            {isDisabled ? t("experience.proof.saving") : t("experience.proof.save")}
          </Button>
        </div>
      )}
    </form>
  );
}

