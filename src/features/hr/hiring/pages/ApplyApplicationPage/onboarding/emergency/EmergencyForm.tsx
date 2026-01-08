import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ArrowDown2, ArrowUp2 } from "iconsax-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon } from "@/shared/assets/icons";
import { useAppSelector } from "@/shared/hooks";
import { Button, Input, Select, Toast } from "@/shared/ui";
import { useGetEmergencyContactsQuery, useUpdateEmergencyContactsMutation } from "./api";
import EmergencyContactsSkeleton from "./EmergencyFormSkeleton";
import { type EmergencyContactsFormValues, emergencyContactsSchema } from "./validation";

interface Props {
  token: string;
  openSubmit: () => void;
}

export default function EmergencyContactsForm({ token, openSubmit }: Props) {
  const { t } = useTranslation("ApplyApplicationPage");
  const isCompleted = useAppSelector((s) => s.completeness.data?.is_complete);

  const { data, isLoading, error } = useGetEmergencyContactsQuery(token);
  const [updateContacts, { isLoading: isSaving }] = useUpdateEmergencyContactsMutation();

  const [toast, setToast] = useState<{
    text: string;
    color: "positive" | "negative" | "notice" | "grey";
  } | null>(null);

  const [open1, setOpen1] = useState(true);
  const [open2, setOpen2] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    watch,
  } = useForm<EmergencyContactsFormValues>({
    resolver: zodResolver(emergencyContactsSchema),
    defaultValues: {
      contact_1: { name: "", phone: "", relation: "" },
      contact_2: { name: "", phone: "", relation: "" },
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        contact_1: {
          name: data.contact_1?.name || "",
          phone: data.contact_1?.phone || "",
          relation: data.contact_1?.relation || "",
        },
        contact_2: {
          name: data.contact_2?.name || "",
          phone: data.contact_2?.phone || "",
          relation: data.contact_2?.relation || "",
        },
      });
    }
  }, [data, reset]);

  const isNotFound = error && typeof error === "object" && "status" in error && error.status === 404;

  async function onSubmit(values: EmergencyContactsFormValues) {
    try {
      await updateContacts({ token, body: values }).unwrap();
      setToast({
        color: "positive",
        text: "emergency.toast.success",
      });
    } catch {
      setToast({
        color: "negative",
        text: "emergency.toast.error",
      });
    }
  }

  if (isLoading && !data && !isNotFound) return <EmergencyContactsSkeleton />;

  return (
    <form className="flex flex-col justify-between min-h-[640px] gap-7" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-7">
        <h2 className="text-display-2xs content-base-primary">{t("emergency.title")}</h2>
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => setOpen1((v) => !v)}
            className="flex justify-between items-center pb-3 border-b surface-base-stroke cursor-pointer">
            <p className="text-body-bold-lg content-base-primary">{t("emergency.contact_1.title")}</p>

            <span className="input-box-shadow radius-2xs w-6 h-6 flex items-center justify-center content-base-secondary">
              {open1 ? <ArrowUp2 size={16} color="currentColor" /> : <ArrowDown2 size={16} color="currentColor" />}
            </span>
          </button>

          {open1 && (
            <div className="flex flex-col gap-4">
              <Input
                label={t("emergency.name.label")}
                placeholder={t("emergency.name.placeholder")}
                {...register("contact_1.name")}
                error={errors.contact_1?.name?.message && t(errors.contact_1.name.message)}
              />
              <div className="flex flex-col gap-2">
                <label className="text-sm text-black dark:text-white leading-5 font-semibold">
                  {t("emergency.relation.label")}
                </label>

                <Select
                  options={[
                    { label: t("emergency.relation.mother"), value: "mother" },
                    { label: t("emergency.relation.father"), value: "father" },
                    { label: t("emergency.relation.spouse"), value: "spouse" },
                    {
                      label: t("emergency.relation.sibling"),
                      value: "sibling",
                    },
                    { label: t("emergency.relation.other"), value: "other" },
                  ]}
                  value={watch("contact_1.relation")}
                  onChange={(v) =>
                    setValue("contact_1.relation", v ?? "", {
                      shouldValidate: true,
                    })
                  }
                  placeholder={t("emergency.relation.placeholder")}
                />

                {errors.contact_1?.relation && (
                  <p className="text-body-regular-xs content-action-negative">
                    {t(errors.contact_1.relation.message!)}
                  </p>
                )}
              </div>

              <Input
                label={t("emergency.phone.label")}
                placeholder={t("emergency.phone.placeholder")}
                {...register("contact_1.phone")}
                error={errors.contact_1?.phone?.message && t(errors.contact_1.phone.message)}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => setOpen2((v) => !v)}
            className="flex justify-between items-center pb-3 border-b surface-base-stroke cursor-pointer">
            <p className="text-body-bold-lg content-base-primary">{t("emergency.contact_2.title")}</p>

            <span className="input-box-shadow radius-2xs w-6 h-6 flex items-center justify-center content-base-secondary">
              {open2 ? <ArrowUp2 size={16} color="currentColor" /> : <ArrowDown2 size={16} color="currentColor" />}
            </span>
          </button>

          {open2 && (
            <div className="flex flex-col gap-4">
              <Input
                label={t("emergency.name.label")}
                placeholder={t("emergency.name.placeholder")}
                {...register("contact_2.name")}
                error={errors.contact_2?.name?.message && t(errors.contact_2.name.message)}
              />

              <div className="flex flex-col gap-2">
                <label className="text-sm text-black dark:text-white leading-5 font-semibold">
                  {t("emergency.relation.label")}
                </label>

                <Select
                  options={[
                    { label: t("emergency.relation.mother"), value: "mother" },
                    { label: t("emergency.relation.father"), value: "father" },
                    { label: t("emergency.relation.spouse"), value: "spouse" },
                    {
                      label: t("emergency.relation.sibling"),
                      value: "sibling",
                    },
                    { label: t("emergency.relation.other"), value: "other" },
                  ]}
                  value={watch("contact_2.relation")}
                  onChange={(v) =>
                    setValue("contact_2.relation", v ?? "", {
                      shouldValidate: true,
                    })
                  }
                  placeholder={t("emergency.relation.placeholder")}
                />

                {errors.contact_2?.relation && (
                  <p className="text-body-regular-xs content-action-negative">
                    {t(errors.contact_2.relation.message!)}
                  </p>
                )}
              </div>

              <Input
                label={t("emergency.phone.label")}
                placeholder={t("emergency.phone.placeholder")}
                {...register("contact_2.phone")}
                error={errors.contact_2?.phone?.message && t(errors.contact_2.phone.message)}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end items-center gap-3">
        {toast && (
          <Toast
            key={`${toast.color}-${toast.text}`}
            color={toast.color}
            text={t(toast.text)}
            onClose={() => setToast(null)}
          />
        )}

        <Button variant="secondary" size="lg" disabled={!isCompleted || isSaving} onClick={openSubmit}>
          {t("emergency.submit_review")}
        </Button>

        <Button variant="primary" size="lg" type="submit" disabled={isSaving}>
          {isSaving ? t("emergency.saving") : t("emergency.save")}
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
