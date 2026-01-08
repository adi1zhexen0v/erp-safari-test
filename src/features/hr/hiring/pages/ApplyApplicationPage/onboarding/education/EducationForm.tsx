import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileUploader } from "@/shared/components";
import { Button, Input, Select, Toast } from "@/shared/ui";
import { type EducationFormValues, createEducationSchema } from "./validation";
import type { EducationRecord } from "./types";

interface Props {
  initialData?: EducationRecord | null;
  onSubmit: (values: EducationFormValues) => void;
  isNew?: boolean;
  onCancel?: () => void;
  isLoading?: boolean;
  editable?: boolean;
}

export default function EducationForm({
  initialData,
  onSubmit,
  onCancel,
  isNew = false,
  isLoading = false,
  editable = true,
}: Props) {
  const { t } = useTranslation("ApplyApplicationPage");
  const [isDiplomaRemoved, setIsDiplomaRemoved] = useState(false);
  const [isTranscriptRemoved, setIsTranscriptRemoved] = useState(false);

  const [toast, setToast] = useState<{
    text: string;
    color: "positive" | "negative" | "notice" | "grey";
  } | null>(null);

  const requireFiles = useMemo(() => {
    return isNew || !initialData;
  }, [isNew, initialData]);

  const schema = useMemo(() => createEducationSchema(requireFiles), [requireFiles]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<EducationFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      degree: "",
      university_name: "",
      specialty: "",
      graduation_year: "",
      diploma_number: "",
      diploma_file: null,
      diploma_transcript_file: null,
    },
  });
  useEffect(() => {
    if (initialData) {
      reset({
        degree: initialData.degree ?? "",
        university_name: initialData.university_name ?? "",
        specialty: initialData.specialty ?? "",
        graduation_year: initialData.graduation_year ?? "",
        diploma_number: initialData.diploma_number ?? "",
        diploma_file: null,
        diploma_transcript_file: null,
      });

      setIsDiplomaRemoved(false);
      setIsTranscriptRemoved(false);
    }
  }, [initialData, reset]);

  const diplomaFile = watch("diploma_file");
  const transcriptFile = watch("diploma_transcript_file");
  async function handleLocalSubmit(values: EducationFormValues) {
    if (!editable) return;

    const hasDiplomaApi = !!initialData?.diploma_file_url && !isDiplomaRemoved;
    const hasDiplomaNew = !!values.diploma_file;

    if (!hasDiplomaApi && !hasDiplomaNew) {
      setError("diploma_file", {
        type: "manual",
        message: "validation.education.file_required",
      });
      return;
    }

    const hasTranscriptApi = !!initialData?.diploma_transcript_file_url && !isTranscriptRemoved;
    const hasTranscriptNew = !!values.diploma_transcript_file;

    if (!hasTranscriptApi && !hasTranscriptNew) {
      setError("diploma_transcript_file", {
        type: "manual",
        message: "validation.education.transcript_required",
      });
      return;
    }

    try {
      await onSubmit({
        ...values,
        diploma_file: hasDiplomaApi ? null : values.diploma_file,
        diploma_transcript_file: hasTranscriptApi ? null : values.diploma_transcript_file,
      });

      setToast({ color: "positive", text: "education.toast.success" });
    } catch (e) {
      setToast({ color: "negative", text: "education.toast.error" });
      console.error("Ошибка при сохранении образования", e);
    }
  }
  return (
    <form className="flex flex-col gap-6" onSubmit={editable ? handleSubmit(handleLocalSubmit) : undefined}>
      {isNew && editable && <h3 className="content-base-primary text-display-2xs">{t("education.new_form")}</h3>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">{t("education.degree.label")}</label>

          <Select
            disabled={!editable}
            options={[
              { label: t("education.degree.options.bachelor"), value: "bachelor" },
              { label: t("education.degree.options.master"), value: "master" },
              { label: t("education.degree.options.phd"), value: "phd" },
              { label: t("education.degree.options.college"), value: "college" },
            ]}
            value={watch("degree")}
            onChange={(v) => editable && setValue("degree", v ?? "", { shouldValidate: true })}
            placeholder={t("education.degree.placeholder")}
          />

          {errors.degree && <p className="text-body-regular-xs content-action-negative">{t(errors.degree.message!)}</p>}
        </div>

        {}
        <Input
          disabled={!editable}
          label={t("education.university.label")}
          placeholder={t("education.university.placeholder")}
          {...register("university_name")}
          error={errors.university_name?.message && t(errors.university_name.message as string)}
        />
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          disabled={!editable}
          label={t("education.specialty.label")}
          placeholder={t("education.specialty.placeholder")}
          {...register("specialty")}
          error={errors.specialty?.message && t(errors.specialty.message as string)}
        />

        <Input
          disabled={!editable}
          label={t("education.year.label")}
          placeholder={t("education.year.placeholder")}
          {...register("graduation_year")}
          error={errors.graduation_year?.message && t(errors.graduation_year.message as string)}
        />
      </div>

      {}
      <Input
        disabled={!editable}
        label={t("education.diploma_number.label")}
        placeholder={t("education.diploma_number.placeholder")}
        {...register("diploma_number")}
        error={errors.diploma_number?.message && t(errors.diploma_number.message as string)}
      />

      {}
      <div className="flex flex-col gap-3">
        <p className="font-semibold text-body-md">{t("education.upload_title")}</p>

        {}
        <FileUploader
          label={t("education.diploma_file.label")}
          value={diplomaFile}
          existingFileUrl={!isDiplomaRemoved ? initialData?.diploma_file_url : null}
          onChange={(file) => {
            if (editable) {
              setValue("diploma_file", file, { shouldValidate: true });
              if (file) setIsDiplomaRemoved(false);
            }
          }}
          onRemoveExisting={() => {
            if (editable) {
              setIsDiplomaRemoved(true);
              setValue("diploma_file", null);
            }
          }}
          error={errors.diploma_file?.message ? t(errors.diploma_file.message as string) : null}
        />

        {}
        <FileUploader
          label={t("education.diploma_transcript.label")}
          value={transcriptFile}
          existingFileUrl={!isTranscriptRemoved ? initialData?.diploma_transcript_file_url : null}
          onChange={(file) => {
            if (editable) {
              setValue("diploma_transcript_file", file, { shouldValidate: true });
              if (file) setIsTranscriptRemoved(false);
            }
          }}
          onRemoveExisting={() => {
            if (editable) {
              setIsTranscriptRemoved(true);
              setValue("diploma_transcript_file", null);
            }
          }}
          error={errors.diploma_transcript_file?.message ? t(errors.diploma_transcript_file.message as string) : null}
        />
      </div>

      {toast && (
        <Toast
          key={`${toast.color}-${toast.text}`}
          color={toast.color}
          text={t(toast.text)}
          onClose={() => setToast(null)}
        />
      )}

      {}
      {editable && (
        <div className="flex justify-end gap-3 pt-2">
          {isNew && onCancel && (
            <Button variant="secondary" size="lg" type="button" onClick={onCancel} disabled={isLoading}>
              {t("education.cancel")}
            </Button>
          )}

          <Button variant="primary" size="lg" type="submit" disabled={isLoading}>
            {isLoading ? t("education.saving") : t("education.save")}
          </Button>
        </div>
      )}
    </form>
  );
}
