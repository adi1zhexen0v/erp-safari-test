import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon } from "@/shared/assets/icons";
import { useAppSelector } from "@/shared/hooks";
import { Button, Input, Toast } from "@/shared/ui";
import { useGetContactsQuery, useUpdateContactsMutation } from "./api";
import ContactsFormSkeleton from "./ContactsFormSkeleton";
import { type ContactsFormValues, contactsSchema } from "./validation";

interface Props {
  token: string;
  openSubmit: () => void;
}

export default function ContactsForm({ token, openSubmit }: Props) {
  const { t } = useTranslation("ApplyApplicationPage");

  const isCompleted = useAppSelector((s) => s.completeness.data?.is_complete);
  const { data, isLoading, error } = useGetContactsQuery(token);
  const [updateContacts, { isLoading: isSaving }] = useUpdateContactsMutation();

  const [toast, setToast] = useState<{
    text: string;
    color: "positive" | "negative" | "notice" | "grey";
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactsFormValues>({
    resolver: zodResolver(contactsSchema),
    defaultValues: {
      email: "",
      phone: "",
      phone_additional: "",
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        email: data.email ?? "",
        phone: data.phone ?? "",
        phone_additional: data.phone_additional ?? "",
      });
    }
  }, [data, reset]);

  const isNotFound = error && typeof error === "object" && "status" in error && error.status === 404;

  async function onSubmit(values: ContactsFormValues) {
    try {
      await updateContacts({
        token,
        body: {
          ...values,
          phone_additional: values.phone_additional ?? "",
        },
      }).unwrap();

      setToast({
        color: "positive",
        text: "contacts.toast.success",
      });
    } catch (e) {
      setToast({
        color: "negative",
        text: "contacts.toast.error",
      });
      console.error("Ошибка при обновлении контактов", e);
    }
  }

  if (isLoading && !data && !isNotFound) return <ContactsFormSkeleton />;

  return (
    <form className="flex flex-col justify-between min-h-[640px] gap-7" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-7">
        <h2 className="text-display-2xs content-base-primary">{t("contacts.title")}</h2>

        <div className="flex flex-col gap-4">
          <Input
            label={t("contacts.email.label")}
            placeholder={t("contacts.email.placeholder")}
            {...register("email")}
            error={errors.email?.message && t(errors.email.message)}
          />

          <Input
            label={t("contacts.phone.label")}
            placeholder={t("contacts.phone.placeholder")}
            {...register("phone")}
            error={errors.phone?.message && t(errors.phone.message)}
          />

          <Input
            label={t("contacts.phone_additional.label")}
            placeholder={t("contacts.phone_additional.placeholder")}
            {...register("phone_additional")}
            error={errors.phone_additional?.message && t(errors.phone_additional.message)}
          />
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
          {t("contacts.submit_review")}
        </Button>

        <Button variant="primary" size="lg" type="submit" disabled={isSaving}>
          {isSaving ? t("contacts.saving") : t("contacts.save")}
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
