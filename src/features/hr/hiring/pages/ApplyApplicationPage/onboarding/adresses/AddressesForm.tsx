import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon } from "@/shared/assets/icons";
import { useAppSelector } from "@/shared/hooks";
import { Button, Input, Toast } from "@/shared/ui";
import AddressesFormSkeleton from "./AddressesFormSkeleton";
import { useGetAddressesQuery, useUpdateAddressesMutation } from "./api";
import { type AddressesFormValues, addressesSchema } from "./validation";

interface Props {
  token: string;
  openSubmit: () => void;
}

export default function AddressesForm({ token, openSubmit }: Props) {
  const { t } = useTranslation("ApplyApplicationPage");
  const isCompleted = useAppSelector((s) => s.completeness.data?.is_complete);

  const { data, isLoading } = useGetAddressesQuery(token);
  const [updateAddresses, { isLoading: isSaving }] = useUpdateAddressesMutation();

  const [toast, setToast] = useState<{
    text: string;
    color: "positive" | "negative" | "notice" | "grey";
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressesFormValues>({
    resolver: zodResolver(addressesSchema),
    defaultValues: {
      address_registration: "",
      address_factual: "",
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        address_registration: data.address_registration ?? "",
        address_factual: data.address_factual ?? "",
      });
    }
  }, [data, reset]);

  async function onSubmit(values: AddressesFormValues) {
    try {
      await updateAddresses({
        token,
        body: values,
      }).unwrap();

      setToast({
        color: "positive",
        text: "addresses.toast.success",
      });
    } catch (e) {
      setToast({
        color: "negative",
        text: "addresses.toast.error",
      });
      console.error("Ошибка при обновлении адресов", e);
    }
  }

  if (isLoading && !data) return <AddressesFormSkeleton />;

  return (
    <form className="flex flex-col justify-between min-h-[520px] gap-7" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-7">
        <h2 className="text-display-2xs content-base-primary">{t("addresses.title")}</h2>

        <div className="flex flex-col gap-4">
          <Input
            label={t("addresses.registration.label")}
            placeholder={t("addresses.registration.placeholder")}
            {...register("address_registration")}
            error={errors.address_registration?.message && t(errors.address_registration.message)}
          />

          <Input
            label={t("addresses.actual.label")}
            placeholder={t("addresses.actual.placeholder")}
            {...register("address_factual")}
            error={errors.address_factual?.message && t(errors.address_factual.message)}
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
          {t("addresses.submit_review")}
        </Button>

        <Button variant="primary" size="lg" type="submit" disabled={isSaving}>
          {isSaving ? t("addresses.saving") : t("addresses.save")}
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
