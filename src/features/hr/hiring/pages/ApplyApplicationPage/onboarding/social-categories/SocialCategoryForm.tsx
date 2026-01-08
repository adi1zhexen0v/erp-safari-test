import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon } from "@/shared/assets/icons";
import { FileUploader } from "@/shared/components";
import { Button, DatePicker, Input, Select, Toast } from "@/shared/ui";
import { formatDateToISO, type Locale } from "@/shared/utils";
import { SOCIAL_CATEGORY_OPTIONS } from "@/features/hr/hiring";
import { useCreateSocialCategoryMutation } from "./api";
import { type SocialCategoryFormValues, socialCategorySchema } from "./validation";

interface Props {
  token: string;
  onCancel: () => void;
  onSuccess: () => void;
  onToast?: (toast: { text: string; color: "positive" | "negative" | "notice" | "grey" }) => void;
}

export default function SocialCategoryForm({ token, onCancel, onSuccess, onToast }: Props) {
  const { i18n, t } = useTranslation("ApplyApplicationPage");
  const locale = (i18n.language as Locale) || "ru";
  const [createCategory, { isLoading: isSaving }] = useCreateSocialCategoryMutation();

  const [toast, setToast] = useState<{
    text: string;
    color: "positive" | "negative" | "notice" | "grey";
  } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SocialCategoryFormValues>({
    resolver: zodResolver(socialCategorySchema),
    defaultValues: {
      category_type: "",
      document_file: null,
      issue_date: "",
      expiry_date: "",
      notes: "",
    },
  });

  const categoryType = watch("category_type");
  const documentFile = watch("document_file");
  const issueDate = watch("issue_date");
  const expiryDate = watch("expiry_date");

  async function onSubmit(values: SocialCategoryFormValues) {
    if (!values.document_file || !(values.document_file instanceof File)) {
      return;
    }

    try {
      await createCategory({
        token,
        body: {
          category_type: values.category_type,
          document_file: values.document_file,
          issue_date: values.issue_date ? formatDateToISO(values.issue_date) : undefined,
          expiry_date: values.expiry_date ? formatDateToISO(values.expiry_date) : undefined,
          notes: values.notes,
        },
      }).unwrap();

      if (onToast) {
        onToast({ color: "positive", text: "social.toast.success" });
      } else {
        setToast({ color: "positive", text: "social.toast.success" });
      }
      onSuccess();
    } catch (e) {
      setToast({ color: "negative", text: "social.toast.error" });
      console.error("Ошибка при создании социальной категории", e);
    }
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <p className="text-body-bold-lg">{t("social.title")}</p>

      <div className="flex flex-col gap-2 w-full">
        <label className="text-sm font-semibold">{t("social.category.label")}</label>
        <Select
          options={SOCIAL_CATEGORY_OPTIONS.map((opt) => ({
            label: t(`social.categories.${opt.labelKey}`),
            value: opt.value,
          }))}
          value={categoryType}
          onChange={(v) => setValue("category_type", v ?? "", { shouldValidate: true })}
          placeholder={t("social.category.placeholder")}
        />
        {errors.category_type && (
          <p className="text-body-regular-xs content-action-negative">{t(errors.category_type.message as string)}</p>
        )}
      </div>

      <FileUploader
        label={t("social.document.label")}
        value={documentFile}
        onChange={(file) => {
          setValue("document_file", file ?? null, { shouldValidate: true });
        }}
        error={errors.document_file?.message ? t(errors.document_file.message as string) : null}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">{t("social.issue_date.label")}</label>
          <DatePicker
            mode="single"
            locale={locale}
            value={issueDate ? new Date(issueDate) : null}
            placeholder={t("social.issue_date.placeholder")}
            onChange={(v) => setValue("issue_date", v ? formatDateToISO(v as Date) : "", { shouldValidate: true })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">{t("social.expiry_date.label")}</label>
          <DatePicker
            mode="single"
            locale={locale}
            value={expiryDate ? new Date(expiryDate) : null}
            placeholder={t("social.expiry_date.placeholder")}
            onChange={(v) => setValue("expiry_date", v ? formatDateToISO(v as Date) : "", { shouldValidate: true })}
          />
        </div>
      </div>

      <Input
        isTextarea
        label={t("social.notes.label")}
        placeholder={t("social.notes.placeholder")}
        {...register("notes")}
        error={errors.notes?.message && t(errors.notes.message)}
      />

      <div className="flex justify-end pt-4 gap-3">
        {toast && (
          <Toast
            key={`${toast.color}-${toast.text}`}
            color={toast.color}
            text={t(toast.text)}
            onClose={() => setToast(null)}
          />
        )}
        <Button variant="secondary" size="lg" onClick={onCancel} disabled={isSaving}>
          {t("social.cancel")}
        </Button>
        <Button variant="primary" size="lg" type="submit" disabled={isSaving}>
          {isSaving ? t("social.saving") : t("social.save")}
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
