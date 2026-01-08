import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDown2, ArrowUp2 } from "iconsax-react";
import { ArrowRightIcon } from "@/shared/assets/icons";
import { FileUploader } from "@/shared/components";
import { useAppSelector } from "@/shared/hooks";
import { Button, DatePicker, Input, Toast } from "@/shared/ui";
import { formatDateToISO, type Locale } from "@/shared/utils";
import { useGetIdDocumentsQuery, useSubmitIdDocumentsMutation } from "./api";
import IdDocumentsFormSkeleton from "./IdDocumentsFormSkeleton";
import { createIdDocumentsSchema, type IdDocumentsFormValues } from "./validation";

interface Props {
  token: string;
  gender?: "male" | "female";
  openSubmit: () => void;
}

export default function IdDocumentsForm({ token, gender, openSubmit }: Props) {
  const { i18n, t } = useTranslation("ApplyApplicationPage");
  const locale = (i18n.language as Locale) || "ru";
  const isCompleted = useAppSelector((s) => s.completeness.data?.is_complete);
  const genderFromRedux = useAppSelector((s) => s.completeness.gender);
  const effectiveGender = gender ?? genderFromRedux;
  const isMilitaryRequired = effectiveGender === "male";
  const isMilitaryVisible = effectiveGender === null || effectiveGender === "male";

  const { data, isLoading, error } = useGetIdDocumentsQuery(token);
  const [submitDocuments, { isLoading: isSaving }] = useSubmitIdDocumentsMutation();

  const [toast, setToast] = useState<{
    text: string;
    color: "positive" | "negative" | "notice" | "grey";
  } | null>(null);

  const [openId, setOpenId] = useState(true);
  const [openMilitary, setOpenMilitary] = useState(true);
  const [isNationalFileRemoved, setIsNationalFileRemoved] = useState(false);
  const [isMilitaryFileRemoved, setIsMilitaryFileRemoved] = useState(false);

  const schema = useMemo(() => createIdDocumentsSchema(isMilitaryRequired), [isMilitaryRequired]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
    clearErrors,
  } = useForm<IdDocumentsFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      national_id_number: "",
      national_id_issue_date: null,
      national_id_expiry_date: null,
      national_id_issued_by: "",
      national_id_file: null,
      military_certificate_file: null,
    },
  });
  useEffect(() => {
    if (!isMilitaryRequired) {
      clearErrors("military_certificate_file");
    }
  }, [isMilitaryRequired, clearErrors]);

  useEffect(() => {
    if (data) {
      reset({
        national_id_number: data.national_id_number ?? "",
        national_id_issue_date: data.national_id_issue_date ? new Date(data.national_id_issue_date) : null,
        national_id_expiry_date: data.national_id_expiry_date ? new Date(data.national_id_expiry_date) : null,
        national_id_issued_by: data.national_id_issued_by ?? "",
        national_id_file: null,
        military_certificate_file: null,
      });
      setIsNationalFileRemoved(false);
      setIsMilitaryFileRemoved(false);
    }
  }, [data, reset]);

  const issueDate = watch("national_id_issue_date");
  const expiryDate = watch("national_id_expiry_date");
  const nationalFile = watch("national_id_file");
  const militaryFile = watch("military_certificate_file");

  async function onSubmit(values: IdDocumentsFormValues) {
    try {
      const hasNationalFromApi = !!data?.national_id_file_url && !isNationalFileRemoved;
      const hasNationalNewFile = !!values.national_id_file;

      if (!hasNationalFromApi && !hasNationalNewFile) {
        setToast({ color: "negative", text: "validation.id.file_required" });
        return;
      }

      const hasMilitaryFromApi = !!data?.military_certificate_file_url && !isMilitaryFileRemoved;
      const hasMilitaryNewFile = !!values.military_certificate_file;

      if (isMilitaryRequired && !hasMilitaryFromApi && !hasMilitaryNewFile) {
        setToast({ color: "negative", text: "validation.id.military_file_required" });
        return;
      }

      await submitDocuments({
        token,
        body: {
          national_id_number: values.national_id_number,
          national_id_issue_date: formatDateToISO(values.national_id_issue_date),
          national_id_expiry_date: formatDateToISO(values.national_id_expiry_date),
          national_id_issued_by: values.national_id_issued_by,
          national_id_file: hasNationalFromApi ? null : (values.national_id_file as File | null),
          military_certificate_file: hasMilitaryFromApi ? null : (values.military_certificate_file as File | null),
        },
      }).unwrap();

      setToast({ color: "positive", text: "id.toast.success" });
    } catch (e) {
      setToast({ color: "negative", text: "id.toast.error" });
      console.error("Ошибка при отправке документов", e);
    }
  }

  const isNotFound = error && typeof error === "object" && "status" in error && error.status === 404;
  if (isLoading && !data && !isNotFound) return <IdDocumentsFormSkeleton />;

  return (
    <form className="flex flex-col justify-between min-h-[640px] gap-7" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-7">
        <h2 className="text-display-2xs content-base-primary">{t("id.title")}</h2>

        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => setOpenId((v) => !v)}
            className="flex justify-between items-center pb-3 border-b surface-base-stroke cursor-pointer">
            <p className="text-body-bold-lg content-base-primary">{t("id.identity.title")}</p>

            <span className="input-box-shadow radius-2xs w-6 h-6 flex items-center justify-center content-base-secondary">
              {openId ? <ArrowUp2 size={16} color="currentColor" /> : <ArrowDown2 size={16} color="currentColor" />}
            </span>
          </button>

          {openId && (
            <div className="flex flex-col gap-4">
              <Input
                label={t("id.identity.number.label")}
                placeholder={t("id.identity.number.placeholder")}
                {...register("national_id_number")}
                error={errors.national_id_number?.message && t(errors.national_id_number.message)}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-black dark:text-white">
                    {t("id.identity.issue_date.label")}
                  </label>
                  <DatePicker
                    mode="single"
                    locale={locale}
                    value={issueDate}
                    placeholder={t("id.identity.issue_date.placeholder")}
                    onChange={(v) => setValue("national_id_issue_date", (v as Date) ?? null)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-black dark:text-white">
                    {t("id.identity.expiry_date.label")}
                  </label>
                  <DatePicker
                    mode="single"
                    locale={locale}
                    value={expiryDate}
                    placeholder={t("id.identity.expiry_date.placeholder")}
                    onChange={(v) => setValue("national_id_expiry_date", (v as Date) ?? null)}
                  />
                </div>
              </div>

              <Input
                label={t("id.identity.issued_by.label")}
                placeholder={t("id.identity.issued_by.placeholder")}
                {...register("national_id_issued_by")}
                error={errors.national_id_issued_by?.message && t(errors.national_id_issued_by.message)}
              />

              <FileUploader
                label={t("id.identity.file.label")}
                value={nationalFile}
                existingFileUrl={!isNationalFileRemoved ? data?.national_id_file_url : null}
                onChange={(file) => {
                  setValue("national_id_file", file, { shouldValidate: true });
                  if (file) setIsNationalFileRemoved(false);
                }}
                onRemoveExisting={() => {
                  setIsNationalFileRemoved(true);
                  setValue("national_id_file", null);
                }}
                error={errors.national_id_file?.message ? t(errors.national_id_file.message as string) : null}
              />
            </div>
          )}
        </div>

        {isMilitaryVisible && (
          <div className="flex flex-col gap-4">
            <button
              type="button"
              onClick={() => setOpenMilitary((v) => !v)}
              className="flex justify-between items-center pb-3 border-b surface-base-stroke cursor-pointer">
              <p className="text-body-bold-lg content-base-primary">{t("id.military.title")}</p>

              <span className="input-box-shadow radius-2xs w-6 h-6 flex items-center justify-center content-base-secondary">
                {openMilitary ? (
                  <ArrowUp2 size={16} color="currentColor" />
                ) : (
                  <ArrowDown2 size={16} color="currentColor" />
                )}
              </span>
            </button>

            {openMilitary && (
              <div className="flex flex-col gap-4">
                <FileUploader
                  label={t("id.military.file.label")}
                  value={militaryFile}
                  existingFileUrl={!isMilitaryFileRemoved ? data?.military_certificate_file_url : null}
                  onChange={(file) => {
                    setValue("military_certificate_file", file, { shouldValidate: true });
                    if (file) setIsMilitaryFileRemoved(false);
                  }}
                  onRemoveExisting={() => {
                    setIsMilitaryFileRemoved(true);
                    setValue("military_certificate_file", null);
                  }}
                  error={
                    errors.military_certificate_file?.message
                      ? t(errors.military_certificate_file.message as string)
                      : null
                  }
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3">
        {toast && (
          <Toast
            key={`${toast.color}-${toast.text}`}
            color={toast.color}
            text={t(toast.text)}
            isFullWidth
            onClose={() => setToast(null)}
          />
        )}

        <Button variant="secondary" size="lg" disabled={!isCompleted || isSaving} onClick={openSubmit}>
          {t("id.submit_review")}
        </Button>

        <Button variant="primary" size="lg" type="submit" disabled={isSaving}>
          {isSaving ? t("id.saving") : t("id.save")}
          {!isSaving && (
            <span className="text-white">
              <ArrowRightIcon />
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}
